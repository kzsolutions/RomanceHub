import type { Metadata } from "next";
import { BellOff } from "lucide-react";
import { getNotifications } from "@/lib/data/library";
import { NotificationList } from "@/components/notifications/NotificationList";
import { EmptyState } from "@/components/stories/EmptyState";

export const metadata: Metadata = { title: "Notificações" };

export default async function NotificacoesPage() {
  const { items } = await getNotifications();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Notificações
        </p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">O que há de novo</h1>
      </div>

      {items.length > 0 ? (
        <NotificationList initialItems={items} />
      ) : (
        <EmptyState
          icon={BellOff}
          title="Sem notificações"
          description="Quando seguires histórias ou autores, as novidades aparecem aqui."
          action={{ label: "Explorar histórias", href: "/explorar" }}
        />
      )}
    </div>
  );
}
