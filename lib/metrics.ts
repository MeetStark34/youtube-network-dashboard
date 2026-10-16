import type { Channel, UploadItem, Video, VideoTypeFilter } from "./types";
import { isToday } from "./format";
import { latestVideo } from "./network";

export interface OverviewMetrics {
  totalSubscribers: number | null;
  hiddenSubscriberChannels: number;
  latestViewsTotal: number | null;
  latestViewsChannels: number;
  best: { channel: Channel; video: Video; views: number } | null;
  todayUploads: UploadItem[];
}

/** Metrics for the top cards. Subscribers and latest-upload cards use main channels only. */
export function computeOverview(
  mains: readonly Channel[],
  uploads: readonly UploadItem[],
  videoType: VideoTypeFilter = "all"
): OverviewMetrics {
  const withSubs = mains.filter((c) => c.subscribers !== null);
  const totalSubscribers = withSubs.length
    ? withSubs.reduce((s, c) => s + (c.subscribers ?? 0), 0)
    : null;

  const latest = mains
    .map((channel) => ({ channel, video: latestVideo(channel, videoType) }))
    .filter((x): x is { channel: Channel; video: Video } => x.video !== null);
  const counted = latest.filter((x) => x.video.views !== null);

  let best: OverviewMetrics["best"] = null;
  for (const { channel, video } of counted) {
    const views = video.views ?? 0;
    if (!best || views > best.views) best = { channel, video, views };
  }

  return {
    totalSubscribers,
    hiddenSubscriberChannels: mains.length - withSubs.length,
    latestViewsTotal: counted.length
      ? counted.reduce((s, x) => s + (x.video.views ?? 0), 0)
      : null,
    latestViewsChannels: counted.length,
    best,
    todayUploads: uploads.filter((u) => isToday(u.video.publishedAt)),
  };
}
