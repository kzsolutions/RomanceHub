import type { LucideIcon } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-surface px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
      {action && (
        <Button href={action.href} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
