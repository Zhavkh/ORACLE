"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/api";
import { Stars } from "@/components/Stars";
import { useNearWallet } from "@/components/NearWalletProvider";

export function ReviewForm({ agentId }: { agentId: string }) {
  const router = useRouter();
  const { walletId, connectWallet } = useNearWallet();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await submitReview(agentId, {
        score,
        comment: comment.trim(),
        reviewer_wallet_id: walletId,
      });
      router.push(`/agents/${agentId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
        <span className="text-xs uppercase tracking-wider text-zinc-400">Signed by</span>
        {walletId ? (
          <span className="text-xs text-[#00ec97]">{walletId}</span>
        ) : (
          <button type="button" onClick={connectWallet} className="text-xs text-[#00ec97]">
            Connect NEAR Wallet
          </button>
        )}
      </div>
      <div className="space-y-3">
        <span className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Score
        </span>
        <Stars value={score} interactive onChange={setScore} />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/80"
          placeholder="Optional feedback"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg border border-[#00ec97]/70 bg-[#00ec97] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
