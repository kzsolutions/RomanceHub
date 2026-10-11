import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { StoryStatus } from "@/lib/data/admin";

export const inputClass =
  "h-10 w-full rounded-xl border bg-surface px-3 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40";

export const textareaClass =
  "w-full rounded-xl border bg-surface px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40";

export const labelClass = "mb-1 block text-xs font-semibold text-muted";

export const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-50";

export const btnGhost =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border bg-surface px-4 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-50";

export const btnDanger =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border bg-surface p-5 shadow-soft", className)}>{children}</div>
  );
}

const statusVariant: Record<StoryStatus, Parameters<typeof Badge>[0]["variant"]> = {
  published: "free",
  draft: "default",
  pending: "premium",
  rejected: "default",
};

const statusLabel: Record<StoryStatus, string> = {
  published: "Publicada",
  draft: "Rascunho",
  pending: "Em revisão",
  rejected: "Rejeitada",
};

export function StatusBadge({ status }: { status: StoryStatus }) {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-surface shadow-soft">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-b px-4 py-3 align-middle", className)}>{children}</td>;
}
