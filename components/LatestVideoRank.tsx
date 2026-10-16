import type { VideoTypeFilter } from "@/lib/types";
import { cn } from "@/lib/cn";

function rankTone(rank: number) {
  if (rank === 1) return "border-amber-300/25 bg-amber-200/10 text-amber-100";
  if (rank === 2) return "border-slate-200/20 bg-slate-200/[0.07] text-slate-100";
  if (rank === 3) return "border-orange-300/20 bg-orange-200/[0.08] text-orange-100";
  return "border-line bg-surface-2 text-muted";
}

export function LatestVideoRank({
  rank,
  total,
  filter,
}: {
  rank: number | null;
  total: number;
  filter: VideoTypeFilter;
}) {
  if (total === 0) {
    const emptyLabel = filter === "shorts" ? "No Shorts" : filter === "videos" ? "No videos" : "No uploads";
    return (
      <span
        role="status"
        className="inline-flex min-h-6 items-center rounded-full border border-dashed border-line px-2 text-[10px] font-medium text-muted"
      >
        {emptyLabel}
      </span>
    );
  }

  const contentLabel = filter === "shorts" ? "Short" : filter === "videos" ? "video" : "upload";
  const label = rank === null
    ? `Latest ${contentLabel} rank unavailable among ${total} matching uploads`
    : `Latest ${contentLabel} ranked ${rank} of ${total} by views among this channel's latest matching uploads`;

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border px-2 text-[10px] font-semibold tabular-nums",
        rank === null ? "border-line bg-surface-2 text-muted" : rankTone(rank)
      )}
    >
      #{rank ?? "—"} / {total}
    </span>
  );
}
