"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DataProvider } from "./DataProvider";
import { Icon } from "./Icon";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-surface-3 px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Suspense fallback={<aside aria-hidden="true" className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-bg lg:block" />}>
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line bg-bg/80 backdrop-blur-glass lg:block">
          <Sidebar />
        </aside>
      </Suspense>

      <Suspense fallback={<div aria-hidden="true" className="h-12 border-b border-line bg-bg lg:hidden" />}>
        <MobileNavigation />
      </Suspense>

      <main id="main" className="min-h-screen min-w-0 overflow-x-clip lg:pl-60">
        <div className="mx-auto min-w-0 max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      </main>
    </DataProvider>
  );
}

function MobileNavigation() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpenOn(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(
      dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
    );
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu, menuOpen]);

  return (
    <>
      <div className="sticky sticky-surface top-0 z-20 flex min-h-12 items-center gap-3 border-b border-line px-4 py-1.5 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setOpenOn(pathname)}
          className="-ml-2 inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <Icon name="menu" className="size-5" />
        </button>
        <span className="text-sm font-semibold">YouTube Network Dashboard</span>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/60"
          />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Navigation" tabIndex={-1} className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-line bg-bg/95 shadow-glass backdrop-blur-glass">
            <Sidebar onClose={closeMenu} />
          </div>
        </div>
      )}
    </>
  );
}
