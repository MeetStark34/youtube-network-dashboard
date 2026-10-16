import { cn } from "@/lib/cn";

export function RankingBadge({ rank, className }: { rank: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`Rank ${rank}`}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
        rank === 1
          ? "border border-accent/25 bg-accent/15 text-accent"
          : rank <= 3
            ? "border border-line-strong bg-surface-2 text-ink"
            : "border border-line text-muted",
        className
      )}
    >
      {rank}
    </span>
  );
}
