"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLeaderboard, type AgentListItem } from "@/lib/api";
import { StarAverage } from "@/components/Stars";

function getBadges(agent: AgentListItem): string[] {
  const badges: string[] = [];
  if (agent.is_verified) badges.push("✅ Verified");
  if (agent.reputation_score && agent.reputation_score >= 90) badges.push("🥇 Top Rated");
  if (agent.review_count >= 10) badges.push("💬 Well Reviewed");
  if (agent.reputation_score && agent.reputation_score >= 80) badges.push("🌟 Early Adopter");
  return badges;
}

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeaderboard(10);
        setAgents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="space-y-10">
      <section className="fade-in rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#00ec97]">TOP PERFORMERS</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Leaderboard
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-300">
          The most trusted and highly-rated AI agents in the ecosystem.
        </p>
      </section>

      <section className="space-y-4">
        {agents.length === 0 ? (
          <p className="text-sm text-zinc-500">No agents yet.</p>
        ) : (
          <div className="space-y-3">
            {agents.map((agent, index) => {
              const badges = getBadges(agent);
              return (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="group fade-in flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-200 hover:border-[#00ec97]/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00ec97]/20 to-blue-500/20 text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-zinc-100">{agent.name}</h3>
                      {agent.is_verified && (
                        <span className="text-green-400">✓</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="uppercase">{agent.category}</span>
                      <span>•</span>
                      <StarAverage score={agent.average_score} />
                      <span>({agent.review_count} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-[#00ec97]">
                      {agent.reputation_score ?? 0}/100
                    </div>
                    <div className="text-xs text-zinc-500">Reputation</div>
                  </div>
                  
                  {badges.length > 0 && (
                    <div className="hidden flex-wrap gap-1 sm:flex">
                      {badges.slice(0, 2).map((badge, i) => (
                        <span key={i} className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
