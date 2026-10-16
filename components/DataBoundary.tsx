"use client";

import type { ReactNode } from "react";
import { useNetwork } from "./DataProvider";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

/** Renders a skeleton while loading, an error state on failure, and children once data is ready. */
export function DataBoundary({
  skeleton,
  children,
}: {
  skeleton: ReactNode;
  children: ReactNode;
}) {
  const { status, error, refresh, refreshing, channels } = useNetwork();

  if (status === "loading") return <>{skeleton}</>;
  if (status === "error") return <ErrorState message={error} onRetry={refresh} retrying={refreshing} />;
  if (channels.length === 0) {
    return (
      <EmptyState
        icon="channels"
        title="No channels returned"
        description="The data service responded, but it did not include any channels. Check the channel list in your /api/youtube route."
      />
    );
  }
  return <>{children}</>;
}
