import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Crown } from "lucide-react";
import { getStoryBySlug } from "@/lib/data/stories";
import { getPaymentInstructions } from "@/lib/data/payments";
import { createPaymentOrder } from "@/lib/actions/payments";
import { PaymentMethodInfo } from "@/components/payments/PaymentMethodInfo";
import { Button } from "@/components/ui/Button";
import { formatMT } from "@/lib/utils";
import { paymentErrorMessage } from "@/lib/payment-messages";

type Params = { slug: string };
type Search = { erro?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getStoryBySlug(slug);
  return { title: detail ? `Comprar ${detail.story.title}` : "Compra não encontrada" };
}

export default async function ComprarObraPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { erro } = await searchParams;
  const detail = await getStoryBySlug(slug);
  if (!detail) notFound();

  const { story, chapters } = detail;
  const instructions = await getPaymentInstructions();
  const errorMessage = paymentErrorMessage(erro);
  const firstChapter = chapters[0]?.number ?? 1;
  const backHref = `/historias/${story.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {story.title}
      </Link>

      <div className="mt-6 rounded-2xl border bg-surface p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
          <Crown className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wide">Obra completa</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{story.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Acesso permanente a todos os capítulos desta obra.
        </p>

        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        {detail.ownsStory ? (
          <div className="mt-6">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Já tens acesso a esta obra.
            </p>
            <Button href={`/ler/${story.slug}/${firstChapter}`} className="mt-4" size="lg">
              <BookOpen className="h-4 w-4" aria-hidden />
              Continuar a ler
            </Button>
          </div>
        ) : story.priceCents === null ? (
          <p className="mt-6 rounded-xl border border-dashed bg-surface-2 px-4 py-3 text-sm text-muted">
            O preço desta obra ainda não está definido. Tenta novamente mais tarde.
          </p>
        ) : (
          <>
            <div className="mt-5 flex items-baseline justify-between gap-4 border-y py-4">
              <span className="text-sm text-muted">Preço da obra completa</span>
              <span className="font-display text-2xl font-bold text-foreground">
                {formatMT(story.priceCents)}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {instructions.activeMethod ? (
                <PaymentMethodInfo
                  methodKey={instructions.activeMethod}
                  method={instructions[instructions.activeMethod]}
                />
              ) : (
                <p className="rounded-xl border border-dashed bg-surface-2 px-4 py-3 text-sm text-muted">
                  Os pagamentos estão temporariamente indisponíveis.
                </p>
              )}
            </div>

            {instructions.activeMethod && (
              <form action={createPaymentOrder} className="mt-6">
                <input type="hidden" name="story_id" value={story.id} />
                <input type="hidden" name="back" value={`/comprar/${story.slug}`} />
                <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
                  <Crown className="h-4 w-4" aria-hidden />
                  Criar pedido de compra
                </Button>
              </form>
            )}

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Ao criar o pedido recebes uma referência única. Faz a transferência com essa
              referência e submete o comprovativo. O acesso é liberado após confirmação da equipa.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
