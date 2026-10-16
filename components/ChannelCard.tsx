import Link from "next/link";
import type { Channel } from "@/lib/types";
import { displayHandle, formatCompact, formatFull, formatSubscribers } from "@/lib/format";
import { latestVideo } from "@/lib/network";
import { ChannelAvatar } from "./ChannelAvatar";
import { LatestVideoCard } from "./LatestVideoCard";

function Fact({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div title={title}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function SubChannelTree({ subs }: { subs: Channel[] }) {
  return (
    <div className="border-t border-line px-4 py-3">
      <p className="mb-3 text-xs text-muted">
        {subs.length === 1 ? "Subchannel" : "Subchannels"}
      </p>
      <ul>
        {subs.map((sub) => {
          const latest = latestVideo(sub);
          return (
            <li
              key={sub.channelId}
              className="relative py-1.5 pl-7 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-line after:absolute after:left-2 after:top-1/2 after:h-px after:w-3.5 after:bg-line last:before:h-1/2"
            >
              <div className="flex items-center gap-3">
                <ChannelAvatar channel={sub} size={28} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/channel/${sub.channelId}`}
                    className="relative z-10 block truncate text-sm font-medium hover:underline"
                  >
                    {sub.name}
                  </Link>
                  <p className="truncate text-xs text-faint">{displayHandle(sub)}</p>
                </div>
                <dl className="flex shrink-0 gap-4 text-right text-xs text-muted">
                  <div>
                    <dt className="sr-only">Subscribers</dt>
                    <dd className="tabular-nums" title={sub.subscribers === null ? "Subscriber count hidden" : `${formatFull(sub.subscribers)} subscribers`}>
                      {formatSubscribers(sub.subscribers)} subs
                    </dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="sr-only">Latest video views</dt>
                    <dd className="tabular-nums">{formatCompact(latest?.views ?? null)} views</dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChannelCard({
  channel,
  subChannels = [],
}: {
  channel: Channel;
  subChannels?: Channel[];
}) {
  const latest = latestVideo(channel);

  return (
    <article className="glass-panel group relative flex min-w-0 flex-col rounded-panel transition duration-200 hover:-translate-y-0.5 hover:border-white/15">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <header className="flex items-center gap-3">
          <ChannelAvatar channel={channel} size={48} />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{channel.name}</h3>
            <p className="truncate text-sm text-muted">{displayHandle(channel)}</p>
          </div>
        </header>

        <dl className="grid grid-cols-3 gap-3 border-y border-line py-3">
          <Fact
            label="Subscribers"
            value={formatSubscribers(channel.subscribers)}
            title={channel.subscribers === null ? "This channel hides its subscriber count" : formatFull(channel.subscribers)}
          />
          <Fact label="Total views" value={formatCompact(channel.totalViews)} title={formatFull(channel.totalViews)} />
          <Fact label="Videos" value={formatFull(channel.videoCount)} />
        </dl>

        {latest ? (
          <div>
            <p className="mb-3 text-sm font-medium">Latest video</p>
            <LatestVideoCard video={latest} />
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
            No videos available for this channel.
          </p>
        )}

        <Link
          href={`/channel/${channel.channelId}`}
          aria-label={`View ${channel.name} channel`}
          className="mt-auto inline-flex w-fit items-center text-sm font-medium after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent group-hover:text-accent"
        >
          View Channel →
        </Link>
      </div>

      {subChannels.length > 0 && <SubChannelTree subs={subChannels} />}
    </article>
  );
}
