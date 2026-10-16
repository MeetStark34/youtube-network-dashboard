import type { Channel, Video } from "./types";

const compactFmt = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fullFmt = new Intl.NumberFormat("en");
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatCompact = (n: number | null) =>
  n === null ? "—" : compactFmt.format(n);

export const formatFull = (n: number | null) =>
  n === null ? "—" : fullFmt.format(n);

export const formatSubscribers = (n: number | null) =>
  n === null ? "Hidden" : compactFmt.format(n);

export function formatPercent(n: number | null): string {
  if (n === null) return "—";
  return `${n.toFixed(n >= 10 ? 1 : 2)}%`;
}

/** (likes + comments) / views × 100. Returns null when it cannot be computed. */
export function engagementRate(
  v: Pick<Video, "views" | "likes" | "comments">
): number | null {
  if (v.views === null || v.views <= 0) return null;
  if (v.likes === null && v.comments === null) return null;
  return (((v.likes ?? 0) + (v.comments ?? 0)) / v.views) * 100;
}

export function formatDuration(raw: string | null): string | null {
  if (!raw) return null;
  const iso = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(raw);
  if (!iso) return raw;
  const days = Number(iso[1] ?? 0);
  const hours = days * 24 + Number(iso[2] ?? 0);
  const minutes = Number(iso[3] ?? 0);
  const seconds = Number(iso[4] ?? 0);
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${ss}`;
  return `${minutes}:${ss}`;
}

export function parseDate(iso: string): Date | null {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : new Date(t);
}

export function formatDate(iso: string): string {
  const d = parseDate(iso);
  return d ? dateFmt.format(d) : "—";
}

export function formatTime(iso: string): string {
  const d = parseDate(iso);
  return d ? timeFmt.format(d) : "—";
}

export function formatDateTime(iso: string): string {
  const d = parseDate(iso);
  return d ? dateTimeFmt.format(d) : "—";
}

export function formatRelative(iso: string): string {
  const d = parseDate(iso);
  if (!d) return "—";
  const minutes = Math.floor((Date.now() - d.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} d ago`;
  return dateFmt.format(d);
}

export function isToday(iso: string): boolean {
  const d = parseDate(iso);
  return d !== null && d.toDateString() === new Date().toDateString();
}

export const youtubeVideoUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;

export const youtubeChannelUrl = (channelId: string) =>
  `https://www.youtube.com/channel/${encodeURIComponent(channelId)}`;

export function displayHandle(channel: Pick<Channel, "handle">): string {
  if (!channel.handle) return "";
  return channel.handle.startsWith("@") ? channel.handle : `@${channel.handle}`;
}
