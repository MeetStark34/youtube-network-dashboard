"use client";

import { Icon } from "./Icon";

export function ErrorState({
  message,
  onRetry,
  retrying,
}: {
  message: string | null;
  onRetry: () => void;
  retrying?: boolean;
}) {
  return (
    <div
      role="alert"
      className="glass-panel flex flex-col items-center rounded-panel border-accent/25 bg-accent/[0.035] px-6 py-10 text-center"
    >
      <span className="flex size-10 items-center justify-center rounded-full border border-accent/40 text-accent">
        <Icon name="alert" className="size-5" />
      </span>
      <h3 className="mt-4 text-base font-medium">Channel data could not be loaded</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted">
        {message ?? "The request to /api/youtube failed."} Check that the dev server is running and
        the YouTube API key is set in .env.local, then try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-60"
      >
        <Icon name="refresh" className={retrying ? "animate-spin" : undefined} />
        Try again
      </button>
    </div>
  );
}
