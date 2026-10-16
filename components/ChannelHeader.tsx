import Link from "next/link";
import type { Channel } from "@/lib/types";
import {
  displayHandle,
  formatCompact,
  formatFull,
  formatSubscribers,
  youtubeChannelUrl,
} from "@/lib/format";
import { ChannelAvatar } from "./ChannelAvatar";
import { Icon } from "./Icon";

export function ChannelHeader({
  channel,
  parent,
  subs,
}: {
  channel: Channel;
  parent: Channel | null;
  subs: Channel[];
}) {
  return (
    <header>
      <Link href="/channels" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        ← All channels
      </Link>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <ChannelAvatar channel={channel} size={80} />
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight">{channel.name}</h1>
            <p className="mt-1 text-muted">{displayHandle(channel)}</p>
            {parent && (
              <p className="mt-2 text-sm text-faint">
                Subchannel of{" "}
                <Link href={`/channel/${parent.channelId}`} className="text-muted underline-offset-2 hover:text-ink hover:underline">
                  {parent.name}
                </Link>
              </p>
            )}
            {subs.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-faint">
                Subchannels:
                {subs.map((s) => (
                  <Link
                    key={s.channelId}
                    href={`/channel/${s.channelId}`}
                    className="text-muted underline-offset-2 hover:text-ink hover:underline"
                  >
                    {s.name}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <dl className="flex gap-10">
            <div title={channel.subscribers === null ? "This channel hides its subscriber count" : formatFull(channel.subscribers)}>
              <dt className="text-xs text-muted">Subscribers</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{formatSubscribers(channel.subscribers)}</dd>
            </div>
            <div title={formatFull(channel.totalViews)}>
              <dt className="text-xs text-muted">Total views</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{formatCompact(channel.totalViews)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Total videos</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{formatFull(channel.videoCount)}</dd>
            </div>
          </dl>
          <a
            href={youtubeChannelUrl(channel.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-control border border-line bg-surface/80 px-3.5 text-sm transition-colors duration-200 hover:bg-surface-2"
          >
            Open on YouTube
            <Icon name="external" className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
