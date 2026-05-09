import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgent } from "@/lib/agents";
import { buildFullKnowledge, BEHAVIORAL_CONTRACT } from "@/lib/knowledge";
import { buildMemoryContext, storeInsight, logActivity } from "@/lib/memory";
import { getServiceSupabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentName,
      messages,
      userId,
      userName,
      conversationId,
    }: {
      agentName: string;
      messages: ChatMessage[];
      userId: string;
      userName: string;
      conversationId?: string;
    } = body;

    // Get agent config
    const agent = getAgent(agentName);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent "${agentName}" not found` },
        { status: 404 }
      );
    }

    // Build shared memory context
    const memoryContext = await buildMemoryContext(agent.team);

    // Assemble system prompt: agent instructions + company knowledge + shared memory
    const systemPrompt = `# You are ${agent.name}
## Role: ${agent.role}
## Team: ${agent.team.toUpperCase()}
## Current user: ${userName}

${BEHAVIORAL_CONTRACT}

---

# Your Knowledge Base

${buildFullKnowledge()}

---

# Your Specific Instructions

${agent.systemPrompt}

${memoryContext}
`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract response text
    const assistantMessage =
      response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n") || "";

    // Save conversation to database
    const db = getServiceSupabase();

    let convId = conversationId;
    if (!convId) {
      // Create new conversation
      const { data: conv } = await db
        .from("conversations")
        .insert({
          user_id: userId,
          agent_name: agentName,
          agent_team: agent.team,
          title: messages[0]?.content.slice(0, 100) || "New conversation",
        })
        .select("id")
        .single();
      convId = conv?.id;
    }

    if (convId) {
      // Save messages
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg) {
        await db.from("messages").insert({
          conversation_id: convId,
          role: "user",
          content: lastUserMsg.content,
        });
      }
      await db.from("messages").insert({
        conversation_id: convId,
        role: "assistant",
        content: assistantMessage,
      });

      // Update conversation timestamp
      await db
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);
    }

    // Extract CROSS-TEAM insights and store them
    const crossTeamMatch = assistantMessage.match(
      /CROSS-TEAM:\s*\[(\w+)\]\s*should know that\s*(.*?)(?:\n|$)/gi
    );
    if (crossTeamMatch) {
      for (const match of crossTeamMatch) {
        const parsed = match.match(
          /CROSS-TEAM:\s*\[(\w+)\]\s*should know that\s*(.*)/i
        );
        if (parsed) {
          await storeInsight({
            category: "deal_intelligence",
            title: `Cross-team insight from ${agent.name}`,
            content: parsed[2] || "",
            source_agent: agent.name,
            source_user: userName,
            relevance_teams: [parsed[1]!.toLowerCase(), agent.team],
            confidence: "MODERATE",
          });
        }
      }
    }

    // Log activity
    await logActivity(userId, agentName, "chat", `Chat with ${agent.name}: ${messages[0]?.content.slice(0, 80) || ""}`)
      .catch(() => {}); // Don't fail the response if logging fails

    return NextResponse.json({
      message: assistantMessage,
      conversationId: convId,
      agent: {
        name: agent.name,
        team: agent.team,
        icon: agent.icon,
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
