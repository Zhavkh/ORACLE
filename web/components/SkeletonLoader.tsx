"use client";

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/10" />
          </div>
        </div>
        <div className="h-6 w-6 rounded bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-8 w-24 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className="rounded-xl border border-white/10 bg-black/30 p-4 text-center animate-pulse"
        >
          <div className="mx-auto h-8 w-12 rounded bg-white/10" />
          <div className="mx-auto mt-2 h-3 w-16 rounded bg-white/10" />
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
