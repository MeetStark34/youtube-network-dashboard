import type { Video } from "@/lib/types";
import { formatDate, formatDuration, formatRelative, youtubeVideoUrl } from "@/lib/format";
import { Icon } from "./Icon";
import { SafeImage } from "./SafeImage";
import { VideoStats } from "./VideoStats";
import { cn } from "@/lib/cn";
import { getVideoType } from "@/lib/shorts";

export interface RankChip {
  label: string;
  rank: number | null;
  total: number;
}

interface Props {
  video: Video;
  /** "embedded" sits inside another card. "feature" is a standalone bordered card. */
  variant?: "embedded" | "feature";
  ranks?: RankChip[];
  rankedContentLabel?: string;
}

export function VideoThumbnail({ video, className }: { video: Video; className?: string }) {
  const duration = formatDuration(video.duration);
  return (
    <a
      href={youtubeVideoUrl(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch “${video.title}” on YouTube (opens in a new tab)`}
      className={cn(
        "group/thumb relative z-10 block aspect-video overflow-hidden rounded-lg bg-surface-3",
        className
      )}
    >
      <SafeImage
        src={video.thumbnail}
        alt={`Thumbnail for ${video.title}`}
        className="size-full transition-transform duration-200 group-hover/thumb:scale-[1.03]"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover/thumb:bg-black/30 group-focus-visible/thumb:bg-black/30">
        <span className="flex size-12 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-200 group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100">
          <Icon name="play" className="size-5 translate-x-px fill-current" />
        </span>
      </span>
      {duration && (
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
          {duration}
        </span>
      )}
      {getVideoType(video) === "short" && <span className="absolute left-2 top-2 rounded border border-white/20 bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Short</span>}
    </a>
  );
}

export function LatestVideoCard({ video, variant = "embedded", ranks, rankedContentLabel = "matching uploads" }: Props) {
  const published = (
    <span title={formatDate(video.publishedAt)}>
      Published {formatRelative(video.publishedAt)}
    </span>
  );

  const rankChips = ranks && ranks.length > 0 && (
    <ul aria-label={`Rank among this channel's latest ${rankedContentLabel}`} className="flex flex-wrap gap-2">
      {ranks.map((r) => (
        <li
          key={r.label}
          className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
        >
          {r.label}{" "}
          <span className="font-semibold tabular-nums text-ink">
            {r.rank === null ? "—" : r.rank} / {r.total}
          </span>
        </li>
      ))}
    </ul>
  );

  if (variant === "feature") {
    return (
      <article className="glass-panel grid gap-5 rounded-panel p-4 sm:p-5 lg:grid-cols-5">
        <VideoThumbnail video={video} className="lg:col-span-3" />
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div>
            <h3 className="text-xl font-semibold leading-snug">
              <a
                href={youtubeVideoUrl(video.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {video.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </h3>
            <p className="mt-2 text-sm text-muted">{published}</p>
          </div>
          <VideoStats video={video} layout="grid" showEngagement />
          {rankChips}
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-3">
      <VideoThumbnail video={video} />
      <div>
        <h4 className="line-clamp-2 font-medium leading-snug">
          <a
            href={youtubeVideoUrl(video.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 hover:underline"
          >
            {video.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h4>
        <p className="mt-1 text-sm text-faint">{published}</p>
      </div>
      <VideoStats video={video} />
    </article>
  );
}
