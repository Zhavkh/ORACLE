import os
import json
from urllib.request import Request, urlopen

# Get Supabase config from environment
url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()

if not url or not key:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
    exit(1)

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
}

# SQL migration
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

# Execute via Supabase REST API (POST /rest/v1/rpc/exec_sql)
endpoint = f"{url}/rest/v1/rpc/exec_sql"
body = {"sql": sql}

req = Request(endpoint, data=json.dumps(body).encode(), headers=headers, method="POST")

try:
    with urlopen(req) as response:
        result = json.loads(response.read().decode())
        print("Migration executed successfully!")
        print("Result:", result)
except Exception as e:
    print(f"Error executing migration: {e}")
    # Try alternative method via direct SQL endpoint
    print("Trying alternative method...")
    endpoint = f"{url}/rest/v1/_sql"
    req = Request(endpoint, data=json.dumps({"query": sql}).encode(), headers=headers, method="POST")
    try:
        with urlopen(req) as response:
            result = json.loads(response.read().decode())
            print("Migration executed successfully!")
            print("Result:", result)
    except Exception as e2:
        print(f"Alternative method also failed: {e2}")
        print("\nPlease run the SQL manually in Supabase Dashboard → SQL Editor")
