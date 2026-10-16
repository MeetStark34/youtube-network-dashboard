import Link from "next/link";
import type { Channel, VideoTypeFilter } from "@/lib/types";
import { displayHandle, formatCompact, formatFull, formatSubscribers, youtubeVideoUrl } from "@/lib/format";
import { filterVideos, latestVideo } from "@/lib/network";
import { rankVideos } from "@/lib/ranking";
import { ChannelAvatar } from "./ChannelAvatar";
import { LatestVideoRank } from "./LatestVideoRank";
import { SafeImage } from "./SafeImage";
import { VideoStats } from "./VideoStats";

function CompactStat({ label, value, title }: { label: string; value: string; title: string }) {
  return (
    <div className="min-w-0" title={title}>
      <dt className="truncate text-[10px] font-medium uppercase tracking-wide text-faint">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold leading-4 tabular-nums text-ink">{value}</dd>
    </div>
  );
}

export function DashboardChannelCard({
  channel,
  videoType,
}: {
  channel: Channel;
  videoType: VideoTypeFilter;
}) {
  const matchingVideos = filterVideos(channel.latestVideos, videoType).slice(0, 10);
  const latest = latestVideo(channel, videoType);
  const latestRank = latest
    ? rankVideos(matchingVideos, "views").find(({ video }) => video.id === latest.id)?.rank ?? null
    : null;
  const latestLabel = videoType === "shorts" ? "Latest Short" : videoType === "videos" ? "Latest video" : "Latest upload";
  const emptyLabel = videoType === "shorts" ? "Shorts" : videoType === "videos" ? "videos" : "uploads";

  return (
    <article className="glass-panel dashboard-enter group min-w-0 rounded-panel p-panel transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-lg">
      <header className="flex min-w-0 items-center gap-2.5">
        <ChannelAvatar channel={channel} size={36} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold leading-5">
            <Link href={`/channel/${channel.channelId}`} className="rounded-sm hover:text-accent hover:underline">
              {channel.name}
            </Link>
          </h3>
          <p className="truncate text-xs leading-4 text-muted">{displayHandle(channel) || "Handle unavailable"}</p>
        </div>
      </header>

      <dl className="mt-2.5 grid grid-cols-3 gap-2 border-y border-line/80 py-2">
        <CompactStat
          label="Subscribers"
          value={formatSubscribers(channel.subscribers)}
          title={channel.subscribers === null ? "Subscriber count hidden" : `${formatFull(channel.subscribers)} subscribers`}
        />
        <CompactStat
          label="Total views"
          value={formatCompact(channel.totalViews)}
          title={`${formatFull(channel.totalViews)} total channel views`}
        />
        <CompactStat
          label="Videos"
          value={formatCompact(channel.videoCount)}
          title={`${formatFull(channel.videoCount)} videos`}
        />
      </dl>

      <div className="mt-2.5">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{latestLabel}</span>
          <LatestVideoRank rank={latestRank} total={matchingVideos.length} filter={videoType} />
        </div>

        {latest ? (
          <div className="flex min-w-0 items-start gap-2.5">
            <a
              href={youtubeVideoUrl(latest.id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch “${latest.title}” on YouTube (opens in a new tab)`}
              className="block aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-surface-3"
            >
              <SafeImage src={latest.thumbnail} alt={`Thumbnail for ${latest.title}`} className="aspect-video size-full object-cover" />
            </a>
            <div className="min-w-0 flex-1">
              <a
                href={youtubeVideoUrl(latest.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-xs font-medium leading-4 text-ink decoration-white/40 underline-offset-2 hover:underline"
              >
                {latest.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <div className="mt-1.5">
                <VideoStats video={latest} compact />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[4.5rem] items-center rounded-lg border border-dashed border-line px-3 text-xs text-muted">
            No {emptyLabel} in the latest uploads returned for this channel.
          </div>
        )}
      </div>
    </article>
  );
}
