import { Crown, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatMT } from "@/lib/utils";

export function UnlockScreen({
  storySlug,
  storyTitle,
  chapterNumber,
  chapterTitle,
  isAuthenticated,
  firstFreeNumber,
  nextNumber,
  chapterPriceCents,
  storyPriceCents,
}: {
  storySlug: string;
  storyTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  isAuthenticated: boolean;
  firstFreeNumber: number | null;
  nextNumber: number | null;
  chapterPriceCents: number | null;
  storyPriceCents: number | null;
}) {
  const loginHref = `/entrar?redirect=${encodeURIComponent(`/ler/${storySlug}/${chapterNumber}`)}`;
  const canBuyChapter = chapterPriceCents !== null;
  const canBuyStory = storyPriceCents !== null;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gold-400/40 bg-gradient-to-b from-gold-300/10 to-transparent p-8 text-center shadow-soft sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/20 text-gold-600 dark:text-gold-300">
        <Lock className="h-6 w-6" aria-hidden />
      </span>

      <h2 className="mt-5 font-serif text-2xl font-bold text-foreground">
        Capítulo {chapterNumber} · {chapterTitle}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        Este capítulo de <strong className="font-semibold text-foreground">{storyTitle}</strong> faz
        parte do conteúdo premium. Desbloqueia-o individualmente ou com a leitura completa da obra.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isAuthenticated ? (
          canBuyChapter ? (
            <Button href={`/comprar/${storySlug}/${chapterNumber}`} variant="gold" size="lg">
              <Sparkles className="h-4 w-4" aria-hidden />
              Desbloquear capítulo · {formatMT(chapterPriceCents)}
            </Button>
          ) : canBuyStory ? (
            <Button href={`/comprar/${storySlug}`} variant="gold" size="lg">
              <Crown className="h-4 w-4" aria-hidden />
              Comprar obra · {formatMT(storyPriceCents)}
            </Button>
          ) : (
            <Button variant="gold" size="lg" disabled>
              <Sparkles className="h-4 w-4" aria-hidden />
              Preço a definir
            </Button>
          )
        ) : (
          <Button href={loginHref} variant="gold" size="lg">
            <Sparkles className="h-4 w-4" aria-hidden />
            Iniciar sessão para desbloquear
          </Button>
        )}
        {firstFreeNumber !== null && (
          <Button href={`/ler/${storySlug}/${firstFreeNumber}`} variant="outline" size="lg">
            Ler capítulos grátis
          </Button>
        )}
      </div>

      {isAuthenticated && canBuyChapter && canBuyStory && (
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted">
          Preferes a obra completa?{" "}
          <a
            href={`/comprar/${storySlug}`}
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            Comprar por {formatMT(storyPriceCents)}
          </a>
          .
        </p>
      )}

      {isAuthenticated && !canBuyChapter && !canBuyStory && (
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted">
          Este conteúdo ainda não está disponível para compra.
        </p>
      )}

      <div className="mt-6 flex items-center justify-center gap-4 border-t pt-5 text-xs text-muted">
        <Button href={`/historias/${storySlug}`} variant="ghost" size="sm">
          Ver detalhes da obra
        </Button>
        {nextNumber !== null && (
          <Button href={`/ler/${storySlug}/${nextNumber}`} variant="ghost" size="sm">
            Capítulo seguinte
          </Button>
        )}
      </div>

      <p className="mt-4 text-[11px] text-muted/80">
        Já desbloqueado noutra conta? Inicia sessão com essa conta para continuar a leitura.
      </p>
    </div>
  );
}
