import { BookOpen, Crown, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createPaymentOrder } from "@/lib/actions/payments";
import { formatMT } from "@/lib/utils";

export function UnlockScreen({
  storyId,
  storySlug,
  storyTitle,
  authorName,
  coverUrl,
  synopsis,
  publishedCount,
  previewLimit,
  isAuthenticated,
  firstReadableNumber,
  nextNumber,
  storyPriceCents,
}: {
  storyId: string;
  storySlug: string;
  storyTitle: string;
  authorName: string;
  coverUrl: string | null;
  synopsis: string;
  publishedCount: number;
  previewLimit: number;
  isAuthenticated: boolean;
  firstReadableNumber: number | null;
  nextNumber: number | null;
  storyPriceCents: number | null;
}) {
  const loginHref = `/entrar?redirect=${encodeURIComponent(`/historias/${storySlug}`)}`;
  const canBuy = storyPriceCents !== null;

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gold-400/40 bg-gradient-to-b from-gold-300/10 to-transparent shadow-soft">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
        <div className="mx-auto w-36 shrink-0 sm:mx-0 sm:w-40">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2 shadow-card">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={`Capa de ${storyTitle}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-200 via-brand-300 to-brand-500 p-3 text-center">
                <span className="font-display text-base font-bold text-white drop-shadow">
                  {storyTitle}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-300">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Conteúdo premium
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{storyTitle}</h2>
          <p className="mt-1 text-sm text-muted">{authorName}</p>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{synopsis}</p>

          <dl className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:justify-start">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-muted" aria-hidden />
              <dt className="sr-only">Capítulos</dt>
              <dd className="text-muted">
                <span className="font-semibold text-foreground">{publishedCount}</span> capítulos
              </dd>
            </div>
            {previewLimit > 0 && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
                <dt className="sr-only">Prévia</dt>
                <dd className="text-muted">
                  <span className="font-semibold text-foreground">{previewLimit}</span> de leitura
                  gratuita
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 rounded-xl border border-gold-400/40 bg-gold-300/10 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Obra completa</span>
              <span className="font-display text-xl font-bold text-foreground">
                {formatMT(storyPriceCents)}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Acesso permanente a todos os {publishedCount} capítulos, incluindo os que forem
              publicados no futuro. Pagas uma única vez.
            </p>

            <div className="mt-4">
              {isAuthenticated ? (
                canBuy ? (
                  <form action={createPaymentOrder}>
                    <input type="hidden" name="story_id" value={storyId} />
                    <input type="hidden" name="back" value={`/ler/${storySlug}/${nextNumber ?? firstReadableNumber ?? 1}`} />
                    <Button type="submit" variant="gold" size="lg" className="w-full">
                      <Crown className="h-4 w-4" aria-hidden />
                      Desbloquear história completa
                    </Button>
                  </form>
                ) : (
                  <Button variant="gold" size="lg" className="w-full" disabled>
                    <Crown className="h-4 w-4" aria-hidden />
                    Preço a definir
                  </Button>
                )
              ) : (
                <Button href={loginHref} variant="gold" size="lg" className="w-full">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Iniciar sessão para desbloquear
                </Button>
              )}
            </div>

            {isAuthenticated && canBuy && (
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                Pagamento por e-Mola ou M-Pesa: crias um pedido com uma referência única, fazes a
                transferência e submetes o comprovativo. O acesso é liberado após confirmação da
                equipa.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {previewLimit > 0 && firstReadableNumber !== null && (
              <Button href={`/ler/${storySlug}/${firstReadableNumber}`} variant="outline" size="sm">
                Ler a prévia gratuita
              </Button>
            )}
            <Button href={`/historias/${storySlug}`} variant="ghost" size="sm">
              Ver detalhes da obra
            </Button>
          </div>

          <p className="mt-4 text-[11px] text-muted/80">
            Já desbloqueado noutra conta? Inicia sessão com essa conta para continuar a leitura.
          </p>
        </div>
      </div>
    </div>
  );
}
