"use client";

import { useMemo, useState } from "react";
import type { Video, VideoTypeFilter } from "@/lib/types";
import {
  engagementRate,
  formatCompact,
  formatDate,
  formatDuration,
  formatFull,
  formatPercent,
  formatRelative,
  youtubeVideoUrl,
} from "@/lib/format";
import { VIDEO_METRICS, rankVideos, type VideoMetric } from "@/lib/ranking";
import { RankingBadge } from "./RankingBadge";
import { SafeImage } from "./SafeImage";
import { cn } from "@/lib/cn";

export function VideoTable({ videos, videoType }: { videos: Video[]; videoType: VideoTypeFilter }) {
  const [metric, setMetric] = useState<VideoMetric>("views");
  const ranked = useMemo(() => rankVideos(videos, metric), [videos, metric]);

  const latestId = videos[0]?.id;
  const latestRank = ranked.find((r) => r.video.id === latestId)?.rank ?? null;
  const metricLabel = VIDEO_METRICS.find((m) => m.id === metric)?.label.toLowerCase() ?? metric;
  const latestLabel = videoType === "shorts" ? "Latest Short" : videoType === "videos" ? "Latest video" : "Latest upload";
  const pluralLabel = videoType === "shorts" ? "Shorts" : videoType === "videos" ? "videos" : "uploads";

  const th = (m: VideoMetric) =>
    cn("px-3 py-3 text-right font-medium", metric === m ? "text-ink" : "text-muted");
  const td = (m: VideoMetric) =>
    cn("px-3 py-3 text-right tabular-nums", metric === m ? "font-semibold text-ink" : "text-muted");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={`Rank the latest matching ${pluralLabel} by`} className="inline-flex rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-glass">
          {VIDEO_METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={metric === m.id}
              onClick={() => setMetric(m.id)}
              className={cn(
                "min-h-10 rounded-lg px-3 py-1.5 text-sm transition-colors duration-200",
                metric === m.id ? "bg-surface-3 font-medium text-ink" : "text-muted hover:text-ink"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {latestLabel} ranks{" "}
          <span className="font-semibold tabular-nums text-ink">
            {latestRank === null ? "—" : latestRank} / {ranked.length}
          </span>{" "}
          by {metricLabel}
        </p>
      </div>

      <div role="region" aria-label="Ranked video results" tabIndex={0} className="glass-panel overflow-x-auto rounded-panel">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th scope="col" className="w-20 px-5 py-3 font-medium">Rank</th>
              <th scope="col" className="px-3 py-3 font-medium">Video</th>
              <th scope="col" className={th("views")} aria-sort={metric === "views" ? "descending" : undefined}>Views</th>
              <th scope="col" className={th("likes")} aria-sort={metric === "likes" ? "descending" : undefined}>Likes</th>
              <th scope="col" className={th("comments")} aria-sort={metric === "comments" ? "descending" : undefined}>Comments</th>
              <th scope="col" className={th("engagement")} aria-sort={metric === "engagement" ? "descending" : undefined}>Engagement</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Published</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ video, rank }) => (
              <tr
                key={video.id}
                className="border-t border-line transition-colors hover:bg-surface-2"
              >
                <td className="px-5 py-3">
                  <RankingBadge rank={rank} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <SafeImage
                      src={video.thumbnail}
                      alt={`Thumbnail for ${video.title}`}
                      className="aspect-video w-28 shrink-0 rounded-md"
                    />
                    <div className="min-w-0 max-w-sm">
                      <a
                        href={youtubeVideoUrl(video.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-2 font-medium leading-snug hover:underline"
                      >
                        {video.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      {video.id === latestId && (
                        <span className="mt-1 inline-block rounded border border-line px-1.5 py-0.5 text-xs text-muted">
                          {latestLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className={td("views")} title={formatFull(video.views)}>{formatCompact(video.views)}</td>
                <td className={td("likes")} title={formatFull(video.likes)}>{formatCompact(video.likes)}</td>
                <td className={td("comments")} title={formatFull(video.comments)}>{formatCompact(video.comments)}</td>
                <td className={td("engagement")} title="Likes plus comments, divided by views">
                  {formatPercent(engagementRate(video))}
                </td>
                <td className="px-3 py-3 text-right text-muted" title={formatDate(video.publishedAt)}>
                  {formatRelative(video.publishedAt)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-muted">
                  {formatDuration(video.duration) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
