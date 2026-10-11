import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PAGE_SIZE } from "@/lib/data/admin";
import { getAdminPaymentOrders, orderContentLabel } from "@/lib/data/payments";
import type { PurchaseStatus } from "@/lib/data/payments";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/stories/Pagination";
import { TableWrap, Td, Th } from "@/components/admin/ui";
import { cn, firstParam, formatMT, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Pagamentos · Admin" };

const TABS: { value: PurchaseStatus | "all"; label: string }[] = [
  { value: "pending", label: "Por confirmar" },
  { value: "completed", label: "Confirmados" },
  { value: "failed", label: "Rejeitados" },
  { value: "all", label: "Todos" },
];

const STATUS: Record<PurchaseStatus, { label: string; variant: "ongoing" | "complete" | "premium" | "default" }> = {
  pending: { label: "Por confirmar", variant: "ongoing" },
  completed: { label: "Confirmado", variant: "complete" },
  refunded: { label: "Reembolsado", variant: "default" },
  failed: { label: "Rejeitado", variant: "premium" },
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const estado = (firstParam(sp.estado) ?? "pending") as PurchaseStatus | "all";
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);

  const { items, total } = await getAdminPaymentOrders({ status: estado, page });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Pagamentos</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Verifica manualmente as transferências e-Mola/M-Pesa e confirma o acesso. {total}{" "}
        {total === 1 ? "pedido" : "pedidos"} nesta vista.
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = estado === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/admin/pagamentos?estado=${tab.value}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300"
                  : "bg-surface text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {items.length > 0 ? (
        <TableWrap>
          <thead>
            <tr>
              <Th>Data</Th>
              <Th>Leitor</Th>
              <Th>Conteúdo</Th>
              <Th>Valor</Th>
              <Th>Referência</Th>
              <Th>Estado</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => {
              const meta = STATUS[o.status];
              return (
                <tr key={o.id} className="hover:bg-surface-2/60">
                  <Td className="whitespace-nowrap text-xs text-muted">{formatDate(o.createdAt)}</Td>
                  <Td className="font-medium">{o.userName}</Td>
                  <Td className="text-muted">{orderContentLabel(o)}</Td>
                  <Td className="whitespace-nowrap font-semibold tabular-nums">
                    {formatMT(o.priceCents)}
                  </Td>
                  <Td className="font-mono text-xs text-muted">
                    {o.reference ?? "—"}
                    {o.paymentRef && <span className="block text-[11px]">Transf.: {o.paymentRef}</span>}
                  </Td>
                  <Td>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/pagamentos/${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        Rever
                      </Link>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      ) : (
        <p className="rounded-2xl border border-dashed bg-surface px-6 py-12 text-center text-sm text-muted">
          Não há pedidos nesta vista.
        </p>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/pagamentos" params={sp} />
    </div>
  );
}
