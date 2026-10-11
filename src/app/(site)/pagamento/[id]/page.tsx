import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Copy, XCircle } from "lucide-react";
import { getPaymentOrder, getPaymentInstructions, orderContentLabel } from "@/lib/data/payments";
import { submitPaymentProof } from "@/lib/actions/payments";
import { PaymentMethodInfo } from "@/components/payments/PaymentMethodInfo";
import { Button } from "@/components/ui/Button";
import { formatMT, formatDate } from "@/lib/utils";
import { paymentErrorMessage } from "@/lib/payment-messages";

type Params = { id: string };
type Search = { erro?: string; enviado?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const order = await getPaymentOrder(id);
  return { title: order ? `Pedido ${order.reference ?? ""}` : "Pedido não encontrado" };
}

const STATUS_LABEL = {
  pending: "Aguarda confirmação",
  completed: "Concluído",
  refunded: "Reembolsado",
  failed: "Rejeitado",
} as const;

export default async function PagamentoPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { id } = await params;
  const { erro, enviado } = await searchParams;

  const order = await getPaymentOrder(id);
  if (!order) notFound();

  const instructions = await getPaymentInstructions();
  const errorMessage = paymentErrorMessage(erro);
  const contentLabel = orderContentLabel(order);

  const readHref =
    order.storySlug && order.kind === "chapter" && order.chapterNumber !== null
      ? `/ler/${order.storySlug}/${order.chapterNumber}`
      : order.storySlug
        ? `/ler/${order.storySlug}/1`
        : "/compras";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/compras"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        As minhas compras
      </Link>

      <div className="mt-6 rounded-2xl border bg-surface p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-muted">
              Pedido de pagamento
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold">{contentLabel}</h1>
          </div>
          <span
            className={
              order.status === "completed"
                ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : order.status === "failed"
                  ? "inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300"
                  : "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
            }
          >
            {order.status === "completed" ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            ) : order.status === "failed" ? (
              <XCircle className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Clock className="h-3.5 w-3.5" aria-hidden />
            )}
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-y py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Referência</p>
            <p className="flex items-center gap-2 font-mono text-lg font-bold tracking-wider text-foreground">
              {order.reference ?? "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Valor</p>
            <p className="font-display text-xl font-bold">{formatMT(order.priceCents)}</p>
          </div>
        </div>

        {enviado === "1" && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            Comprovativo submetido. Aguarda a confirmação da equipa.
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        {order.status === "completed" && (
          <div className="mt-6">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Pagamento confirmado — acesso liberado.
            </p>
            <Button href={readHref} className="mt-4" size="lg">
              <BookOpen className="h-4 w-4" aria-hidden />
              Começar a ler
            </Button>
          </div>
        )}

        {order.status === "failed" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted">
              Motivo indicado pela equipa:
              <span className="mt-1 block font-medium text-foreground">
                {order.rejectionReason ?? "Não especificado"}
              </span>
            </p>
            {order.storySlug && (
              <Button
                href={
                  order.kind === "chapter" && order.chapterNumber !== null
                    ? `/comprar/${order.storySlug}/${order.chapterNumber}`
                    : `/comprar/${order.storySlug}`
                }
                variant="outline"
              >
                Criar novo pedido
              </Button>
            )}
          </div>
        )}

        {order.status === "pending" && (
          <>
            {order.paymentRef ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                <p className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" aria-hidden />
                  Comprovativo em análise
                </p>
                <p className="mt-1">
                  Referência submetida: <span className="font-mono">{order.paymentRef}</span>
                </p>
                {order.paidAt && (
                  <p className="mt-0.5 text-xs opacity-80">
                    Submetido a {formatDate(order.paidAt, false)}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-3">
                  <p className="text-sm text-muted">
                    Faz a transferência de <strong>{formatMT(order.priceCents)}</strong> usando a
                    referência <strong>{order.reference}</strong>.
                  </p>
                  {instructions.activeMethod ? (
                    <PaymentMethodInfo
                      methodKey={instructions.activeMethod}
                      method={instructions[instructions.activeMethod]}
                    />
                  ) : (
                    <p className="rounded-xl border border-dashed bg-surface-2 px-4 py-3 text-sm text-muted">
                      Os pagamentos estão temporariamente indisponíveis. Contacta a equipa.
                    </p>
                  )}
                  {instructions.activeMethod &&
                    instructions[instructions.activeMethod].reader_guidance && (
                      <p className="whitespace-pre-line text-xs leading-relaxed text-muted">
                        {instructions[instructions.activeMethod].reader_guidance}
                      </p>
                    )}
                </div>

                <form action={submitPaymentProof} className="mt-6 space-y-4">
                  <input type="hidden" name="order_id" value={order.id} />
                  <div>
                    <label htmlFor="payment_ref" className="text-sm font-medium text-foreground">
                      Referência da transferência
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        id="payment_ref"
                        name="payment_ref"
                        required
                        placeholder="Ex.: 880123456"
                        className="h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none focus:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Número/referência gerada pela e-Mola ou M-Pesa no momento da transferência.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="proof" className="text-sm font-medium text-foreground">
                      Comprovativo (opcional)
                    </label>
                    <input
                      id="proof"
                      name="proof"
                      type="file"
                      accept="image/*,application/pdf"
                      className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
                    />
                    <p className="mt-1 text-xs text-muted">PDF ou imagem, até 5 MB.</p>
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Submeter comprovativo
                  </Button>
                </form>
              </>
            )}
          </>
        )}

        <div className="mt-6 flex items-center gap-2 border-t pt-4 text-xs text-muted">
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Guarda a referência e o comprovativo até o acesso ser confirmado.
        </div>
      </div>
    </div>
  );
}
