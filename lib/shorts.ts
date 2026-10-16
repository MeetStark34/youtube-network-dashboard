/** YouTube's public Video resource has no authoritative Shorts flag. */
export type VideoContentType = "video" | "short" | "unknown";

export interface VideoTypeMetadata {
  title: string;
  duration: string | null;
  isShort?: boolean | null;
  tags?: readonly string[];
}

const MAX_SHORT_DURATION_SECONDS = 3 * 60;
const SHORT_TAG = /#(?:shorts?|ytshorts)\b/i;

const hasShortHashtag = (value: string) => SHORT_TAG.test(value);
const hasShortTag = (value: string) =>
  hasShortHashtag(value) || /^(?:youtube\s+)?shorts?$/i.test(value.trim());

function durationInSeconds(raw: string | null): number | null {
  if (!raw) return null;
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i.exec(raw);
  if (!match || !match.slice(1).some(Boolean)) return null;

  return Number(match[1] ?? 0) * 86400
    + Number(match[2] ?? 0) * 3600
    + Number(match[3] ?? 0) * 60
    + Number(match[4] ?? 0);
}

/**
 * Infer Shorts only from an explicit Shorts hashtag, while using the current
 * three-minute Shorts limit to rule out impossible durations. Shorter,
 * untagged videos stay unknown because duration alone cannot distinguish them.
 */
export function detectShort(
  title: string,
  duration: string | null,
  tags: readonly string[] = []
): boolean | null {
  const seconds = durationInSeconds(duration);
  if (seconds !== null && seconds > MAX_SHORT_DURATION_SECONDS) return false;

  if (hasShortHashtag(title) || tags.some(hasShortTag)) return true;
  return null;
}

/** Central classification used by API normalization, filters, and UI labels. */
export function getVideoType(video: VideoTypeMetadata): VideoContentType {
  if (video.isShort === true) return "short";
  if (video.isShort === false) return "video";

  const inferredShort = detectShort(video.title, video.duration, video.tags);
  if (inferredShort === true) return "short";
  if (inferredShort === false) return "video";
  return "unknown";
}
