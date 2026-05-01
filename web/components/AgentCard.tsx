import Link from "next/link";
import type { AgentListItem } from "@/lib/api";
import { StarAverage } from "@/components/Stars";

function getBadges(agent: AgentListItem): string[] {
  const badges: string[] = [];
  if (agent.is_verified) badges.push("✅ Verified");
  if (agent.reputation_score && agent.reputation_score >= 90) badges.push("🥇 Top Rated");
  if (agent.review_count >= 10) badges.push("💬 Well Reviewed");
  return badges;
}

export function AgentCard({ agent }: { agent: AgentListItem }) {
  const initials = agent.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  const hue = (agent.name.length * 37) % 360;
  const badges = getBadges(agent);

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group fade-in block rounded-2xl border border-white/15 bg-white/5 px-4 py-4 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#00ec97]/50 hover:bg-white/10 hover:shadow-[0_0_40px_-20px_rgba(0,236,151,0.65)] sm:px-5 sm:py-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: `hsl(${hue} 70% 42%)` }}
            >
              {initials || "AI"}
            </div>
            <div>
              <h2 className="text-base font-medium text-zinc-100 transition-colors duration-200 group-hover:text-white">
                {agent.name}
              </h2>
              <p className="text-xs uppercase tracking-wider text-zinc-400">{agent.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Reputation</p>
            <p className="text-sm font-semibold text-[#00ec97]">
              {agent.reputation_score != null ? `${agent.reputation_score}/100` : "N/A"}
            </p>
          </div>
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarAverage score={agent.average_score} />
            <span className="text-xs text-zinc-500">({agent.review_count} reviews)</span>
          </div>
          <span className="text-xs text-zinc-400">
            {agent.near_wallet_id ? `Owner: ${agent.near_wallet_id.slice(0, 12)}...` : "No owner wallet"}
          </span>
        </div>
      </div>
    </Link>
  );
}
