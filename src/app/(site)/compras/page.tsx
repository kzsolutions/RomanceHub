import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Receipt, ShoppingBag, XCircle } from "lucide-react";
import { getMyPaymentOrders, orderContentLabel } from "@/lib/data/payments";
import { EmptyState } from "@/components/stories/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatMT, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "As minhas compras" };

const STATUS_META = {
  pending: { label: "Aguarda confirmação", variant: "ongoing" as const, icon: Clock },
  completed: { label: "Concluído", variant: "complete" as const, icon: CheckCircle2 },
  refunded: { label: "Reembolsado", variant: "default" as const, icon: Receipt },
  failed: { label: "Rejeitado", variant: "premium" as const, icon: XCircle },
};

export default async function ComprasPage() {
  const orders = await getMyPaymentOrders();

  const pending = orders.filter((o) => o.status === "pending").length;
  const completed = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Compras
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">As minhas compras</h1>
        </div>
        <Button href="/explorar" variant="outline">
          <ShoppingBag className="h-4 w-4" aria-hidden />
          Explorar histórias
        </Button>
      </div>

      {orders.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-surface p-4 shadow-soft sm:p-5">
            <p className="font-display text-2xl font-bold tabular-nums">{orders.length}</p>
            <p className="text-xs text-muted">Pedidos no total</p>
          </div>
          <div className="rounded-2xl border bg-surface p-4 shadow-soft sm:p-5">
            <p className="font-display text-2xl font-bold tabular-nums">{pending}</p>
            <p className="text-xs text-muted">A aguardar</p>
          </div>
          <div className="rounded-2xl border bg-surface p-4 shadow-soft sm:p-5">
            <p className="font-display text-2xl font-bold tabular-nums">{completed}</p>
            <p className="text-xs text-muted">Concluídos</p>
          </div>
        </div>
      )}

      <section className="mt-10">
        {orders.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Ainda não tens compras"
            description="Quando desbloqueares um capítulo ou uma obra premium, os teus pedidos aparecem aqui."
            action={{ label: "Explorar histórias", href: "/explorar" }}
          />
        ) : (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-surface shadow-soft">
            {orders.map((order) => {
              const meta = STATUS_META[order.status];
              const Icon = meta.icon;
              return (
                <li key={order.id}>
                  <Link
                    href={`/pagamento/${order.id}`}
                    className="flex flex-wrap items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-semibold">{orderContentLabel(order)}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <span className="font-mono">{order.reference ?? "—"}</span>
                        <span>{order.kind === "story" ? "Obra completa" : "Capítulo"}</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      {order.status === "failed" && order.rejectionReason && (
                        <p className="mt-1 line-clamp-1 text-xs text-red-600 dark:text-red-400">
                          {order.rejectionReason}
                        </p>
                      )}
                    </div>
                    <span className="font-display text-lg font-bold tabular-nums">
                      {formatMT(order.priceCents)}
                    </span>
                    <Badge variant={meta.variant} icon={Icon}>
                      {meta.label}
                    </Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
