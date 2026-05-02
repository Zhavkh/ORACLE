export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://b7systems.vercel.app";

export type AgentCategory = "trading" | "chat" | "analytics" | "other";

export type AgentListItem = {
  id: string;
  name: string;
  near_wallet_id: string | null;
  category: AgentCategory;
  average_score: number | null;
  reputation_score: number | null;
  is_verified: boolean;
  review_count: number;
};

export type Stats = {
  total_agents: number;
  total_reviews: number;
  verified_agents: number;
  average_rating: number;
};

export type ReputationHistoryItem = {
  id: string;
  agent_id: string;
  old_score: number | null;
  new_score: number | null;
  timestamp: string;
  tx_hash: string | null;
};

export type ApiKey = {
  id: string;
  key: string;
  owner_wallet: string;
  created_at: string;
};

export type Review = {
  score: number;
  comment: string;
  reviewer_wallet_id: string | null;
  created_at: string | null;
};

export type AgentProfile = {
  id: string;
  name: string;
  description: string;
  near_wallet_id: string | null;
  category: AgentCategory;
  reviews: Review[];
  average_score: number | null;
  reputation_score: number | null;
  is_verified: boolean;
  review_count: number;
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error(res.ok ? "Empty response" : `Request failed (${res.status})`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 200));
  }
}

export async function fetchAgents(params?: {
  q?: string;
  category?: AgentCategory | "all";
  minReputation?: number;
}): Promise<AgentListItem[]> {
  const search = new URLSearchParams();
  if (params?.q?.trim()) {
    search.set("q", params.q.trim());
  }
  if (params?.category && params.category !== "all") {
    search.set("category", params.category);
  }
  if (typeof params?.minReputation === "number") {
    search.set("min_reputation", String(params.minReputation));
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  const res = await fetch(`${API_BASE}/agents${suffix}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Could not load agents (${res.status})`);
  }
  return parseJson<AgentListItem[]>(res);
}

export async function fetchAgent(id: string): Promise<AgentProfile> {
  const res = await fetch(`${API_BASE}/agents/${id}`, { cache: "no-store" });
  if (res.status === 404) {
    throw new Error("not_found");
  }
  if (!res.ok) {
    throw new Error(`Could not load agent (${res.status})`);
  }
  return parseJson<AgentProfile>(res);
}

export async function registerAgent(body: {
  name: string;
  description: string;
  near_wallet_id: string | null;
  category: AgentCategory;
}): Promise<{
  id: string;
  name: string;
  description: string;
  near_wallet_id: string | null;
  category: AgentCategory;
}> {
  const res = await fetch(`${API_BASE}/agents/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Register failed (${res.status})`);
  }
  return parseJson(res);
}

export async function submitReview(
  agentId: string,
  body: { score: number; comment: string; reviewer_wallet_id: string | null }
): Promise<void> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Review failed (${res.status})`);
  }
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Could not load stats (${res.status})`);
  }
  return parseJson<Stats>(res);
}

export async function checkAgentName(name: string): Promise<{
  available: boolean;
  error: string | null;
  suggestions: string[];
}> {
  const res = await fetch(`${API_BASE}/agents/check?name=${encodeURIComponent(name)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Could not check name (${res.status})`);
  }
  return parseJson(res);
}

export async function verifyAgent(agentId: string, txHash: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tx_hash: txHash }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Verification failed (${res.status})`);
  }
  return parseJson(res);
}

export async function fetchLeaderboard(limit = 10): Promise<AgentListItem[]> {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Could not load leaderboard (${res.status})`);
  }
  return parseJson<AgentListItem[]>(res);
}

export async function fetchReputationHistory(agentId: string): Promise<ReputationHistoryItem[]> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/reputation-history`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Could not load reputation history (${res.status})`);
  }
  return parseJson<ReputationHistoryItem[]>(res);
}

export async function generateApiKey(walletId: string): Promise<ApiKey> {
  const res = await fetch(`${API_BASE}/api-keys/generate?wallet_id=${encodeURIComponent(walletId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to generate API key (${res.status})`);
  }
  return parseJson<ApiKey>(res);
}

export async function fetchMyApiKeys(walletId: string): Promise<{ keys: ApiKey[] }> {
  const res = await fetch(`${API_BASE}/api-keys/my?wallet_id=${encodeURIComponent(walletId)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Could not load API keys (${res.status})`);
  }
  return parseJson(res);
}
