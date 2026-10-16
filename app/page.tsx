"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardChannelCard } from "@/components/DashboardChannelCard";
import { DataBoundary } from "@/components/DataBoundary";
import { EmptyState } from "@/components/EmptyState";
import { useNetwork } from "@/components/DataProvider";
import { KpiStrip } from "@/components/KpiStrip";
import { OverviewSkeleton } from "@/components/LoadingSkeleton";
import { RankingPanel } from "@/components/RankingPanel";
import { Section } from "@/components/Section";
import { SubchannelStrip } from "@/components/SubchannelStrip";
import { TopHeader } from "@/components/TopHeader";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";
import { formatCompact, formatFull, isToday, youtubeVideoUrl } from "@/lib/format";
import { computeOverview } from "@/lib/metrics";
import { buildRanking, RANKING_CATEGORIES, type RankingCategory } from "@/lib/ranking";
import { filterVideos, latestVideo } from "@/lib/network";

const DASHBOARD_RANKS = RANKING_CATEGORIES.filter(({ id }) => id !== "subscribers");

function sumKnown(values: Array<number | null>): number | null {
  const known = values.filter((value): value is number => value !== null);
  return known.length > 0 ? known.reduce((sum, value) => sum + value, 0) : null;
}

function OverviewContent() {
  const { groups, mains, channels, uploads, videoType } = useNetwork();
  const [category, setCategory] = useState<RankingCategory>("overall");
  const visibleUploads = uploads.filter(({ video }) => filterVideos([video], videoType).length > 0);
  const todayUploads = visibleUploads.filter(({ video }) => isToday(video.publishedAt));
  const overview = computeOverview(mains, visibleUploads, videoType);
  const latestCount = mains.filter((channel) => latestVideo(channel, videoType) !== null).length;
  const rankingRows = useMemo(() => buildRanking(mains, category, videoType), [mains, category, videoType]);

  const subscribers = sumKnown(channels.map((channel) => channel.subscribers));
  const totalViews = sumKnown(channels.map((channel) => channel.totalViews));
  const totalVideos = sumKnown(channels.map((channel) => channel.videoCount));
  const hiddenSubscribers = channels.filter((channel) => channel.subscribers === null).length;
  const missingViews = channels.filter((channel) => channel.totalViews === null).length;
  const missingVideos = channels.filter((channel) => channel.videoCount === null).length;
  const subscriberTitle = subscribers === null
    ? "Subscriber totals are unavailable"
    : `${formatFull(subscribers)} known subscribers${hiddenSubscribers ? ` · ${hiddenSubscribers} hidden` : ""}`;
  const viewsTitle = totalViews === null ? "Total channel views are unavailable" : `${formatFull(totalViews)} known total channel views`;
  const videosTitle = totalVideos === null ? "Video counts are unavailable" : `${formatFull(totalVideos)} known videos`;
  const subchannelCount = groups.reduce((count, group) => count + group.subs.length, 0);

  const kpis = [
    {
      label: "Subscribers",
      value: formatCompact(subscribers),
      title: subscriberTitle,
      note: hiddenSubscribers ? `${hiddenSubscribers} hidden` : `${channels.length} tracked channels`,
    },
    {
      label: "Total views",
      value: formatCompact(totalViews),
      title: viewsTitle,
      note: missingViews ? `${missingViews} unavailable` : `${channels.length} tracked channels`,
    },
    {
      label: "Videos",
      value: formatCompact(totalVideos),
      title: videosTitle,
      note: missingVideos ? `${missingVideos} unavailable` : `${channels.length} tracked channels`,
    },
    {
      label: "Today’s uploads",
      value: formatFull(todayUploads.length),
      title: `${formatFull(todayUploads.length)} matching uploads published today among the latest uploads returned`,
      note: "In latest uploads returned",
    },
    {
      label: "Latest views",
      value: formatCompact(overview.latestViewsTotal),
      title: overview.latestViewsTotal === null ? "No main-channel latest view counts are available" : `${formatFull(overview.latestViewsTotal)} views across the latest matching main-channel uploads`,
      note: `${overview.latestViewsChannels}/${latestCount} view counts · main channels`,
    },
  ];

  return (
    <>
      <KpiStrip items={kpis} />

      <Section
        id="main-channels"
        title="Main channels"
        description="Latest matching uploads and current channel totals."
        action={<Link href="/channels" className="min-h-10 inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-ink">All channels <span aria-hidden="true" className="ml-1">→</span></Link>}
      >
        {mains.length > 0 ? (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {mains.map((channel) => (
              <DashboardChannelCard key={channel.channelId} channel={channel} videoType={videoType} />
            ))}
          </div>
        ) : (
          <EmptyState icon="channels" title="No main channels available" description="The response did not include any configured main channels." />
        )}
      </Section>

      {subchannelCount > 0 && (
        <Section
          id="subchannels"
          title="Subchannels"
          description="A compact view of the rest of your network."
          action={<span className="text-xs text-faint">{subchannelCount} tracked</span>}
        >
          <SubchannelStrip groups={groups} videoType={videoType} />
        </Section>
      )}

      <Section
        id="network-rankings"
        title="Main channel rankings"
        description="Latest matching upload metrics · all four main channels."
        action={<Link href="/ranking" className="min-h-10 inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-ink">Full rankings <span aria-hidden="true" className="ml-1">→</span></Link>}
      >
        <RankingPanel
          rows={rankingRows}
          category={category}
          onCategoryChange={setCategory}
          categories={DASHBOARD_RANKS}
        />
      </Section>

      <Section
        id="today"
        title="Today’s uploads"
        description="Matching videos published today, based on the latest uploads returned by YouTube."
        action={<Link href="/uploads" className="min-h-10 inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-ink">Browse uploads <span aria-hidden="true" className="ml-1">→</span></Link>}
      >
        {todayUploads.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {todayUploads.slice(0, 8).map(({ channel, video }) => (
              <li key={`${channel.channelId}-${video.id}`} className="min-w-0 max-w-full sm:max-w-[24rem]">
                <a
                  href={youtubeVideoUrl(video.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 max-w-full items-center truncate rounded-xl border border-line bg-surface/80 px-3 py-2 text-sm transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="text-muted">{channel.name} · </span>{video.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="glass-panel rounded-xl px-4 py-3 text-sm text-muted">No matching videos published today.</p>
        )}
      </Section>
    </>
  );
}

export default function OverviewPage() {
  const { videoType, setVideoType } = useNetwork();

  return (
    <>
      <TopHeader title="Network Dashboard" subtitle="A live view of your channel network and latest performance." />
      <div className="sticky sticky-surface top-12 z-20 -mx-4 mb-3 flex items-center justify-between gap-3 border-y border-line/80 px-4 py-2 sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-8 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink">Latest uploads</p>
          <p className="hidden text-[11px] text-muted sm:block">Type modes exclude ambiguous uploads</p>
        </div>
        <VideoTypeToggle value={videoType} onChange={setVideoType} label="Filter latest uploads by type" />
      </div>
      <DataBoundary skeleton={<OverviewSkeleton />}>
        <OverviewContent />
      </DataBoundary>
    </>
  );
}
