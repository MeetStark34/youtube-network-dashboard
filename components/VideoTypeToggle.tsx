"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { VideoTypeFilter } from "@/lib/types";

const OPTIONS: ReadonlyArray<{ value: VideoTypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "videos", label: "Videos" },
  { value: "shorts", label: "Shorts" },
];

export function VideoTypeToggle({
  value,
  onChange,
  label = "Video type",
}: {
  value: VideoTypeFilter;
  onChange: (value: VideoTypeFilter) => void;
  label?: string;
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % OPTIONS.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + OPTIONS.length) % OPTIONS.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = OPTIONS.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    buttonRefs.current[nextIndex]?.focus();
    onChange(OPTIONS[nextIndex].value);
  }

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border border-line bg-surface/85 p-1 shadow-glass backdrop-blur-glass">
      {OPTIONS.map((option, index) => (
        <button
          key={option.value}
          ref={(element) => { buttonRefs.current[index] = element; }}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          tabIndex={value === option.value ? 0 : -1}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cn(
            "min-h-10 rounded-lg px-3.5 text-sm transition-colors duration-200",
            value === option.value
              ? "bg-accent/15 font-semibold text-ink shadow-sm"
              : "text-muted hover:bg-surface-2 hover:text-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
