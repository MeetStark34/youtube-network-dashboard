"use client";

import Link from "next/link";
import {
  NETWORK_SCORE_WEIGHTS,
  SCORE_COMPONENTS,
  SCORE_COMPONENT_LABELS,
  type NetworkScoreRow,
  type RankingRow,
} from "@/lib/ranking";
import { displayHandle } from "@/lib/format";
import { ChannelAvatar } from "./ChannelAvatar";
import { RankingBadge } from "./RankingBadge";
import { cn } from "@/lib/cn";

export function RankingTable({
  rows,
  valueLabel,
}: {
  rows: RankingRow[];
  valueLabel: string;
}) {
  return (
    <div role="region" aria-label={`Ranking table: ${valueLabel}`} tabIndex={0} className="glass-panel overflow-auto rounded-panel">
      <table className="w-full min-w-[500px] text-sm">
        <caption className="sr-only">Main channel rankings by {valueLabel}</caption>
        <thead>
          <tr className="sticky top-0 z-10 bg-surface/95 text-left text-[11px] uppercase tracking-wide text-muted backdrop-blur-glass">
            <th scope="col" className="w-16 px-4 py-2.5 font-medium">Rank</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Channel</th>
            <th scope="col" className="w-40 px-4 py-2.5 text-right font-medium">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const leader = row.rank === 1;
            const share = Math.max(0, Math.min(100, row.share * 100));
            return (
              <tr
                key={row.channel.channelId}
                className={cn(
                  "border-t border-line/80 transition-colors duration-150 hover:bg-white/[0.035]",
                  leader && "bg-accent/[0.035]"
                )}
              >
                <td className="px-4 py-2.5">
                  <RankingBadge rank={row.rank} />
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/channel/${row.channel.channelId}`}
                    className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:underline"
                  >
                    <ChannelAvatar channel={row.channel} size={30} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium hover:underline">
                        {row.channel.name}
                      </span>
                      <span className="block truncate text-[10px] text-faint">{displayHandle(row.channel)}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-right" title={row.fullDisplay}>
                  <span className="text-sm font-semibold tabular-nums text-ink">{row.display}</span>
                  <span className="ml-auto mt-1.5 block h-1 w-full max-w-28 overflow-hidden rounded-full bg-surface-3">
                    <span
                      className={cn("block h-full rounded-full", leader ? "bg-accent" : "bg-ink/45")}
                      style={{ width: `${Math.round(share)}%` }}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ScoreBreakdownTable({ scores }: { scores: NetworkScoreRow[] }) {
  const active = SCORE_COMPONENTS.filter((k) => NETWORK_SCORE_WEIGHTS[k] > 0);
  const weightSum = active.reduce((s, k) => s + NETWORK_SCORE_WEIGHTS[k], 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th scope="col" className="w-20 px-5 py-3 font-medium">Rank</th>
            <th scope="col" className="px-3 py-3 font-medium">Channel</th>
            {active.map((k) => (
              <th key={k} scope="col" className="px-3 py-3 text-right font-medium">
                {SCORE_COMPONENT_LABELS[k]}
                <span className="block font-normal text-faint">
                  weight {weightSum > 0 ? Math.round((NETWORK_SCORE_WEIGHTS[k] / weightSum) * 100) : 0}%
                </span>
              </th>
            ))}
            <th scope="col" className="px-5 py-3 text-right font-medium">Network Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s) => (
            <tr key={s.channel.channelId} className="border-t border-line">
              <td className="px-5 py-3">
                <RankingBadge rank={s.rank} />
              </td>
              <td className="px-3 py-3 font-medium">{s.channel.name}</td>
              {active.map((k) => (
                <td key={k} className="px-3 py-3 text-right tabular-nums text-muted">
                  {s.components[k].toFixed(1)}
                </td>
              ))}
              <td className="px-5 py-3 text-right font-semibold tabular-nums">{s.total.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
