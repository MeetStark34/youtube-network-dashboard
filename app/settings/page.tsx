"use client";

import { useNetwork } from "@/components/DataProvider";
import { Section } from "@/components/Section";
import { TopHeader } from "@/components/TopHeader";
import { MAIN_CHANNEL_ORDER } from "@/lib/network";
import {
  NETWORK_SCORE_WEIGHTS,
  SCORE_COMPONENTS,
  SCORE_COMPONENT_LABELS,
} from "@/lib/ranking";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";

export default function SettingsPage() {
  const { updatedAt, channels, videoType, setVideoType } = useNetwork();

  return (
    <>
      <TopHeader title="Settings" subtitle="How this dashboard gets and scores its data." />

      <Section id="source" title="Data source">
        <dl className="grid gap-4 rounded-xl border border-line bg-surface p-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Endpoint</dt>
            <dd className="mt-1 font-medium">/api/youtube</dd>
          </div>
          <div>
            <dt className="text-muted">Channels loaded</dt>
            <dd className="mt-1 font-medium tabular-nums">{channels.length}</dd>
          </div>
          <div>
            <dt className="text-muted">Last updated</dt>
            <dd className="mt-1 font-medium">{updatedAt ? updatedAt.toLocaleTimeString() : "—"}</dd>
          </div>
        </dl>
      </Section>

      <Section id="video-type" title="Shared video filter" description="This video type is used across the dashboard, rankings, channel details and upload comparisons, and saved in this browser.">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4">
          <div>
            <p className="font-medium">Video type</p>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              YouTube’s API has no Shorts flag. An explicit Shorts hashtag/tag identifies a Short within the three-minute limit; longer uploads are videos. Untagged uploads up to three minutes remain unclassified and appear only in All.
            </p>
          </div>
          <VideoTypeToggle value={videoType} onChange={setVideoType} label="Shared video filter type" />
        </div>
      </Section>

      <Section
        id="weights"
        title="Network Score weights"
        description="Read only here. Change the numbers in src/lib/ranking.ts."
      >
        <ul className="divide-y divide-line rounded-xl border border-line bg-surface text-sm">
          {SCORE_COMPONENTS.map((k) => (
            <li key={k} className="flex items-center justify-between px-5 py-3">
              <span>{SCORE_COMPONENT_LABELS[k]}</span>
              <span className="tabular-nums text-muted">{NETWORK_SCORE_WEIGHTS[k]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="main-order"
        title="Main channels"
        description="These four channels are ranked against each other. Edit the list in src/lib/network.ts."
      >
        <ul className="divide-y divide-line rounded-xl border border-line bg-surface text-sm">
          {MAIN_CHANNEL_ORDER.map((name) => (
            <li key={name} className="px-5 py-3">{name}</li>
          ))}
        </ul>
      </Section>
    </>
  );
}
