import type { Channel, Video, VideoTypeFilter } from "./types";
import {
  engagementRate,
  formatCompact,
  formatFull,
  formatPercent,
} from "./format";
import { latestVideo } from "./network";

/* -------------------------------------------------------------------------- */
/*  Network Score configuration: edit the weights here, nothing else.         */
/*  Each component is scored 0–100 relative to the best of the four main      */
/*  channels (value ÷ best value × 100). The weighted average is the score.   */
/*  Weights do not need to add up to 1. Set one to 0 to switch it off.        */
/* -------------------------------------------------------------------------- */

export const SCORE_COMPONENTS = [
  "subscribers",
  "latestViews",
  "latestLikes",
  "latestComments",
  "engagement",
] as const;

export type ScoreComponent = (typeof SCORE_COMPONENTS)[number];

export const NETWORK_SCORE_WEIGHTS: Record<ScoreComponent, number> = {
  subscribers: 0.3,
  latestViews: 0.3,
  latestLikes: 0.15,
  latestComments: 0,
  engagement: 0.25,
};

export const SCORE_COMPONENT_LABELS: Record<ScoreComponent, string> = {
  subscribers: "Subscribers",
  latestViews: "Latest upload views",
  latestLikes: "Latest upload likes",
  latestComments: "Latest upload comments",
  engagement: "Engagement rate",
};

/* -------------------------------------------------------------------------- */

export type RankingCategory =
  | "overall"
  | "subscribers"
  | "views"
  | "likes"
  | "comments"
  | "engagement";

export const RANKING_CATEGORIES: ReadonlyArray<{
  id: RankingCategory;
  label: string;
  description: string;
}> = [
  {
    id: "overall",
    label: "Overall",
    description:
      "Network Score: a weighted blend of subscribers, views and likes on the latest upload matching the selected type, plus engagement, scaled against the best main channel.",
  },
  { id: "subscribers", label: "Subscribers", description: "Current subscriber count." },
  { id: "views", label: "Views", description: "Views on each channel's most recent upload matching the selected content type." },
  { id: "likes", label: "Likes", description: "Likes on each channel's most recent upload matching the selected content type." },
  { id: "comments", label: "Comments", description: "Comments on each channel's most recent upload matching the selected content type." },
  {
    id: "engagement",
    label: "Engagement rate",
      description: "(Likes + comments) ÷ views on the most recent upload matching the selected content type.",
  },
];

export function rankItems<T>(
  items: readonly T[],
  getValue: (item: T) => number | null
): Array<{ item: T; value: number | null; rank: number }> {
  const sorted = items
    .map((item) => ({ item, value: getValue(item) }))
    .sort((a, b) => {
      if (a.value === b.value) return 0;
      if (a.value === null) return 1;
      if (b.value === null) return -1;
      return b.value - a.value;
    });

  let prevValue: number | null = null;
  let prevRank = 0;
  return sorted.map((entry, i) => {
    const rank = i > 0 && entry.value !== null && entry.value === prevValue ? prevRank : i + 1;
    prevValue = entry.value;
    prevRank = rank;
    return { ...entry, rank };
  });
}

/* ------------------------------ channel ranking --------------------------- */

export interface RankingRow {
  rank: number;
  channel: Channel;
  value: number | null;
  display: string;
  fullDisplay: string;
  /** 0–1, relative to the leader. */
  share: number;
  note?: string;
}

function categoryValue(channel: Channel, category: Exclude<RankingCategory, "overall">, videoType: VideoTypeFilter): number | null {
  if (category === "subscribers") return channel.subscribers;
  const v = latestVideo(channel, videoType);
  if (!v) return null;
  switch (category) {
    case "views":
      return v.views;
    case "likes":
      return v.likes;
    case "comments":
      return v.comments;
    case "engagement":
      return engagementRate(v);
  }
}

export interface NetworkScoreRow {
  rank: number;
  channel: Channel;
  components: Record<ScoreComponent, number>;
  total: number;
}

