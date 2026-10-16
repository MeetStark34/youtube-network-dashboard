import Link from "next/link";
import type { ReactNode } from "react";
import type { UploadItem } from "@/lib/types";
import { formatDateTime, formatTime, youtubeVideoUrl } from "@/lib/format";
import { EmptyState } from "./EmptyState";
import { VideoThumbnail } from "./LatestVideoCard";
import { VideoStats } from "./VideoStats";

export function UploadList({
  items,
  showDate = false,
  empty,
}: {
  items: UploadItem[];
  /** Show the date as well as the time. Use when the list spans more than today. */
  showDate?: boolean;
  empty?: ReactNode;
}) {
  if (items.length === 0) {
    return (
      <>
        {empty ?? (
          <EmptyState
            icon="uploads"
            title="No uploads today"
            description="New videos from the tracked channels appear here as soon as they are published."
          />
        )}
      </>
    );
  }

  return (
    <ul className="glass-panel divide-y divide-line rounded-panel">
      {items.map(({ channel, video }) => (
        <li
          key={`${channel.channelId}-${video.id}`}
          className="grid grid-cols-[8rem_1fr] gap-4 p-4 transition-colors hover:bg-surface-2 sm:grid-cols-[11rem_1fr] sm:gap-5"
        >
          <VideoThumbnail video={video} />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-x-4 text-sm">
              <Link
                href={`/channel/${channel.channelId}`}
                className="truncate font-medium text-muted hover:text-ink hover:underline"
              >
                {channel.name}
              </Link>
              <time dateTime={video.publishedAt} className="tabular-nums text-faint">
                {showDate ? formatDateTime(video.publishedAt) : formatTime(video.publishedAt)}
              </time>
            </div>
            <h3 className="line-clamp-2 font-medium leading-snug">
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
            <div className="mt-auto">
              <VideoStats video={video} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
