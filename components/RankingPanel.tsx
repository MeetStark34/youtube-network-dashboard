"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import type { RankingCategory, RankingRow } from "@/lib/ranking";
import { cn } from "@/lib/cn";
import { EmptyState } from "./EmptyState";
import { RankingTable } from "./RankingTable";

export interface RankingTab {
  id: RankingCategory;
  label: string;
  description: string;
}

export function RankingPanel({
  rows,
  category,
  onCategoryChange,
  categories,
}: {
  rows: RankingRow[];
  category: RankingCategory;
  onCategoryChange: (category: RankingCategory) => void;
  categories: readonly RankingTab[];
}) {
  const instanceId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentIndex = Math.max(0, categories.findIndex((tab) => tab.id === category));
  const current = categories[currentIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % categories.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + categories.length) % categories.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = categories.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    onCategoryChange(categories[nextIndex].id);
  }

  if (!current) return null;
  const activeTabId = `${instanceId}-tab-${current.id}`;

  return (
    <div>
      <div role="tablist" aria-label="Rank main channels by" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-glass">
        {categories.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`${instanceId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={category === tab.id}
            aria-controls={`${instanceId}-panel`}
            tabIndex={category === tab.id ? 0 : -1}
            onClick={() => onCategoryChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "min-h-10 shrink-0 rounded-lg px-3 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm",
              category === tab.id
                ? "bg-surface-3 text-ink shadow-sm"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`${instanceId}-panel`}
        role="tabpanel"
        aria-labelledby={activeTabId}
        tabIndex={0}
        className="mt-3 min-w-0 focus-visible:rounded-lg"
      >
        <p className="mb-2 text-xs leading-5 text-muted" aria-live="polite">{current.description}</p>
        {rows.length > 0 ? (
          <RankingTable rows={rows} valueLabel={category === "overall" ? "Network score" : current.label} />
        ) : (
          <EmptyState icon="ranking" title="No main channels to rank" description="No main-channel data is available for this ranking yet." />
        )}
      </div>
    </div>
  );
}
