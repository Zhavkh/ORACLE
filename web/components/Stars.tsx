"use client";

type StarsProps = {
  value: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (score: number) => void;
};

const starPath =
  "M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-.99L12 2z";

export function Stars({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarsProps) {
  const starClass =
    size === "sm"
      ? "h-3.5 w-3.5 sm:h-4 sm:w-4"
      : "h-5 w-5 sm:h-6 sm:w-6";

  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Rating" : `Rating ${value} of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = value >= n;
        const color = filled ? "text-[#00ec97]" : "text-zinc-600";
        if (interactive) {
          return (
            <button
              key={n}
              type="button"
              aria-checked={value === n}
              role="radio"
              onClick={() => onChange?.(n)}
              className={[
                starClass,
                color,
                "rounded-sm transition-transform duration-200 ease-out",
                "cursor-pointer hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-zinc-500",
              ].join(" ")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="block h-full w-full">
                <path d={starPath} />
              </svg>
            </button>
          );
        }
        return (
          <span
            key={n}
            className={[
              starClass,
              color,
              "inline-block transition-opacity duration-200",
            ].join(" ")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="block h-full w-full">
              <path d={starPath} />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

export function StarAverage({ score }: { score: number | null }) {
  if (score == null) {
    return (
      <span className="text-sm text-zinc-500 transition-colors duration-200">
        No ratings
      </span>
    );
  }
  const stars = Math.min(5, Math.max(1, Math.round(score)));
  return (
    <div className="flex items-center gap-2">
      <Stars value={stars} size="sm" />
      <span className="tabular-nums text-sm text-zinc-300">{score.toFixed(1)}</span>
    </div>
  );
}
