import type { Channel, ChannelGroup, UploadItem, Video, VideoTypeFilter } from "./types";
import { getVideoType, type VideoTypeMetadata } from "./shorts";

/** Display order for the four main channels. Names are matched loosely. */
export const MAIN_CHANNEL_ORDER = [
  "BnfTV",
  "PJ Explained",
  "ComicVerse",
  "Men of Culture Podcast",
] as const;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function orderIndex(channel: Channel): number {
  const i = MAIN_CHANNEL_ORDER.findIndex((n) => norm(n) === norm(channel.name));
  return i === -1 ? MAIN_CHANNEL_ORDER.length : i;
}

function isChildOf(sub: Channel, main: Channel): boolean {
  if (!sub.parent) return false;
  const parent = norm(sub.parent);
  return [main.name, main.title, main.handle, main.channelId].some(
    (candidate) => candidate !== "" && norm(candidate) === parent
  );
}

export function buildGroups(channels: readonly Channel[]): ChannelGroup[] {
  const subs = channels.filter((c) => c.kind === "sub");
  return channels
    .filter((c) => c.kind === "main")
    .sort((a, b) => orderIndex(a) - orderIndex(b))
    .map((main) => ({ main, subs: subs.filter((s) => isChildOf(s, main)) }));
}

/** Mains followed by their subchannels, then any channel without a known parent. */
export function orderedChannels(
  channels: readonly Channel[],
  groups: readonly ChannelGroup[]
): Channel[] {
  const ordered = groups.flatMap((g) => [g.main, ...g.subs]);
  const seen = new Set(ordered.map((c) => c.channelId));
  return [...ordered, ...channels.filter((c) => !seen.has(c.channelId))];
}

export function findParent(
  channel: Channel,
  groups: readonly ChannelGroup[]
): Channel | null {
  return groups.find((g) => g.subs.some((s) => s.channelId === channel.channelId))?.main ?? null;
}

export const filterVideos = <T extends VideoTypeMetadata>(
  videos: readonly T[],
  filter: VideoTypeFilter
): T[] => {
  if (filter === "shorts") return videos.filter((video) => getVideoType(video) === "short");
  if (filter === "videos") return videos.filter((video) => getVideoType(video) === "video");
  return [...videos];
};

export const latestVideo = (channel: Channel, filter: VideoTypeFilter = "all"): Video | null =>
  filterVideos(channel.latestVideos, filter)[0] ?? null;

export function collectUploads(channels: readonly Channel[]): UploadItem[] {
  const t = (v: Video) => {
    const n = Date.parse(v.publishedAt);
    return Number.isNaN(n) ? -Infinity : n;
  };
  return channels
    .flatMap((channel) => channel.latestVideos.map((video) => ({ channel, video })))
    .sort((a, b) => t(b.video) - t(a.video));
}
