"use client";

import { useNetwork } from "./DataProvider";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

export function TopHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { status, error, updatedAt, refreshing, refresh } = useNetwork();

  let dot = "bg-faint";
  let label = "Loading data";
  if (status === "ready" && !error) {
    dot = "bg-good";
    label = "Live data";
  } else if (status === "ready") {
    dot = "bg-warn";
    label = "Update failed, showing last data";
  } else if (status === "error") {
    dot = "bg-accent";
    label = "Data unavailable";
  }

  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2.5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <p
          role="status"
          title={error && status === "ready" ? `Last refresh failed: ${error}` : updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : undefined}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface/60 px-3 text-xs text-muted sm:text-sm"
        >
          <span aria-hidden="true" className={cn("size-2 rounded-full", dot)} />
          {label}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex min-h-10 items-center gap-2 rounded-control border border-line bg-surface/80 px-3 text-sm transition-colors duration-200 hover:bg-surface-2 disabled:cursor-wait disabled:opacity-60"
        >
          <Icon name="refresh" className={cn(refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>
    </header>
  );
}
