"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
}

interface Agent {
  name: string;
  team: string;
  role: string;
  icon: string;
  availableTo: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Insight {
  id: string;
  category: string;
  title: string;
  content: string;
  source_agent: string;
  source_user: string;
  confidence: string;
  created_at: string;
}

// ─── Agent Data (client-side copy for UI) ───────────────────────────────────

const ALL_AGENTS: Agent[] = [
  // Solutions
  { name: "deep-intelligence", team: "solutions", role: "Prospect research engine", icon: "🔍", availableTo: ["founder", "sales"] },
  { name: "outreach", team: "solutions", role: "Personalized email drafting", icon: "✉️", availableTo: ["founder", "sales"] },
  { name: "proposal-builder", team: "solutions", role: "Client-ready proposals", icon: "📋", availableTo: ["founder", "sales", "operations"] },
  { name: "pipeline", team: "solutions", role: "CRM and deal tracking", icon: "📊", availableTo: ["founder", "sales"] },
  { name: "follow-up", team: "solutions", role: "Follow-up cadence manager", icon: "🔄", availableTo: ["founder", "sales"] },
  { name: "impact-crosssell", team: "solutions", role: "Impact reports & upsell", icon: "📈", availableTo: ["founder", "sales", "operations"] },
  // Media
  { name: "news-scanner", team: "media", role: "Daily climate news intel", icon: "📡", availableTo: ["founder", "media"] },
  { name: "scriptwriter", team: "media", role: "VO scripts & captions", icon: "✍️", availableTo: ["founder", "media"] },
  { name: "visual-director", team: "media", role: "Storyboards & visual style", icon: "🎨", availableTo: ["founder", "media"] },
  { name: "editor", team: "media", role: "Video assembly via ffmpeg", icon: "🎬", availableTo: ["media"] },
  { name: "distribution", team: "media", role: "Schedule & publish content", icon: "📤", availableTo: ["founder", "media"] },
  { name: "analytics", team: "media", role: "Content performance tracking", icon: "📉", availableTo: ["founder", "media"] },
  { name: "channel-strategist", team: "media", role: "Multi-platform strategy", icon: "🧠", availableTo: ["founder", "media"] },
  // Finance
  { name: "invoicing", team: "finance", role: "GST-compliant invoices", icon: "🧾", availableTo: ["founder", "finance"] },
  { name: "collections", team: "finance", role: "Payment follow-ups", icon: "💰", availableTo: ["founder", "finance"] },
  { name: "unit-economics", team: "finance", role: "Deal margins & profitability", icon: "🔢", availableTo: ["founder", "finance", "sales"] },
  { name: "mis-dashboard", team: "finance", role: "Real-time MIS", icon: "📊", availableTo: ["founder", "finance"] },
  { name: "investor-reporting", team: "finance", role: "Investor updates & board decks", icon: "🏦", availableTo: ["founder"] },
  // Operations
  { name: "event-planner", team: "operations", role: "Event delivery coordination", icon: "🎪", availableTo: ["founder", "operations"] },
  { name: "feasibility-engine", team: "operations", role: "Technical feasibility analysis", icon: "⚡", availableTo: ["founder", "sales", "operations"] },
  { name: "fleet-manager", team: "operations", role: "EV fleet operations", icon: "🚗", availableTo: ["founder", "operations"] },
  { name: "energy-bess", team: "operations", role: "Battery storage & solar", icon: "🔋", availableTo: ["founder", "operations"] },
  { name: "water-waste", team: "operations", role: "Water & waste operations", icon: "💧", availableTo: ["founder", "operations"] },
  { name: "vendor-manager", team: "operations", role: "Vendor sourcing & contracts", icon: "🤝", availableTo: ["founder", "operations", "finance"] },
  { name: "compliance", team: "operations", role: "Regulatory compliance", icon: "📜", availableTo: ["founder", "operations", "finance"] },
  // Founder
  { name: "orchestrator", team: "founder", role: "Task routing & weekly briefs", icon: "🎯", availableTo: ["founder"] },
  { name: "founder-dashboard", team: "founder", role: "Founder-readable briefs", icon: "🖥️", availableTo: ["founder"] },
  { name: "knowledge-updater", team: "founder", role: "Auto-learning & KB maintenance", icon: "🧬", availableTo: ["founder"] },
];

const TEAM_COLORS: Record<string, string> = {
  solutions: "#3b82f6",
  media: "#a855f7",
  finance: "#22c55e",
  operations: "#f97316",
  founder: "#ef4444",
};

// ─── Login Screen ───────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accessCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Store in sessionStorage
      sessionStorage.setItem("raios_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError("Connection failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">RAIOS</h1>
          <p className="text-raios-muted text-sm">
            Recube AI Operating System
          </p>
          <p className="text-raios-muted text-xs mt-1">
            28 agents. 5 teams. Shared memory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-raios-card border border-raios-border rounded-lg px-4 py-3 text-white placeholder-raios-muted focus:outline-none focus:border-raios-accent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Team access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-raios-card border border-raios-border rounded-lg px-4 py-3 text-white placeholder-raios-muted focus:outline-none focus:border-raios-accent"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-raios-accent text-black font-semibold py-3 rounded-lg hover:bg-raios-accent-dim transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Agent Sidebar ──────────────────────────────────────────────────────────

function AgentSidebar({
  user,
  agents,
  selectedAgent,
  onSelectAgent,
  onLogout,
  showInsights,
  onToggleInsights,
}: {
  user: User;
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  onLogout: () => void;
  showInsights: boolean;
  onToggleInsights: () => void;
}) {
  const teams = ["solutions", "media", "finance", "operations", "founder"];
  const groupedAgents = teams
    .map((team) => ({
      team,
      agents: agents.filter((a) => a.team === team),
    }))
    .filter((g) => g.agents.length > 0);

  return (
    <div className="w-72 bg-raios-card border-r border-raios-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-raios-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">RAIOS</h2>
            <p className="text-raios-muted text-xs">{user.name} ({user.role})</p>
          </div>
          <button
            onClick={onLogout}
            className="text-raios-muted hover:text-white text-xs"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {groupedAgents.map(({ team, agents: teamAgents }) => (
          <div key={team}>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-2 px-2"
              style={{ color: TEAM_COLORS[team] }}
            >
              {team}
            </h3>
            <div className="space-y-0.5">
              {teamAgents.map((agent) => (
                <button
                  key={agent.name}
                  onClick={() => onSelectAgent(agent)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedAgent?.name === agent.name
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{agent.icon}</span>
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shared Memory toggle */}
      <div className="p-3 border-t border-raios-border">
        <button
          onClick={onToggleInsights}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            showInsights
              ? "bg-raios-accent/20 text-raios-accent"
              : "text-raios-muted hover:text-white hover:bg-white/5"
          }`}
        >
          🧠 Shared Memory
        </button>
      </div>
    </div>
  );
}

// ─── Chat Interface ─────────────────────────────────────────────────────────

function ChatPanel({
  user,
  agent,
}: {
  user: User;
  agent: Agent;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset conversation when agent changes
  useEffect(() => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    inputRef.current?.focus();
  }, [agent.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agent.name,
          messages: newMessages,
          userId: user.id,
          userName: user.name,
          conversationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
        return;
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Connection failed. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, agent.name, user, conversationId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Agent header */}
      <div className="border-b border-raios-border px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">{agent.icon}</span>
        <div>
          <h2 className="text-white font-semibold">{agent.name}</h2>
          <p className="text-raios-muted text-xs">{agent.role}</p>
        </div>
        <div
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: `${TEAM_COLORS[agent.team]}20`,
            color: TEAM_COLORS[agent.team],
          }}
        >
          {agent.team}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-raios-muted mt-20">
            <p className="text-4xl mb-4">{agent.icon}</p>
            <p className="text-lg">Start a conversation with {agent.name}</p>
            <p className="text-sm mt-1">{agent.role}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-raios-accent text-black"
                  : "bg-raios-surface text-zinc-200 border border-raios-border"
              }`}
            >
              <div className="message-content whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-raios-surface border border-raios-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-raios-muted text-sm">
                <div className="animate-pulse">●</div>
                <span>{agent.name} is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-raios-border p-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name}...`}
            rows={1}
            className="flex-1 bg-raios-surface border border-raios-border rounded-xl px-4 py-3 text-white placeholder-raios-muted resize-none focus:outline-none focus:border-raios-accent text-sm"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-raios-accent text-black px-5 py-3 rounded-xl font-medium hover:bg-raios-accent-dim transition-colors disabled:opacity-30 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Insights Panel ─────────────────────────────────────────────────────────

function InsightsPanel({ user }: { user: User }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/insights?team=${user.role}&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setInsights(data.insights || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.role]);

  const categoryColors: Record<string, string> = {
    deal_intelligence: "#3b82f6",
    pricing_update: "#22c55e",
    market_signal: "#f97316",
    operational_learning: "#a855f7",
    client_feedback: "#ec4899",
    content_pattern: "#8b5cf6",
    team_decision: "#ef4444",
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="border-b border-raios-border px-6 py-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          🧠 Shared Team Memory
        </h2>
        <p className="text-raios-muted text-xs mt-1">
          Cross-pollinated insights from all team conversations
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading && (
          <p className="text-raios-muted text-center mt-10">Loading insights...</p>
        )}

        {!loading && insights.length === 0 && (
          <div className="text-center text-raios-muted mt-20">
            <p className="text-4xl mb-4">🧠</p>
            <p>No shared insights yet.</p>
            <p className="text-sm mt-1">
              Start conversations with agents — their learnings will appear here.
            </p>
          </div>
        )}

        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-raios-surface border border-raios-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${categoryColors[insight.category] || "#666"}20`,
                  color: categoryColors[insight.category] || "#666",
                }}
              >
                {insight.category.replace("_", " ")}
              </span>
              <span className="text-xs text-raios-muted">
                {insight.confidence}
              </span>
              <span className="text-xs text-raios-muted ml-auto">
                {new Date(insight.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">
              {insight.title}
            </h3>
            <p className="text-zinc-400 text-sm">{insight.content}</p>
            <p className="text-raios-muted text-xs mt-2">
              via {insight.source_agent} / {insight.source_user}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Check for existing session
  useEffect(() => {
    const stored = sessionStorage.getItem("raios_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("raios_user");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("raios_user");
    setUser(null);
    setSelectedAgent(null);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  // Filter agents by user's role
  const availableAgents = ALL_AGENTS.filter((a) =>
    a.availableTo.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-raios-dark">
      <AgentSidebar
        user={user}
        agents={availableAgents}
        selectedAgent={selectedAgent}
        onSelectAgent={(agent) => {
          setSelectedAgent(agent);
          setShowInsights(false);
        }}
        onLogout={handleLogout}
        showInsights={showInsights}
        onToggleInsights={() => {
          setShowInsights(!showInsights);
          if (!showInsights) setSelectedAgent(null);
        }}
      />

      {showInsights ? (
        <InsightsPanel user={user} />
      ) : selectedAgent ? (
        <ChatPanel user={user} agent={selectedAgent} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-raios-muted">
            <p className="text-6xl mb-4">⚡</p>
            <h2 className="text-xl text-white font-semibold mb-2">
              Welcome back, {user.name}
            </h2>
            <p className="text-sm">
              Select an agent from the sidebar to start working.
            </p>
            <p className="text-xs mt-1">
              {availableAgents.length} agents available for your role.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
