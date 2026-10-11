import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, XCircle } from "lucide-react";
import {
  getAdminPaymentOrder,
  getPaymentInstructions,
  getProofSignedUrl,
  orderContentLabel,
} from "@/lib/data/payments";
import { approvePaymentOrder, rejectPaymentOrder } from "@/lib/actions/payments";
import { PaymentMethodInfo } from "@/components/payments/PaymentMethodInfo";
import { Card, labelClass, textareaClass, btnPrimary } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import { formatMT, formatDate } from "@/lib/utils";
import { paymentErrorMessage } from "@/lib/payment-messages";

export const metadata: Metadata = { title: "Pedido de pagamento · Admin" };

const STATUS_LABEL = {
  pending: "Por confirmar",
  completed: "Confirmado",
  refunded: "Reembolsado",
  failed: "Rejeitado",
} as const;

export default async function AdminPaymentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [order, instructions] = await Promise.all([
    getAdminPaymentOrder(id),
    getPaymentInstructions(),
  ]);
  if (!order) notFound();

  const proofUrl = await getProofSignedUrl(order.proofPath);
  const errorMessage = paymentErrorMessage(erro);
  const contentLabel = orderContentLabel(order);
  const activeMethod = instructions.activeMethod;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/pagamentos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Pagamentos
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{contentLabel}</h1>
          <p className="mt-1 text-sm text-muted">
            Pedido de <strong>{order.userName}</strong> · {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge
          variant={
            order.status === "completed"
              ? "complete"
              : order.status === "failed"
                ? "premium"
                : order.status === "refunded"
                  ? "default"
                  : "ongoing"
          }
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </div>

      {errorMessage && (
        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      <Card className="mb-5">
        <h2 className="mb-4 font-display text-lg font-bold">Detalhes do pedido</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Referência</dt>
            <dd className="font-mono font-semibold">{order.reference ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Valor</dt>
            <dd className="font-semibold">{formatMT(order.priceCents)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Tipo</dt>
            <dd>{order.kind === "story" ? "Obra completa" : "Capítulo"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Método</dt>
            <dd className="capitalize">{order.paymentMethod}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Referência da transferência
            </dt>
            <dd className="font-mono">{order.paymentRef ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Submetido</dt>
            <dd>{order.paidAt ? formatDate(order.paidAt) : "—"}</dd>
          </div>
        </dl>

        {order.rejectionReason && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            Motivo da rejeição anterior: {order.rejectionReason}
          </p>
        )}

        <div className="mt-5 border-t pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Comprovativo
          </p>
          {proofUrl ? (
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Abrir comprovativo
            </a>
          ) : (
            <p className="text-sm text-muted">Sem comprovativo anexado.</p>
          )}
        </div>
      </Card>

      {activeMethod && (
        <Card className="mb-5">
          <h2 className="mb-3 font-display text-lg font-bold">Dados de pagamento configurados</h2>
          <PaymentMethodInfo methodKey={activeMethod} method={instructions[activeMethod]} />
        </Card>
      )}

      {order.status === "pending" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h2 className="mb-1 font-display text-lg font-bold text-emerald-700 dark:text-emerald-400">
              Confirmar pagamento
            </h2>
            <p className="mb-4 text-sm text-muted">
              Libera o acesso imediatamente após confirmares que recebeste a transferência.
            </p>
            <form action={approvePaymentOrder}>
              <input type="hidden" name="order_id" value={order.id} />
              <button type="submit" className={btnPrimary}>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Confirmar e liberar acesso
              </button>
            </form>
          </Card>

          <Card className="border-red-200 dark:border-red-500/30">
            <h2 className="mb-1 font-display text-lg font-bold text-red-700 dark:text-red-400">
              Rejeitar pedido
            </h2>
            <p className="mb-4 text-sm text-muted">
              O leitor verá o motivo indicado e poderá criar um novo pedido.
            </p>
            <form action={rejectPaymentOrder} className="space-y-3">
              <input type="hidden" name="order_id" value={order.id} />
              <div>
                <label className={labelClass} htmlFor="reason">
                  Motivo *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={2}
                  placeholder="Ex.: Transferência não localizada / valor incorreto"
                  className={textareaClass}
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400"
              >
                <XCircle className="h-4 w-4" aria-hidden />
                Rejeitar
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
