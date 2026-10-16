"use client";

import { useMemo, useState } from "react";
import { DataBoundary } from "@/components/DataBoundary";
import { useNetwork } from "@/components/DataProvider";
import { TablePageSkeleton } from "@/components/LoadingSkeleton";
import { ScoreBreakdownTable } from "@/components/RankingTable";
import { RankingPanel } from "@/components/RankingPanel";
import { Section } from "@/components/Section";
import { TopHeader } from "@/components/TopHeader";
import {
  RANKING_CATEGORIES,
  buildNetworkScores,
  buildRanking,
  type RankingCategory,
} from "@/lib/ranking";
import { VideoTypeToggle } from "@/components/VideoTypeToggle";

function RankingContent() {
  const { mains, videoType, setVideoType } = useNetwork();
  const [category, setCategory] = useState<RankingCategory>("overall");

  const rows = useMemo(() => buildRanking(mains, category, videoType), [mains, category, videoType]);
  const scores = useMemo(() => buildNetworkScores(mains, videoType), [mains, videoType]);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Current channel totals and latest matching upload metrics · four main channels</p>
        <VideoTypeToggle value={videoType} onChange={setVideoType} />
      </div>
      <RankingPanel
        rows={rows}
        category={category}
        onCategoryChange={setCategory}
        categories={RANKING_CATEGORIES}
      />

      {category === "overall" && (
        <Section
          id="score-breakdown"
          title="How the Network Score is calculated"
          description="Each metric is scored from 0 to 100 against the best of the four main channels, then combined using the weights shown. This is a ranking made by this dashboard, not an official YouTube ranking."
        >
          <div className="mt-0">
            <ScoreBreakdownTable scores={scores} />
          </div>
          <p className="mt-3 text-xs text-faint">
            Weights are set in src/lib/ranking.ts. A channel that hides its subscriber count scores 0 for subscribers.
          </p>
        </Section>
      )}
    </>
  );
}

export default function RankingPage() {
  return (
    <>
      <TopHeader
        title="Overall Ranking"
        subtitle="BnfTV, PJ Explained, ComicVerse and Men of Culture Podcast compared head to head. Subchannels are not included."
      />
      <DataBoundary skeleton={<TablePageSkeleton />}>
        <RankingContent />
      </DataBoundary>
    </>
  );
}
