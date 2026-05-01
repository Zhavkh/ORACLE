"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "@/components/AgentCard";
import { SkeletonGrid, SkeletonStats } from "@/components/SkeletonLoader";
import { fetchAgents, fetchStats, type AgentCategory, type AgentListItem, type Stats } from "@/lib/api";

export default function HomePage() {
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<AgentCategory | "all">("all");
  const [minReputation, setMinReputation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [agentsData, statsData] = await Promise.all([
          fetchAgents({ q, category, minReputation }),
          fetchStats()
        ]);
        if (active) {
          setAgents(agentsData);
          setStats(statsData);
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [q, category, minReputation]);

  return (
    <div className="space-y-10">
      <section className="fade-in rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#00ec97]">B7systems</span>
          <span className="text-xs text-zinc-500">✦</span>
          <p className="text-xs uppercase tracking-[0.3em] text-[#00ec97]">NEAR + AI</p>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          The Reputation Layer for AI Agents
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Discover trusted agents, review performance, and sign every contribution with a NEAR wallet.
        </p>
        
        {loading ? (
          <div className="mt-6">
            <SkeletonStats />
          </div>
        ) : stats ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total_agents}</div>
              <div className="text-xs text-zinc-400">Agents</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-2xl font-bold text-[#00ec97]">{stats.total_reviews}</div>
              <div className="text-xs text-zinc-400">Reviews</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.verified_agents}</div>
              <div className="text-xs text-zinc-400">Verified</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.average_rating.toFixed(1)}</div>
              <div className="text-xs text-zinc-400">Avg Rating</div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="fade-in grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#00ec97]/60"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as AgentCategory | "all")}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#00ec97]/60"
        >
          <option value="all">All categories</option>
          <option value="trading">Trading</option>
          <option value="chat">Chat</option>
          <option value="analytics">Analytics</option>
          <option value="other">Other</option>
        </select>
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
          <label className="mb-1 block text-xs text-zinc-400">Min reputation: {minReputation}</label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minReputation}
            onChange={(e) => setMinReputation(Number(e.target.value))}
            className="w-full accent-[#00ec97]"
          />
        </div>
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <SkeletonGrid /> : null}
      {!loading && agents.length === 0 ? <p className="text-sm text-zinc-400">No agents found.</p> : null}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <li key={agent.id}>
            <AgentCard agent={agent} />
          </li>
        ))}
      </ul>
    </div>
  );
}
