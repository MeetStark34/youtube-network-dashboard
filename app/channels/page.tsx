"use client";

import { ChannelGroupGrid } from "@/components/ChannelGroupGrid";
import { ChannelTable } from "@/components/ChannelTable";
import { DataBoundary } from "@/components/DataBoundary";
import { useNetwork } from "@/components/DataProvider";
import { ChannelGridSkeleton, Skeleton } from "@/components/LoadingSkeleton";
import { Section } from "@/components/Section";
import { TopHeader } from "@/components/TopHeader";
import { orderedChannels } from "@/lib/network";

function ChannelsContent() {
  const { channels, groups } = useNetwork();
  return (
    <>
      <Section id="groups" title="By channel family" description="Each main channel with its subchannels.">
        <ChannelGroupGrid groups={groups} />
      </Section>
      <Section id="all" title="All tracked channels" description="Every channel side by side, including subchannels.">
        <ChannelTable channels={orderedChannels(channels, groups)} />
      </Section>
    </>
  );
}

export default function ChannelsPage() {
  return (
    <>
      <TopHeader title="Channels" subtitle="Every channel in the network, grouped by parent." />
      <DataBoundary
        skeleton={
          <div role="status" aria-busy="true" aria-label="Loading data">
            <Skeleton className="mb-5 h-6 w-48" />
            <ChannelGridSkeleton />
          </div>
        }
      >
        <ChannelsContent />
      </DataBoundary>
    </>
  );
}
