import { cn } from "@/lib/cn";

export interface BarItem {
  label: string;
  value: number | null;
  display: string;
}

export function BarCompare({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: BarItem[];
}) {
  const sorted = [...items].sort((a, b) => {
    if (a.value === b.value) return 0;
    if (a.value === null) return 1;
    if (b.value === null) return -1;
    return b.value - a.value;
  });
  const max = Math.max(0, ...items.map((i) => i.value ?? 0));

  return (
    <figure className="glass-panel rounded-panel p-4 sm:p-5">
      <figcaption>
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="mt-1 text-xs text-faint">{description}</p>}
      </figcaption>
      <ul className="mt-5 space-y-3.5">
        {sorted.map((item, i) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate">{item.label}</span>
              <span className="tabular-nums text-muted">{item.display}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn("h-full rounded-full", i === 0 && item.value !== null ? "bg-accent" : "bg-ink/50")}
                style={{ width: `${max > 0 && item.value !== null ? (item.value / max) * 100 : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}
