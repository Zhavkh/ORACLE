-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Use the service role key on the server (SUPABASE_SERVICE_ROLE_KEY).

create table if not exists public.agents (
  id text primary key,
  name text not null,
  description text not null default '',
  near_wallet_id text,
  category text not null default 'other'
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null references public.agents (id) on delete cascade,
  score smallint not null check (score >= 1 and score <= 5),
  comment text not null default '',
  reviewer_wallet_id text,
  created_at timestamptz not null default now()
);

alter table if exists public.agents
  add column if not exists near_wallet_id text;
alter table if exists public.agents
  add column if not exists category text not null default 'other';
alter table if exists public.reviews
  add column if not exists reviewer_wallet_id text;

create index if not exists reviews_agent_id_created_at_idx
  on public.reviews (agent_id, created_at);

-- NEW MIGRATION: Additional columns and tables
-- Run this in Supabase SQL Editor after the above

-- Add is_verified column to agents
alter table if exists public.agents
  add column if not exists is_verified boolean not null default false;

-- Create reputation_history table
CREATE TABLE IF NOT EXISTS public.reputation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES public.agents (id) ON DELETE CASCADE,
  old_score INT,
  new_score INT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tx_hash TEXT
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  owner_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS reputation_history_agent_id_idx ON public.reputation_history (agent_id);
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON public.api_keys (key);
CREATE INDEX IF NOT EXISTS agents_is_verified_idx ON public.agents (is_verified);
