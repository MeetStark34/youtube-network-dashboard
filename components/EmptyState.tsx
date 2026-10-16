import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass-panel flex flex-col items-center rounded-panel border-dashed px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full border border-line text-faint">
        <Icon name={icon} className="size-5" />
      </span>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
