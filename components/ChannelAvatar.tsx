import type { Channel } from "@/lib/types";
import { SafeImage } from "./SafeImage";

export function ChannelAvatar({
  channel,
  size = 40,
}: {
  channel: Pick<Channel, "name" | "thumbnail">;
  size?: number;
}) {
  const initials = channel.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeImage
      src={channel.thumbnail}
      alt={`${channel.name} channel avatar`}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full border border-line"
      fallback={
        <span className="font-semibold text-muted" style={{ fontSize: Math.max(10, size * 0.34) }}>
          {initials}
        </span>
      }
    />
  );
}
