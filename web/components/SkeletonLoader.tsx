"use client";

const shimmerStyle = {
  background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
};

const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div className={`rounded ${className}`} style={shimmerStyle} />
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-3 w-16" />
          </div>
        </div>
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
          <Shimmer className="mx-auto h-8 w-12" />
          <Shimmer className="mx-auto mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonLeaderboard() {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <Shimmer className="h-6 w-6 rounded-full" />
          <Shimmer className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-32" />
            <Shimmer className="h-3 w-20" />
          </div>
          <Shimmer className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
