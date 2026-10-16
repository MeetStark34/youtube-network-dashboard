import type { Channel, Video } from "./types";
import { getVideoType } from "./shorts";

/**
 * Turns whatever /api/youtube returns into the strict types the UI relies on.
 * If your endpoint uses different field names, adjust them here and nowhere else.
 */

type Rec = Record<string, unknown>;

const isRec = (v: unknown): v is Rec =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

const num = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

function image(v: unknown): string | null {
  const direct = str(v);
  if (direct) return direct;
  if (isRec(v)) return str(v.url);
  return null;
}

function normalizeVideo(raw: unknown): Video | null {
  if (!isRec(raw)) return null;
  const id = str(raw.id) ?? str(raw.videoId);
  if (!id) return null;
  const title = str(raw.title) ?? "Untitled video";
  const duration = str(raw.duration);
  const contentType = getVideoType({
    title,
    duration,
    isShort: typeof raw.isShort === "boolean" ? raw.isShort : null,
  });
  return {
    id,
    title,
    thumbnail: image(raw.thumbnail),
    publishedAt: str(raw.publishedAt) ?? "",
    views: num(raw.views ?? raw.viewCount),
    likes: num(raw.likes ?? raw.likeCount),
    comments: num(raw.comments ?? raw.commentCount),
    duration,
    isShort: contentType === "unknown" ? null : contentType === "short",
  };
}

const time = (v: Video) => {
  const t = Date.parse(v.publishedAt);
  return Number.isNaN(t) ? -Infinity : t;
};

export function normalizeChannel(raw: unknown): Channel | null {
  if (!isRec(raw)) return null;
  const channelId = str(raw.channelId) ?? str(raw.id);
  if (!channelId) return null;

  const parent = str(raw.parent);
  const typeText = (str(raw.type) ?? "").toLowerCase();
  const kind = typeText.includes("sub") || parent ? "sub" : "main";

  const videos = Array.isArray(raw.latestVideos)
    ? raw.latestVideos
        .map(normalizeVideo)
        .filter((v): v is Video => v !== null)
        .sort((a, b) => time(b) - time(a))
    : [];

  const name = str(raw.name) ?? str(raw.title) ?? "Unknown channel";

  return {
    name,
    handle: str(raw.handle) ?? "",
    kind,
    parent,
    channelId,
    title: str(raw.title) ?? name,
    description: str(raw.description) ?? "",
    thumbnail: image(raw.thumbnail),
    subscribers: raw.hiddenSubscriberCount === true ? null : num(raw.subscribers),
    totalViews: num(raw.totalViews ?? raw.viewCount),
    videoCount: num(raw.videoCount),
    latestVideos: videos,
  };
}

export async function fetchChannels(signal?: AbortSignal): Promise<Channel[]> {
  const res = await fetch("/api/youtube", { cache: "no-store", signal });
  if (!res.ok) {
    throw new Error(`The data service responded with status ${res.status}.`);
  }
  const body: unknown = await res.json();
  if (!isRec(body) || body.success !== true || !Array.isArray(body.channels)) {
    const detail = isRec(body) ? str(body.error) ?? str(body.message) : null;
    throw new Error(detail ?? "The data service returned an unexpected response.");
  }
  return body.channels
    .map(normalizeChannel)
    .filter((c): c is Channel => c !== null);
}
