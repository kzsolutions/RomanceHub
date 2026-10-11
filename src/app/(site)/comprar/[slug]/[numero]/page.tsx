import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { getStoryBySlug } from "@/lib/data/stories";
import { getPaymentInstructions, getPurchaseTarget } from "@/lib/data/payments";
import { createPaymentOrder } from "@/lib/actions/payments";
import { PaymentMethodInfo } from "@/components/payments/PaymentMethodInfo";
import { Button } from "@/components/ui/Button";
import { formatMT } from "@/lib/utils";
import { paymentErrorMessage } from "@/lib/payment-messages";

type Params = { slug: string; numero: string };
type Search = { erro?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, numero } = await params;
  const detail = await getStoryBySlug(slug);
  return {
    title: detail
      ? `Comprar capítulo ${numero} de ${detail.story.title}`
      : "Compra não encontrada",
  };
}

export default async function ComprarCapituloPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug, numero } = await params;
  const { erro } = await searchParams;

  const chapterNumber = Number.parseInt(numero, 10);
  if (!Number.isFinite(chapterNumber)) notFound();

  const [detail, target] = await Promise.all([
    getStoryBySlug(slug),
    getPurchaseTarget(slug, chapterNumber),
  ]);
  if (!detail || !target) notFound();

  const { story, chapters } = detail;
  const chapter = chapters.find((c) => c.number === chapterNumber);
  if (!chapter) notFound();

  const instructions = await getPaymentInstructions();
  const errorMessage = paymentErrorMessage(erro);
  const backHref = `/ler/${story.slug}/${chapterNumber}`;

  const chapterPriceCents = target.chapter?.priceCents ?? null;
  const storyPriceCents = target.story.priceCents;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar ao capítulo
      </Link>

      <div className="mt-6 rounded-2xl border bg-surface p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wide">Capítulo premium</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Capítulo {chapter.number} · {chapter.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{story.title}</p>

        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        {!chapter.locked ? (
          <div className="mt-6">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Já tens acesso a este capítulo.
            </p>
            <Button href={backHref} className="mt-4" size="lg">
              <BookOpen className="h-4 w-4" aria-hidden />
              Continuar a ler
            </Button>
          </div>
        ) : (
          <>
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col rounded-xl border bg-surface-2 p-5">
                <p className="text-sm font-semibold text-foreground">Apenas este capítulo</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {formatMT(chapterPriceCents)}
                </p>
                {chapterPriceCents === null ? (
                  <p className="mt-3 text-xs text-muted">Indisponível para compra individual.</p>
                ) : (
                  <form action={createPaymentOrder} className="mt-auto pt-4">
                    <input type="hidden" name="story_id" value={story.id} />
                    <input type="hidden" name="chapter_id" value={target.chapter?.id ?? ""} />
                    <input type="hidden" name="back" value={`/comprar/${story.slug}/${chapterNumber}`} />
                    <Button type="submit" variant="gold" className="w-full">
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Desbloquear capítulo
                    </Button>
                  </form>
                )}
              </div>

              <div className="flex flex-col rounded-xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-800/50 dark:bg-brand-950/20">
                <p className="text-sm font-semibold text-foreground">Obra completa</p>
                <p className="mt-1 font-display text-2xl font-bold">{formatMT(storyPriceCents)}</p>
                <p className="mt-1 text-xs text-muted">Todos os capítulos, acesso permanente.</p>
                {storyPriceCents === null ? (
                  <p className="mt-3 text-xs text-muted">Indisponível para compra.</p>
                ) : (
                  <form action={createPaymentOrder} className="mt-auto pt-4">
                    <input type="hidden" name="story_id" value={story.id} />
                    <input type="hidden" name="back" value={`/comprar/${story.slug}/${chapterNumber}`} />
                    <Button type="submit" className="w-full">
                      <Crown className="h-4 w-4" aria-hidden />
                      Comprar obra
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {instructions.activeMethod && (
              <p className="mt-5 text-xs leading-relaxed text-muted">
                Ao criar o pedido recebes uma referência única. Faz a transferência com essa
                referência e submete o comprovativo. O acesso é liberado após confirmação da equipa.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
