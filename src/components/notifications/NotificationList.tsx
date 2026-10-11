"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookMarked,
  Check,
  CheckCheck,
  Loader2,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { NotificationItem } from "@/lib/data/library";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/library";
import { cn, formatDate } from "@/lib/utils";

const icons: Record<NotificationItem["type"], LucideIcon> = {
  system: Bell,
  chapter: BookMarked,
  comment: MessageCircle,
  promotion: Sparkles,
};

const labels: Record<NotificationItem["type"], string> = {
  system: "Sistema",
  chapter: "Capítulo novo",
  comment: "Comentário",
  promotion: "Promoção",
};

export function NotificationList({ initialItems }: { initialItems: NotificationItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const unread = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  function read(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    startTransition(async () => {
      await markNotificationRead(id);
      router.refresh();
    });
  }

  function readAll() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {unread > 0 ? `${unread} por ler` : "Estás em dia"}
        </p>
        {unread > 0 && (
          <button
            type="button"
            onClick={readAll}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <CheckCheck className="h-4 w-4" aria-hidden />
            )}
            Marcar todas como lidas
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((n) => {
          const Icon = icons[n.type];
          const content = (
            <div
              className={cn(
                "flex gap-4 rounded-2xl border p-4 transition-colors",
                n.isRead ? "bg-surface" : "border-brand-200 bg-brand-50/60 dark:border-brand-500/30 dark:bg-brand-500/10",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  n.isRead ? "bg-surface-2 text-muted" : "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {labels[n.type]}
                  </span>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-500" aria-label="Não lida" />}
                </div>
                <p className="mt-0.5 font-semibold text-foreground">{n.title}</p>
                {n.body && <p className="mt-1 text-sm text-muted">{n.body}</p>}
                <p className="mt-1.5 text-xs text-muted/80">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          );

          return (
            <li key={n.id}>
              {n.link ? (
                <Link href={n.link} onClick={() => !n.isRead && read(n.id)} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => read(n.id)}
                  disabled={pending}
                  className="mt-1 ml-14 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Marcar como lida
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
