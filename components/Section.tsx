import type { ReactNode } from "react";

export function Section({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-section first:mt-0">
      <div className="mb-2.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5">
        <div>
          <h2 id={`${id}-title`} className="text-base font-semibold tracking-tight sm:text-lg">
            {title}
          </h2>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
