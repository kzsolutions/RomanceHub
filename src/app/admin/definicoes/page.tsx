import type { Metadata } from "next";
import { Save, Smartphone } from "lucide-react";
import { getAdminSettings } from "@/lib/data/admin";
import { getPaymentInstructions, type PaymentMethodConfig } from "@/lib/data/payments";
import { Card, textareaClass, inputClass, labelClass, btnPrimary } from "@/components/admin/ui";
import { updateSetting } from "@/lib/actions/admin";
import { updatePaymentInstructions } from "@/lib/actions/payments";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Definições · Admin" };

function toEditable(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function MethodFields({ methodKey, method, title }: { methodKey: string; method: PaymentMethodConfig; title: string }) {
  return (
    <div className="rounded-xl border bg-surface-2/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <Smartphone className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
          {title}
        </h3>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name={`${methodKey}_active`}
            defaultChecked={method.active}
            className="h-4 w-4 accent-brand-600"
          />
          Ativo
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`${methodKey}_number`}>
            Número
          </label>
          <input
            id={`${methodKey}_number`}
            name={`${methodKey}_number`}
            defaultValue={method.number}
            placeholder="Ex.: 84 000 0000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${methodKey}_holder`}>
            Titular
          </label>
          <input
            id={`${methodKey}_holder`}
            name={`${methodKey}_holder`}
            defaultValue={method.holder}
            placeholder="Nome do titular da conta"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor={`${methodKey}_instructions`}>
            Instruções
          </label>
          <textarea
            id={`${methodKey}_instructions`}
            name={`${methodKey}_instructions`}
            rows={2}
            defaultValue={method.instructions}
            placeholder="Passos para o leitor fazer a transferência"
            className={textareaClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor={`${methodKey}_reader_guidance`}>
            Texto de apoio ao leitor
          </label>
          <textarea
            id={`${methodKey}_reader_guidance`}
            name={`${methodKey}_reader_guidance`}
            rows={2}
            defaultValue={method.reader_guidance}
            placeholder="Mensagem adicional mostrada no checkout (opcional)"
            className={textareaClass}
          />
        </div>
      </div>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const [settings, instructions] = await Promise.all([
    getAdminSettings(),
    getPaymentInstructions(),
  ]);
  const otherSettings = settings.filter((s) => s.key !== "payment.instructions");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Definições</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Parâmetros globais da plataforma. Os valores são guardados em JSON.
      </p>

      <Card className="mb-6">
        <h2 className="font-display text-lg font-bold">Pagamentos (e-Mola / M-Pesa)</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Dados mostrados aos leitores no checkout. Deixa em branco o que não usares. Só os métodos
          marcados como ativos aparecem para compra.
        </p>
        <form action={updatePaymentInstructions} className="space-y-4">
          <MethodFields methodKey="emola" method={instructions.emola} title="e-Mola" />
          <MethodFields methodKey="mpesa" method={instructions.mpesa} title="M-Pesa" />
          <button type="submit" className={btnPrimary}>
            <Save className="h-4 w-4" aria-hidden />
            Guardar pagamentos
          </button>
        </form>
      </Card>

      {otherSettings.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {otherSettings.map((s) => (
            <Card key={s.key}>
              <form action={updateSetting}>
                <input type="hidden" name="key" value={s.key} />
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-mono text-sm font-bold">{s.key}</h2>
                  <span className="text-[11px] text-muted">{formatDate(s.updated_at)}</span>
                </div>
                {s.description && <p className="mt-1 text-xs text-muted">{s.description}</p>}
                <textarea
                  name="value"
                  rows={3}
                  defaultValue={toEditable(s.value)}
                  className={`${textareaClass} mt-3 font-mono text-[13px]`}
                />
                <button type="submit" className={`${btnPrimary} mt-3`}>
                  <Save className="h-4 w-4" aria-hidden />
                  Guardar
                </button>
              </form>
            </Card>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed bg-surface px-6 py-10 text-center text-sm text-muted">
          Não existem outras definições configuradas.
        </p>
      )}
    </div>
  );
}
