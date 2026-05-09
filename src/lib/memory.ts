/**
 * Shared Memory Layer
 * This is the cross-pollination engine.
 * Before each conversation: load relevant insights from the team.
 * After significant conversations: extract and store new insights.
 */

import { getServiceSupabase } from "./supabase";

export interface InsightInput {
  category: string;
  title: string;
  content: string;
  source_agent: string;
  source_user: string;
  relevance_teams: string[];
  confidence: string;
}

// Load recent shared insights relevant to a team
export async function loadSharedMemory(
  team: string,
  limit: number = 20
): Promise<string> {
  const db = getServiceSupabase();

  const { data: insights } = await db
    .from("shared_insights")
    .select("*")
    .contains("relevance_teams", [team])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!insights || insights.length === 0) {
    return "No shared insights available yet. You are starting fresh.";
  }

  const formatted = insights
    .map(
      (i: any) =>
        `[${i.category}] ${i.title} (${i.confidence} confidence, from ${i.source_agent}/${i.source_user})\n${i.content}`
    )
    .join("\n\n---\n\n");

  return `# Shared Team Intelligence (${insights.length} recent insights)\n\n${formatted}`;
}

// Store a new insight from a conversation
export async function storeInsight(insight: InsightInput): Promise<void> {
  const db = getServiceSupabase();

  await db.from("shared_insights").insert({
    category: insight.category,
    title: insight.title,
    content: insight.content,
    source_agent: insight.source_agent,
    source_user: insight.source_user,
    relevance_teams: insight.relevance_teams,
    confidence: insight.confidence,
  });
}

// Load recent pipeline data for context
export async function loadPipelineContext(): Promise<string> {
  const db = getServiceSupabase();

  const { data: deals } = await db
    .from("pipeline")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(20);

  if (!deals || deals.length === 0) {
    return "Pipeline is empty.";
  }

  const formatted = deals
    .map(
      (d: any) =>
        `${d.company} | ${d.stage} | ${d.estimated_revenue ? `${d.currency} ${d.estimated_revenue}` : "TBD"} | ${d.close_probability || "?"}% | Owner: ${d.owner || "unassigned"}`
    )
    .join("\n");

  return `# Current Pipeline (${deals.length} deals)\n\nCompany | Stage | Revenue | Probability | Owner\n${formatted}`;
}

// Log activity for audit trail
export async function logActivity(
  userId: string,
  agentName: string,
  actionType: string,
  summary: string,
  metadata?: Record<string, any>
): Promise<void> {
  const db = getServiceSupabase();

  await db.from("activity_log").insert({
    user_id: userId,
    agent_name: agentName,
    action_type: actionType,
    summary,
    metadata,
  });
}

// Build the shared memory context block that gets injected into every agent conversation
export async function buildMemoryContext(agentTeam: string): Promise<string> {
  const [sharedInsights, pipeline] = await Promise.all([
    loadSharedMemory(agentTeam),
    loadPipelineContext(),
  ]);

  return `
---
# SHARED TEAM MEMORY
# This context comes from your teammates' conversations. Use it to cross-pollinate insights.

${sharedInsights}

${pipeline}

---
# IMPORTANT: If you learn something significant in this conversation that other teams should know,
# end your response with a CROSS-TEAM block:
# CROSS-TEAM: [team_name] should know that [insight]
# The system will automatically extract and store these as shared insights.
`;
}
