"use client";

import { useState } from "react";
import { DataBoundary } from "@/components/DataBoundary";
import { useNetwork } from "@/components/DataProvider";
import { EmptyState } from "@/components/EmptyState";
import { ListPageSkeleton } from "@/components/LoadingSkeleton";
import { Section } from "@/components/Section";
import { TopHeader } from "@/components/TopHeader";
import { UploadList } from "@/components/UploadList";
import { isToday } from "@/lib/format";
import { orderedChannels } from "@/lib/network";
import { filterVideos } from "@/lib/network";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";

function UploadsContent() {
  const { channels, groups, uploads, videoType, setVideoType } = useNetwork();
  const [channelId, setChannelId] = useState("all");

  const filteredByChannel = channelId === "all" ? uploads : uploads.filter((u) => u.channel.channelId === channelId);
  const filtered = filteredByChannel.filter(({ video }) => filterVideos([video], videoType).length > 0);
  const today = filtered.filter((u) => isToday(u.video.publishedAt));
  const latestSectionTitle = videoType === "shorts" ? "Latest Shorts" : videoType === "videos" ? "Latest videos" : "Latest uploads";
  const emptyTitle = videoType === "shorts" ? "No Shorts found" : videoType === "videos" ? "No videos found" : "No uploads found";

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <label htmlFor="channel-filter" className="mb-2 block text-sm text-muted">
          Channel
        </label>
        <select
          id="channel-filter"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="min-h-10 w-full max-w-xs rounded-control border border-line bg-surface/80 px-3 py-2 text-sm"
        >
          <option value="all">All channels</option>
          {orderedChannels(channels, groups).map((c) => (
            <option key={c.channelId} value={c.channelId}>
              {c.kind === "sub" ? `— ${c.name}` : c.name}
            </option>
          ))}
        </select>
        <div><p className="mb-2 text-sm text-muted">Video type</p><VideoTypeToggle value={videoType} onChange={setVideoType} /></div>
      </div>

      <Section id="today" title="Today" description="Published today in your local time.">
        <UploadList items={today} />
      </Section>

      <Section
        id="recent"
        title={latestSectionTitle}
        description="The newest uploads returned for each channel, filtered by content type before display."
      >
        <UploadList
          items={filtered.slice(0, 40)}
          showDate
          empty={<EmptyState icon="uploads" title={emptyTitle} description="No matching uploads are available in the fetched data." />}
        />
      </Section>
    </>
  );
}

export default function UploadsPage() {
  return (
    <>
      <TopHeader title="Recent Uploads" subtitle="What every tracked channel has published lately." />
      <DataBoundary skeleton={<ListPageSkeleton />}>
        <UploadsContent />
      </DataBoundary>
    </>
  );
}
