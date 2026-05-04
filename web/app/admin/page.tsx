"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";

const ADMIN_PASSWORD = "10399s_134f#$%%4**11zls0091ksdz1)55";

interface PendingAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  owner_wallet_id: string;
  owner_email?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check sessionStorage on mount
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchPendingAgents();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setError("");
      fetchPendingAgents();
    } else {
      setError("Access denied");
      setPassword("");
    }
  };

  const fetchPendingAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/agents?status=eq.pending`, {
        headers: {
          "X-Admin-Password": ADMIN_PASSWORD,
        },
      });
      if (res.ok) {
        const agents = await res.json();
        setPendingAgents(agents);
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const handleApprove = async (agentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/agents/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (res.ok) {
        // Remove from list
        setPendingAgents(prev => prev.filter(a => a.id !== agentId));
        setError("");
      } else {
        setError("Failed to approve agent");
      }
    } catch (err) {
      setError("Failed to approve agent");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (agentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/agents/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (res.ok) {
        // Remove from list
        setPendingAgents(prev => prev.filter(a => a.id !== agentId));
        setError("");
      } else {
        setError("Failed to reject agent");
      }
    } catch (err) {
      setError("Failed to reject agent");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h1 className="text-2xl font-semibold text-zinc-50 mb-6">Admin Access</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 focus:border-zinc-500 focus:bg-zinc-900/80"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg border border-[#00ec97]/70 bg-[#00ec97] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-50 mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage pending agent submissions</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-zinc-50">
              Pending Agents ({pendingAgents.length})
            </h2>
          </div>

          {pendingAgents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-400">No pending agents to review</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {pendingAgents.map((agent) => (
                <div key={agent.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-zinc-50 mb-2">{agent.name}</h3>
                      <p className="text-zinc-400 mb-3 line-clamp-2">{agent.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-zinc-500">Category:</span>
                          <span className="ml-2 text-zinc-300">{agent.category}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Owner:</span>
                          <span className="ml-2 text-[#00ec97]">{agent.owner_wallet_id}</span>
                        </div>
                        {agent.owner_email && (
                          <div>
                            <span className="text-zinc-500">Email:</span>
                            <span className="ml-2 text-zinc-300">{agent.owner_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(agent.id)}
                      disabled={loading}
                      className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition-all duration-200 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(agent.id)}
                      disabled={loading}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
