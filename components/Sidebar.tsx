"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/cn";

const NAV: ReadonlyArray<{ href: string; label: string; icon: IconName }> = [
  { href: "/", label: "Dashboard", icon: "overview" },
  { href: "/channels", label: "Channels", icon: "channels" },
  { href: "/ranking", label: "Rankings", icon: "ranking" },
  { href: "/analytics", label: "Analytics", icon: "analytics" },
  { href: "/uploads", label: "Uploads", icon: "uploads" },
];

function NavLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: IconName;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        active ? "bg-surface-2 font-medium text-ink" : "text-muted hover:bg-surface hover:text-ink"
      )}
    >
      {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />}
      <Icon name={icon} className={active ? "text-ink" : "text-faint"} />
      {label}
    </Link>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/channels") return pathname.startsWith("/channels") || pathname.startsWith("/channel/");
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col px-3 py-5">
      <div className="flex items-start justify-between px-3">
        <Link href="/" onClick={onClose} className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg border border-line-strong bg-surface">
            <span className="size-2.5 rounded-sm bg-accent" />
          </span>
          <span className="text-sm font-semibold leading-tight">
            YouTube Network
            <br />
            <span className="font-normal text-muted">Dashboard</span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-1 inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="close" className="size-5" />
          </button>
        )}
      </div>

      <nav aria-label="Primary" className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} onNavigate={onClose} />
        ))}
      </nav>

      <div className="mt-auto">
        <NavLink href="/settings" label="Settings" icon="settings" active={isActive("/settings")} onNavigate={onClose} />
        <p className="mt-4 px-3 text-xs leading-relaxed text-faint">
          Built on public YouTube data. Not affiliated with YouTube or Google.
        </p>
      </div>
    </div>
  );
}
