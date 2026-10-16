export interface KpiItem {
  label: string;
  value: string;
  title?: string;
  note?: string;
}

export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <dl aria-label="Network summary" className="glass-panel dashboard-enter grid grid-cols-2 gap-px overflow-hidden rounded-panel sm:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-white/[0.015] px-3 py-2.5 sm:px-4" title={item.title}>
          <dt className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{item.label}</dt>
          <dd className="mt-1 truncate text-lg font-semibold leading-none tracking-tight tabular-nums text-ink sm:text-xl">
            {item.value}
          </dd>
          {item.note && <dd className="mt-1 truncate text-[10px] leading-4 text-faint">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
