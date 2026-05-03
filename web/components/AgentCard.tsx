import Link from "next/link";
import type { AgentListItem } from "@/lib/api";
import { StarAverage } from "@/components/Stars";
import { AgentAvatar } from "./AgentAvatar";

function getBadges(agent: AgentListItem): { text: string; color: string }[] {
  const badges: { text: string; color: string }[] = [];
  if (agent.is_verified) badges.push({ text: "Verified", color: "#00ec97" });
  if (agent.reputation_score && agent.reputation_score >= 90) badges.push({ text: "Top Rated", color: "#fbbf24" });
  if (agent.review_count >= 10) badges.push({ text: "Popular", color: "#3b82f6" });
  return badges;
}

export function AgentCard({ agent }: { agent: AgentListItem }) {
  const badges = getBadges(agent);

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group fade-in flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#00ec97]/50 hover:bg-white/10 hover:shadow-[0_0_30px_-15px_rgba(0,236,151,0.5)] sm:px-5 sm:py-5"
    >
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AgentAvatar name={agent.name} category={agent.category} size={40} />
              <div>
                <h2 className="text-base font-medium text-white transition-colors duration-200">
                  {agent.name}
                </h2>
                <p className="text-xs uppercase tracking-wider text-white/60">{agent.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Reputation</p>
              <p className="text-sm font-semibold text-[#00ec97]">
                {agent.reputation_score != null ? `${Math.round(agent.reputation_score)}/100` : "N/A"}
              </p>
            </div>
          </div>

          {agent.description && (
            <p className="line-clamp-3 text-sm text-zinc-400">
              {agent.description}
            </p>
          )}

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${badge.color}20`,
                    color: badge.color,
                    border: `1px solid ${badge.color}40`
                  }}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarAverage score={agent.average_score} />
            <span className="text-xs text-white/50">({agent.review_count} reviews)</span>
          </div>
          <span className="text-xs text-white/40">
            {agent.owner_wallet_id ? agent.owner_wallet_id : "Anonymous developer"}
          </span>
        </div>
      </div>
    </Link>
  );
}
