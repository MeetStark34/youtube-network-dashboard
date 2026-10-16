import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-surface-3", className)} />;
}

function Busy({ children, label = "Loading data" }: { children: React.ReactNode; label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}

export function ChannelGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="mt-5 aspect-video w-full" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function UploadListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-surface">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="aspect-video w-32 sm:w-40" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-line bg-surface">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-line p-4 last:border-b-0">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <Busy>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-2 bg-surface/70 px-3 py-3 sm:px-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="mb-3 mt-section h-5 w-36" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-panel border border-line bg-surface/70 p-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="my-3 h-10" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="mt-2 h-16" />
          </div>
        ))}
      </div>
      <Skeleton className="mb-3 mt-section h-5 w-48" />
      <div className="mb-3 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-10 w-20 rounded-xl" />)}
      </div>
      <TableSkeleton rows={4} />
    </Busy>
  );
}

export function TablePageSkeleton() {
  return (
    <Busy>
      <TableSkeleton />
    </Busy>
  );
}

export function ListPageSkeleton() {
  return (
    <Busy>
      <UploadListSkeleton rows={5} />
    </Busy>
  );
}

export function ChannelDetailSkeleton() {
  return (
    <Busy>
      <div className="flex items-center gap-5">
        <Skeleton className="size-20 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <Skeleton className="mt-10 aspect-[21/9] w-full rounded-xl" />
      <div className="mt-10">
        <TableSkeleton rows={6} />
      </div>
    </Busy>
  );
}