function componentValue(channel: Channel, component: ScoreComponent, videoType: VideoTypeFilter): number | null {
  switch (component) {
    case "subscribers":
      return channel.subscribers;
    case "latestViews":
      return latestVideo(channel, videoType)?.views ?? null;
    case "latestLikes":
      return latestVideo(channel, videoType)?.likes ?? null;
    case "latestComments":
      return latestVideo(channel, videoType)?.comments ?? null;
    case "engagement": {
      const v = latestVideo(channel, videoType);
      return v ? engagementRate(v) : null;
    }
  }
}

export function buildNetworkScores(mains: readonly Channel[], videoType: VideoTypeFilter = "all"): NetworkScoreRow[] {
  const raw = mains.map((channel) => ({
    channel,
    values: Object.fromEntries(
      SCORE_COMPONENTS.map((k) => [k, componentValue(channel, k, videoType)])
    ) as Record<ScoreComponent, number | null>,
  }));

  const maxima = Object.fromEntries(
    SCORE_COMPONENTS.map((k) => [k, Math.max(0, ...raw.map((r) => r.values[k] ?? 0))])
  ) as Record<ScoreComponent, number>;

  const weightSum = SCORE_COMPONENTS.reduce((s, k) => s + NETWORK_SCORE_WEIGHTS[k], 0);

  const scored = raw.map(({ channel, values }) => {
    const components = {} as Record<ScoreComponent, number>;
    for (const k of SCORE_COMPONENTS) {
      const v = values[k];
      components[k] = v !== null && maxima[k] > 0 ? (v / maxima[k]) * 100 : 0;
    }
    const total =
      weightSum > 0
        ? SCORE_COMPONENTS.reduce((s, k) => s + components[k] * NETWORK_SCORE_WEIGHTS[k], 0) / weightSum
        : 0;
    return { channel, components, total };
  });

  return rankItems(scored, (s) => s.total).map(({ item, rank }) => ({ ...item, rank }));
}

function formatCategoryValue(value: number | null, category: Exclude<RankingCategory, "overall">) {
  if (value === null) return category === "subscribers" ? "Hidden" : "—";
  return category === "engagement" ? formatPercent(value) : formatCompact(value);
}

export function buildRanking(mains: readonly Channel[], category: RankingCategory, videoType: VideoTypeFilter = "all"): RankingRow[] {
  if (category === "overall") {
    const scores = buildNetworkScores(mains, videoType);
    const top = Math.max(0, ...scores.map((s) => s.total));
    return scores.map((s) => ({
      rank: s.rank,
      channel: s.channel,
      value: s.total,
      display: s.total.toFixed(1),
      fullDisplay: `${s.total.toFixed(1)} out of 100`,
      share: top > 0 ? s.total / top : 0,
    }));
  }

  const ranked = rankItems(mains, (c) => categoryValue(c, category, videoType));
  const top = Math.max(0, ...ranked.map((r) => r.value ?? 0));
  return ranked.map(({ item, rank, value }) => ({
    rank,
    channel: item,
    value,
    display: formatCategoryValue(value, category),
    fullDisplay: category === "engagement" ? formatPercent(value) : formatFull(value),
    share: value !== null && top > 0 ? value / top : 0,
    note: category === "subscribers" ? undefined : latestVideo(item, videoType)?.title,
  }));
}

/* ------------------------------- video ranking ---------------------------- */

export type VideoMetric = "views" | "likes" | "comments" | "engagement";

export const VIDEO_METRICS: ReadonlyArray<{ id: VideoMetric; label: string }> = [
  { id: "views", label: "Views" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "engagement", label: "Engagement" },
];

export function videoMetricValue(video: Video, metric: VideoMetric): number | null {
  return metric === "engagement" ? engagementRate(video) : video[metric];
}

export function rankVideos(videos: readonly Video[], metric: VideoMetric) {
  return rankItems(videos, (v) => videoMetricValue(v, metric)).map(({ item, rank, value }) => ({
    video: item,
    rank,
    value,
  }));
}
