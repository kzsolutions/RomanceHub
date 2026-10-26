import { BookOpen, Check, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { readerPath } from "@/lib/access";

export function AuthGate({
  storySlug,
  storyTitle,
  authorName,
  coverUrl,
  synopsis,
  publishedCount,
  chapterNumber,
  firstReadableNumber,
}: {
  storySlug: string;
  storyTitle: string;
  authorName: string;
  coverUrl: string | null;
  synopsis: string;
  publishedCount: number;
  chapterNumber: number;
  firstReadableNumber: number | null;
}) {
  const backTo = readerPath(storySlug, chapterNumber);
  const redirect = encodeURIComponent(backTo);
  const registerHref = `/criar-conta?redirect=${redirect}`;
  const loginHref = `/entrar?redirect=${redirect}`;

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-transparent shadow-soft dark:border-brand-900/60 dark:from-brand-950/40">
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
                decoding="async"
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
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            <UserPlus className="h-3.5 w-3.5" aria-hidden />
            Leitura gratuita para membros
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{storyTitle}</h2>
          <p className="mt-1 text-sm text-muted">{authorName}</p>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{synopsis}</p>

          <p className="mt-4 rounded-xl border bg-surface/70 px-4 py-3 text-sm leading-relaxed text-foreground/90">
            O <span className="font-semibold">primeiro capítulo é livre</span>. Para continuares a
            ler os restantes {Math.max(0, publishedCount - 1)} capítulos, cria uma conta gratuita.
          </p>

          <ul className="mt-4 space-y-2 text-left text-sm text-muted">
            {[
              "Lê todos os capítulos sem custos durante o período promocional",
              "Guarda o teu progresso em qualquer dispositivo",
              "Recebe aviso quando saírem novos capítulos",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button href={registerHref} size="lg">
              <UserPlus className="h-4 w-4" aria-hidden />
              Criar conta grátis
            </Button>
            <Button href={loginHref} variant="outline" size="lg">
              Já tenho conta
            </Button>
            {firstReadableNumber !== null && firstReadableNumber !== chapterNumber && (
              <Button
                href={readerPath(storySlug, firstReadableNumber)}
                variant="ghost"
                size="lg"
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                Ler o capítulo {firstReadableNumber}
              </Button>
            )}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted/80 sm:justify-start">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Sem cartão de crédito. O cadastro demora menos de um minuto.
          </p>
        </div>
      </div>
    </div>
  );
}
