import Link from "next/link";
import type { Channel } from "@/lib/types";
import { displayHandle, formatCompact, formatFull, formatRelative, formatSubscribers } from "@/lib/format";
import { latestVideo } from "@/lib/network";
import { ChannelAvatar } from "./ChannelAvatar";

export function ChannelTable({ channels }: { channels: Channel[] }) {
  return (
    <div role="region" aria-label="All tracked channels" tabIndex={0} className="glass-panel overflow-x-auto rounded-panel">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th scope="col" className="px-5 py-3 font-medium">Channel</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Subscribers</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Total views</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Videos</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Latest video views</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Last upload</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((c) => {
            const latest = latestVideo(c);
            return (
              <tr key={c.channelId} className="border-t border-line transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <Link href={`/channel/${c.channelId}`} className="flex items-center gap-3">
                    <ChannelAvatar channel={c} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium hover:underline">{c.name}</span>
                      <span className="block truncate text-xs text-faint">
                        {c.kind === "sub" && c.parent ? `Subchannel of ${c.parent}` : displayHandle(c)}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-right tabular-nums" title={formatFull(c.subscribers)}>{formatSubscribers(c.subscribers)}</td>
                <td className="px-3 py-3 text-right tabular-nums" title={formatFull(c.totalViews)}>{formatCompact(c.totalViews)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatFull(c.videoCount)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatCompact(latest?.views ?? null)}</td>
                <td className="px-5 py-3 text-right text-muted">{latest ? formatRelative(latest.publishedAt) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
