import Link from "next/link";
import type { ChannelGroup, VideoTypeFilter } from "@/lib/types";
import { formatCompact, formatFull, formatSubscribers } from "@/lib/format";
import { latestVideo } from "@/lib/network";
import { ChannelAvatar } from "./ChannelAvatar";

export function SubchannelStrip({
  groups,
  videoType,
}: {
  groups: ChannelGroup[];
  videoType: VideoTypeFilter;
}) {
  const subchannels = groups.flatMap(({ subs }) => subs);
  if (subchannels.length === 0) return null;

  return (
    <div role="region" aria-label="Subchannels" tabIndex={0} className="flex snap-x gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-5">
      {subchannels.map((channel) => {
        const latest = latestVideo(channel, videoType);
        return (
          <Link
            key={channel.channelId}
            href={`/channel/${channel.channelId}`}
            className="glass-panel flex min-w-[220px] snap-start items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:border-white/15 hover:bg-surface-2 sm:min-w-0"
          >
            <ChannelAvatar channel={channel} size={28} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-ink">{channel.name}</span>
              <span className="mt-0.5 block truncate text-[10px] text-muted">
                <span title={channel.subscribers === null ? "Subscriber count hidden" : `${formatFull(channel.subscribers)} subscribers`}>
                  {formatSubscribers(channel.subscribers)} subs
                </span>
                <span aria-hidden="true"> · </span>
                <span title={latest?.views === null || latest?.views === undefined ? "Latest video views unavailable" : `${formatFull(latest.views)} latest video views`}>
                  {formatCompact(latest?.views ?? null)} views
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
