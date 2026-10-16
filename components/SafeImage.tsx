"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}

/** Image with a graceful placeholder for missing or broken thumbnails. */
export function SafeImage({ src, alt, className, style, fallback }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        style={style}
        className={cn("flex items-center justify-center bg-surface-3 text-faint", className)}
      >
        {fallback ?? <Icon name="play" className="size-6 opacity-60" />}
      </div>
    );
  }

  return (
    // Plain <img> on purpose: avoids configuring remote image domains in next.config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      style={style}
      className={cn("object-cover", className)}
    />
  );
}
