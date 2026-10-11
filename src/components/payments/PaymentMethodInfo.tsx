import { Info, Smartphone } from "lucide-react";
import type { PaymentMethodConfig } from "@/lib/data/payments";

const METHOD_LABELS: Record<string, string> = {
  emola: "e-Mola",
  mpesa: "M-Pesa",
};

export function PaymentMethodInfo({
  methodKey,
  method,
}: {
  methodKey: "emola" | "mpesa";
  method: PaymentMethodConfig;
}) {
  const label = METHOD_LABELS[methodKey] ?? methodKey;

  if (!method.number && !method.instructions) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-dashed bg-surface px-4 py-3 text-sm text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          As instruções de pagamento ({label}) ainda não foram configuradas. Tenta novamente mais
          tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-surface px-4 py-4 text-sm shadow-soft">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Smartphone className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
        {label}
      </div>
      <dl className="mt-3 space-y-2">
        {method.number && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Número</dt>
            <dd className="font-mono font-semibold tracking-wide text-foreground">
              {method.number}
            </dd>
          </div>
        )}
        {method.holder && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Titular</dt>
            <dd className="font-semibold text-foreground">{method.holder}</dd>
          </div>
        )}
        {method.instructions && (
          <div className="pt-1">
            <dt className="sr-only">Instruções</dt>
            <dd className="whitespace-pre-line leading-relaxed text-muted">
              {method.instructions}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
