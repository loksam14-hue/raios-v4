export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "founder" | "sales" | "media" | "finance" | "operations";
  is_admin: boolean;
}

export interface AgentConfig {
  name: string;
  team: string;
  role: string;
  icon: string;
  systemPrompt: string;
  availableTo: string[]; // Which roles can access this agent
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent_name: string;
  agent_team: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedInsight {
  id: string;
  category: string;
  title: string;
  content: string;
  source_agent: string;
  source_user: string;
  relevance_teams: string[];
  confidence: string;
  created_at: string;
}
