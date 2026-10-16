"use client";

import { BarCompare } from "@/components/BarCompare";
import { DataBoundary } from "@/components/DataBoundary";
import { useNetwork } from "@/components/DataProvider";
import { EmptyState } from "@/components/EmptyState";
import { TablePageSkeleton } from "@/components/LoadingSkeleton";
import { Section } from "@/components/Section";
import { TopHeader } from "@/components/TopHeader";
import {
  engagementRate,
  formatCompact,
  formatPercent,
  formatSubscribers,
} from "@/lib/format";
import { latestVideo, orderedChannels } from "@/lib/network";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";

function AnalyticsContent() {
  const { channels, groups, mains, videoType, setVideoType } = useNetwork();

  const latestViews = (c: (typeof mains)[number]) => latestVideo(c, videoType)?.views ?? null;
  const latestEngagement = (c: (typeof mains)[number]) => {
    const v = latestVideo(c, videoType);
    return v ? engagementRate(v) : null;
  };
  const latestContentLabel = videoType === "shorts" ? "Short" : videoType === "videos" ? "video" : "upload";

  return (
    <>
      <div className="mb-4 flex justify-end"><VideoTypeToggle value={videoType} onChange={setVideoType} /></div>
      <Section id="compare" title="Main channel comparison" description="The four main channels, scaled to the leader in each chart.">
        <div className="grid gap-5 md:grid-cols-2">
          <BarCompare
            title="Subscribers"
            items={mains.map((c) => ({ label: c.name, value: c.subscribers, display: formatSubscribers(c.subscribers) }))}
          />
          <BarCompare
            title="Total channel views"
            items={mains.map((c) => ({ label: c.name, value: c.totalViews, display: formatCompact(c.totalViews) }))}
          />
          <BarCompare
            title={`Latest ${latestContentLabel} views`}
            items={mains.map((c) => ({ label: c.name, value: latestViews(c), display: formatCompact(latestViews(c)) }))}
          />
          <BarCompare
            title={`Latest ${latestContentLabel} engagement rate`}
            description="(Likes + comments) ÷ views"
            items={mains.map((c) => ({ label: c.name, value: latestEngagement(c), display: formatPercent(latestEngagement(c)) }))}
          />
        </div>
      </Section>

      <Section id="everyone" title="Every tracked channel" description={`Latest ${latestContentLabel} views, subchannels included.`}>
        <BarCompare
          title={`Latest ${latestContentLabel} views`}
          items={orderedChannels(channels, groups).map((c) => ({
            label: c.name,
            value: latestViews(c),
            display: formatCompact(latestViews(c)),
          }))}
        />
      </Section>

      <Section id="growth" title="Growth over time">
        <EmptyState
          icon="trend"
          title="Growth tracking needs history"
          description="The YouTube API only returns current numbers. Once subscriber and view snapshots are saved over time, trends will appear here."
        />
      </Section>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <TopHeader title="Analytics" subtitle="Compare channels on the numbers available right now." />
      <DataBoundary skeleton={<TablePageSkeleton />}>
        <AnalyticsContent />
      </DataBoundary>
    </>
  );
}
