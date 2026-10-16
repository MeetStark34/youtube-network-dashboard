"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ChannelHeader } from "@/components/ChannelHeader";
import { DataBoundary } from "@/components/DataBoundary";
import { useNetwork } from "@/components/DataProvider";
import { EmptyState } from "@/components/EmptyState";
import { LatestVideoCard, type RankChip } from "@/components/LatestVideoCard";
import { ChannelDetailSkeleton } from "@/components/LoadingSkeleton";
import { Section } from "@/components/Section";
import { VideoTable } from "@/components/VideoTable";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";
import { filterVideos, findParent, latestVideo } from "@/lib/network";
import { VIDEO_METRICS, rankVideos } from "@/lib/ranking";

function ChannelContent({ channelId }: { channelId: string }) {
  const { channels, groups, videoType, setVideoType } = useNetwork();
  const channel = channels.find((c) => c.channelId === channelId);

  if (!channel) {
    return (
      <EmptyState
        icon="channels"
        title="Channel not found"
        description="This channel is not part of the tracked network."
        action={
          <Link
            href="/channels"
            className="inline-flex rounded-lg border border-line-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
          >
            Back to channels
          </Link>
        }
      />
    );
  }

  const parent = findParent(channel, groups);
  const subs = groups.find((g) => g.main.channelId === channel.channelId)?.subs ?? [];
  const latest = latestVideo(channel, videoType);
  const recent = filterVideos(channel.latestVideos, videoType).slice(0, 10);
  const contentTypeLabel = videoType === "shorts" ? "Shorts" : videoType === "videos" ? "videos" : "uploads";
  const latestSectionTitle = videoType === "shorts" ? "Latest Short" : videoType === "videos" ? "Latest video" : "Latest upload";
  const recentSectionTitle = videoType === "shorts" ? "Latest 10 Shorts" : "Latest 10 videos";

  const ranks: RankChip[] = latest
    ? VIDEO_METRICS.map((m) => ({
        label: m.label,
        rank: rankVideos(recent, m.id).find((r) => r.video.id === latest.id)?.rank ?? null,
        total: recent.length,
      }))
    : [];

  return (
    <>
      <ChannelHeader channel={channel} parent={parent} subs={subs} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-line bg-surface/75 px-3 py-2 backdrop-blur-glass">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em]">Latest uploads</p>
          <p className="text-xs text-muted">Filter this channel’s latest uploads and rankings</p>
        </div>
        <VideoTypeToggle value={videoType} onChange={setVideoType} label="Filter channel videos by type" />
      </div>

      <div className="mt-6">
        <Section id="latest" title={latestSectionTitle}>
          {latest ? (
            <LatestVideoCard
              video={latest}
              variant="feature"
              ranks={ranks}
              rankedContentLabel={contentTypeLabel}
            />
          ) : (
            <EmptyState
              icon="uploads"
              title={`No ${videoType === "shorts" ? "Shorts" : videoType === "videos" ? "videos" : "uploads"} available`}
              description="No matching uploads were returned for this channel."
            />
          )}
        </Section>
      </div>

      <Section
        id="recent"
        title={recentSectionTitle}
        description={`Showing up to 10 latest matching ${contentTypeLabel} from the newest 50 uploads returned. Ranking is calculated after filtering; unclassified uploads appear only in All. Engagement is (likes + comments) ÷ views.`}
      >
        {recent.length > 0 ? (
          <VideoTable videos={recent} videoType={videoType} />
        ) : (
          <EmptyState icon="uploads" title={`No ${videoType === "shorts" ? "Shorts" : videoType === "videos" ? "videos" : "uploads"} to rank`} />
        )}
      </Section>
    </>
  );
}

export default function ChannelPage() {
  return (
    <Suspense fallback={<ChannelDetailSkeleton />}>
      <ChannelPageContent />
    </Suspense>
  );
}

function ChannelPageContent() {
  const params = useParams<{ channelId: string }>();
  return (
    <DataBoundary skeleton={<ChannelDetailSkeleton />}>
      <ChannelContent channelId={params.channelId} />
    </DataBoundary>
  );
}
