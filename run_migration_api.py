import json
from urllib.request import Request, urlopen

# Supabase access token
access_token = "sbp_dbacc53eb8721bf6390c8b037c023f6d3def0954"

# Need to get project ID first
# List projects
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
}

try:
    # Get projects
    req = Request("https://api.supabase.com/v1/projects", headers=headers)
    with urlopen(req) as response:
        projects = json.loads(response.read().decode())
        print("Projects:", json.dumps(projects, indent=2))
        
        if projects:
            project_id = projects[0]["id"]
            print(f"Using project: {project_id}")
            
            # Execute SQL via Management API
            sql = """
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
"""
            
            # Execute SQL via API
            sql_url = f"https://api.supabase.com/v1/projects/{project_id}/database/query"
            req = Request(sql_url, data=json.dumps({"query": sql}).encode(), headers=headers, method="POST")
            with urlopen(req) as response:
                result = json.loads(response.read().decode())
                print("Migration result:", result)
                print("Migration executed successfully!")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
