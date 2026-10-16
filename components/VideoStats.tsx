import type { Video } from "@/lib/types";
import { engagementRate, formatCompact, formatFull, formatPercent } from "@/lib/format";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/cn";

interface Props {
  video: Pick<Video, "views" | "likes" | "comments">;
  layout?: "inline" | "grid";
  showEngagement?: boolean;
  compact?: boolean;
}

interface Stat {
  label: string;
  icon: IconName;
  display: string;
  title: string;
}

function countStat(label: string, icon: IconName, n: number | null): Stat {
  return {
    label,
    icon,
    display: formatCompact(n),
    title: n === null ? `${label} not available` : `${formatFull(n)} ${label.toLowerCase()}`,
  };
}

export function VideoStats({ video, layout = "inline", showEngagement = false, compact = false }: Props) {
  const stats: Stat[] = [
    countStat("Views", "eye", video.views),
    countStat("Likes", "like", video.likes),
    countStat("Comments", "comment", video.comments),
  ];
  if (showEngagement) {
    const rate = engagementRate(video);
    stats.push({
      label: "Engagement",
      icon: "trend",
      display: formatPercent(rate),
      title: rate === null ? "Engagement not available" : "Likes plus comments, divided by views",
    });
  }

  if (layout === "grid") {
    return (
      <dl className={cn("grid gap-4", showEngagement ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
        {stats.map((s) => (
          <div key={s.label} title={s.title}>
            <dt className="text-xs text-muted">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{s.display}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={cn("flex min-w-0 flex-wrap text-muted", compact ? "gap-x-2.5 gap-y-1 text-[10px]" : "gap-x-4 gap-y-1 text-sm")}>
      {stats.map((s) => (
        <div key={s.label} title={s.title} className={cn("flex min-w-0 items-center", compact ? "gap-1" : "gap-1.5")}>
          <dt className="sr-only">{s.label}</dt>
          <Icon name={s.icon} className={cn("shrink-0 text-faint", compact ? "size-3" : "size-3.5")} />
          <dd className="tabular-nums">{s.display}</dd>
        </div>
      ))}
    </dl>
  );
}
