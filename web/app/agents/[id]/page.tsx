"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { fetchAgent, fetchReputationHistory, verifyAgent, type AgentProfile, type ReputationHistoryItem } from "@/lib/api";
import { Stars } from "@/components/Stars";
import { useNearWallet } from "@/components/NearWalletProvider";

function getBadges(agent: AgentProfile): string[] {
  const badges: string[] = [];
  if (agent.is_verified) badges.push("✅ Verified");
  if (agent.reputation_score && agent.reputation_score >= 90) badges.push("🥇 Top Rated");
  if (agent.review_count >= 10) badges.push("💬 Well Reviewed");
  return badges;
}

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { walletId } = useNearWallet();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [history, setHistory] = useState<ReputationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [agentData, historyData] = await Promise.all([
          fetchAgent(id),
          fetchReputationHistory(id)
        ]);
        setAgent(agentData);
        setHistory(historyData);
      } catch (e) {
        if (e instanceof Error && e.message === "not_found") {
          notFound();
        }
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleVerify() {
    if (!walletId || !agent) return;
    setVerifying(true);
    setError(null);
    try {
      // In real implementation, you'd call NEAR wallet to transfer 0.1 NEAR
      // and get the tx_hash. For now, we use a mock tx_hash
      const mockTxHash = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await verifyAgent(agent.id, mockTxHash);
      // Refresh agent data
      const updated = await fetchAgent(id);
      setAgent(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  if (loading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!agent) return null;

  const displayScore =
    agent.average_score != null
      ? Math.min(5, Math.max(1, Math.round(agent.average_score)))
      : 0;

  const badges = getBadges(agent);
  const isOwner = walletId && agent.owner_wallet_id === walletId;

  return (
    <div className="space-y-10">
      <div className="fade-in space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <Link
          href="/"
          className="inline-block text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-300"
        >
          ← Agents
        </Link>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium tracking-tight text-zinc-50 sm:text-3xl">
              {agent.name}
            </h1>
          </div>
          
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span key={i} className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">
                  {badge}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
            <span className="rounded-full border border-[#00ec97]/40 px-2 py-1 text-[#00ec97]">
              {agent.category}
            </span>
            {agent.owner_wallet_id ? (
              <span className="rounded-full border border-[#00ec97]/40 px-2 py-1 text-[#00ec97]">
                owner: {agent.owner_wallet_id}
              </span>
            ) : (
              <span className="rounded-full border border-white/20 px-2 py-1 text-zinc-500">
                owner: anonymous
              </span>
            )}
          </div>
          {agent.description ? (
            <p className="text-sm leading-relaxed text-zinc-400">{agent.description}</p>
          ) : (
            <p className="text-sm italic text-zinc-600">No description</p>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {agent.average_score != null ? (
              <>
                <Stars value={displayScore} />
                <span className="tabular-nums text-sm text-zinc-500">
                  {agent.average_score.toFixed(1)} average · {agent.review_count}{" "}
                  {agent.review_count === 1 ? "review" : "reviews"}
                </span>
                <span className="text-sm font-semibold text-[#00ec97]">
                  Reputation: {agent.reputation_score ?? 0}/100
                </span>
              </>
            ) : (
              <span className="text-sm text-zinc-500">No reviews yet</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/agents/${agent.id}/review`}
            className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800/60 hover:text-white"
          >
            Leave a review
          </Link>
          
          {isOwner && !agent.is_verified && (
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="inline-flex rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-2.5 text-sm font-medium text-green-400 transition-all duration-200 hover:bg-green-500/30 disabled:opacity-50"
            >
              {verifying ? "Processing..." : "Get Verified (0.1 NEAR)"}
            </button>
          )}
        </div>
        
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {history.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Reputation History
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              {history.slice(0, 10).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    {h.timestamp ? new Date(h.timestamp).toLocaleDateString() : "Unknown"}
                  </span>
                  <span className="text-zinc-300">
                    {h.old_score !== null ? `${h.old_score} → ${h.new_score}` : "Verified"}
                  </span>
                  {h.tx_hash && (
                    <span className="text-xs text-zinc-600">{h.tx_hash.slice(0, 20)}...</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Reviews
        </h2>
        {agent.reviews.length === 0 ? (
          <p className="text-sm text-zinc-500">No reviews yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {agent.reviews.map((r, i) => (
              <li
                key={`${r.score}-${i}-${r.comment?.slice(0, 12)}`}
                className="fade-in rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl transition-colors duration-200 hover:border-[#00ec97]/40 sm:px-5"
              >
                <div className="mb-2">
                  <Stars value={r.score} size="sm" />
                </div>
                {r.comment ? (
                  <p className="text-sm leading-relaxed text-zinc-300">{r.comment}</p>
                ) : (
                  <p className="text-sm text-zinc-600">No comment</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  {r.reviewer_wallet_id ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00ec97]/10 px-2.5 py-1 font-medium text-[#00ec97]">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {r.reviewer_wallet_id}
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-500">Anonymous</span>
                  )}
                  <span className="text-zinc-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "Unknown date"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
