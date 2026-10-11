import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3, Heart, Library, Sparkles } from "lucide-react";
import { getLibrary } from "@/lib/data/library";
import { StoryGrid } from "@/components/stories/StoryCard";
import { EmptyState } from "@/components/stories/EmptyState";
import { SectionHeading } from "@/components/stories/SectionHeading";
import { RemoveFromLibraryButton } from "@/components/library/RemoveFromLibraryButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "A minha biblioteca" };

export default async function BibliotecaPage() {
  const { continueReading, history, favorites, stats } = await getLibrary();

  const statCards = [
    { label: "A ler", value: stats.reading, icon: BookOpen },
    { label: "Concluídas", value: stats.completed, icon: CheckCircle2 },
    { label: "Favoritas", value: stats.favorites, icon: Heart },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            A minha biblioteca
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Continua de onde paraste</h1>
        </div>
        <Button href="/explorar" variant="outline">
          <Sparkles className="h-4 w-4" aria-hidden />
          Descobrir histórias
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-surface p-4 shadow-soft sm:p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <s.icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3 font-display text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <SectionHeading title="A ler" />
        {continueReading.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {continueReading.map((entry) => (
              <li
                key={entry.story.id}
                className="flex gap-4 rounded-2xl border bg-surface p-4 shadow-soft"
              >
                <Link
                  href={`/historias/${entry.story.slug}`}
                  className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2"
                >
                  {entry.story.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.story.coverUrl}
                      alt={`Capa de ${entry.story.title}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/historias/${entry.story.slug}`} className="min-w-0">
                      <h3 className="line-clamp-2 font-display font-semibold leading-snug hover:text-brand-700 dark:hover:text-brand-400">
                        {entry.story.title}
                      </h3>
                    </Link>
                    <RemoveFromLibraryButton storyId={entry.story.id} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{entry.story.authorName}</p>
                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Capítulo {entry.chapterNumber}</span>
                      <span className="tabular-nums">{entry.percent}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                        style={{ width: `${Math.max(3, entry.percent)}%` }}
                      />
                    </div>
                    <Button
                      href={`/ler/${entry.story.slug}/${entry.chapterNumber}`}
                      size="sm"
                      className="mt-3"
                    >
                      <BookOpen className="h-4 w-4" aria-hidden />
                      Continuar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Library}
            title="Ainda não começaste nenhuma história"
            description="Explora o catálogo e começa a tua primeira leitura. O teu progresso aparece aqui."
            action={{ label: "Explorar histórias", href: "/explorar" }}
          />
        )}
      </section>

      <section className="mt-14">
        <SectionHeading title="Favoritos" href="/favoritos" />
        {favorites.length > 0 ? (
          <StoryGrid stories={favorites.slice(0, 6).map((f) => f.story)} />
        ) : (
          <p className="rounded-2xl border border-dashed bg-surface px-6 py-8 text-center text-sm text-muted">
            Ainda não tens favoritos. Toca no coração numa história para a guardares aqui.
          </p>
        )}
      </section>

      <section className="mt-14">
        <SectionHeading title="Histórico de leitura" />
        {history.length > 0 ? (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-surface shadow-soft">
            {history.map((entry) => (
              <li key={entry.story.id}>
                <Link
                  href={`/historias/${entry.story.slug}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-2 sm:px-5"
                >
                  <span className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {entry.story.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.story.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold">{entry.story.title}</p>
                    <p className="text-xs text-muted">
                      {entry.story.authorName} · Capítulo {entry.chapterNumber}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
                    {entry.completed ? (
                      <Badge variant="complete" icon={CheckCircle2}>
                        Concluída
                      </Badge>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden />
                        {formatDate(entry.lastReadAt)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed bg-surface px-6 py-8 text-center text-sm text-muted">
            O teu histórico aparecerá aqui assim que comeces a ler.
          </p>
        )}
      </section>
    </div>
  );
}
