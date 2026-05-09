-- RAIOS v4 Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- ─── Team Members ────────────────────────────────────────────────────────────

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('founder', 'sales', 'media', 'finance', 'operations')),
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Seed the team
insert into team_members (name, email, role, is_admin) values
  ('Lokesh', 'lokesh@recube360.org', 'founder', true),
  ('Purav', 'purav@recube360.org', 'founder', true);

-- ─── Conversations ───────────────────────────────────────────────────────────

create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references team_members(id),
  agent_name text not null,
  agent_team text not null,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Messages ────────────────────────────────────────────────────────────────

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ─── Shared Insights (THE SHARED MEMORY) ─────────────────────────────────────
-- This is the cross-pollination layer. Every agent reads from here.
-- When Purav's agent learns something, it writes here.
-- When Lokesh's agent starts a conversation, it reads relevant insights.

create table shared_insights (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'deal_intelligence',    -- New prospect info, SPOC details, deal updates
    'pricing_update',       -- New pricing data, competitor rates, vendor quotes
    'market_signal',        -- Industry news, regulatory changes, market shifts
    'operational_learning', -- What worked/failed in delivery, vendor performance
    'client_feedback',      -- Direct client feedback, satisfaction signals
    'content_pattern',      -- What content performed well, audience insights
    'team_decision'         -- Strategic decisions made, direction changes
  )),
  title text not null,
  content text not null,
  source_agent text not null,       -- Which agent created this insight
  source_user text not null,        -- Which team member's session
  relevance_teams text[] not null,  -- Which teams should see this: ['sales', 'ops']
  confidence text check (confidence in ('HIGH', 'MODERATE', 'LOW')),
  expires_at timestamptz,           -- Some insights have a shelf life
  created_at timestamptz default now()
);

-- Index for fast retrieval by team
create index idx_insights_teams on shared_insights using gin(relevance_teams);
create index idx_insights_category on shared_insights(category);
create index idx_insights_created on shared_insights(created_at desc);

-- ─── Pipeline Tracker (Shared Sales State) ───────────────────────────────────

create table pipeline (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  spoc_name text,
  spoc_email text,
  spoc_phone text,
  stage text not null check (stage in (
    'research', 'outreach_sent', 'response_received', 'meeting_scheduled',
    'proposal_sent', 'negotiation', 'won', 'lost', 'on_hold'
  )),
  service_lines text[],
  estimated_revenue numeric,
  currency text default 'INR',
  close_probability integer check (close_probability between 0 and 100),
  market text check (market in ('india', 'south_africa', 'other')),
  notes text,
  owner text,                       -- Team member responsible
  last_activity timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Activity Log (Audit Trail) ──────────────────────────────────────────────

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references team_members(id),
  agent_name text not null,
  action_type text not null,        -- 'chat', 'insight_created', 'pipeline_updated', 'email_drafted'
  summary text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_activity_created on activity_log(created_at desc);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Everyone on the team can read everything (transparency)
-- Only the creator can delete their own insights

alter table team_members enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table shared_insights enable row level security;
alter table pipeline enable row level security;
alter table activity_log enable row level security;

-- For MVP: service role key bypasses RLS.
-- Production: add proper policies per user.
