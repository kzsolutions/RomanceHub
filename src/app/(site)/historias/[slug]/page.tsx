import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Crown,
  Layers,
  Lock,
  UserPlus,
} from "lucide-react";
import { getStoryBySlug } from "@/lib/data/stories";
import { getStoryCharacters } from "@/lib/data/characters";
import { getStorySocialState } from "@/lib/data/library";
import { SHOW_STORY_CHARACTERS } from "@/lib/features";
import { CharacterCard } from "@/components/stories/CharacterCard";
import { FavoriteButton } from "@/components/stories/FavoriteButton";
import { RatingWidget } from "@/components/stories/RatingWidget";
import { SectionHeading } from "@/components/stories/SectionHeading";
import { StarRating } from "@/components/stories/StarRating";
import { StoryGrid } from "@/components/stories/StoryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatMT, formatNumber } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getStoryBySlug(slug);
  if (!detail) return { title: "História não encontrada" };

  const { story } = detail;
  const coverAbsolute = story.coverUrl
    ? story.coverUrl.startsWith("http")
      ? story.coverUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${story.coverUrl}`
    : undefined;

  return {
    title: story.title,
    description: story.synopsis.slice(0, 160),
    openGraph: {
      title: story.title,
      description: story.synopsis.slice(0, 160),
      type: "article",
      images: coverAbsolute ? [{ url: coverAbsolute }] : undefined,
    },
  };
}

export default async function HistoriaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const detail = await getStoryBySlug(slug);
  if (!detail) notFound();

  const social = await getStorySocialState(detail.story.id);
  const characters = SHOW_STORY_CHARACTERS
    ? await getStoryCharacters(detail.story.id)
    : [];

  const { story, chapters, progress, related, authorBio, authorAvatar } = detail;
  const firstChapter = chapters[0]?.number ?? 1;
  const lastChapter = chapters[chapters.length - 1]?.number ?? firstChapter;

  let startNumber = firstChapter;
  let ctaLabel = chapters.length > 0 ? "Começar a ler" : "Em breve";
  if (!detail.isAuthenticated && chapters.length > 0) {
    startNumber = firstChapter;
    ctaLabel = "Ler o primeiro capítulo";
  }
  if (progress && chapters.length > 0) {
    if (progress.completed) {
      startNumber = firstChapter;
      ctaLabel = "Ler do princípio";
    } else {
      startNumber = Math.min(progress.chapterNumber + 1, lastChapter);
      ctaLabel = `Continuar no capítulo ${startNumber}`;
    }
  }

  const ctaLocked =
    chapters.find((c) => c.number === startNumber)?.locked ?? false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Início
        </Link>
        <span aria-hidden>/</span>
        {story.category ? (
          <>
            <Link
              href={`/categorias/${story.category.slug}`}
              className="transition-colors hover:text-foreground"
            >
              {story.category.name}
            </Link>
            <span aria-hidden>/</span>
          </>
        ) : (
          <>
            <Link href="/explorar" className="transition-colors hover:text-foreground">
              Explorar
            </Link>
            <span aria-hidden>/</span>
          </>
        )}
        <span className="truncate text-foreground">{story.title}</span>
      </nav>

      {/* Cabeçalho da história */}
      <section className="grid gap-8 border-b pb-10 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        <div className="mx-auto w-44 md:mx-0 md:w-full">
          <div className="aspect-[2/3] overflow-hidden rounded-2xl border bg-surface-2 shadow-card">
            {story.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.coverUrl}
                alt={`Capa de ${story.title}`}
                className="h-full w-full object-cover"
                decoding="async"
              />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {story.category && (
              <Link href={`/categorias/${story.category.slug}`}>
                <Badge variant="brand">{story.category.name}</Badge>
              </Link>
            )}
            {story.isFree ? (
              <Badge variant="free">Grátis</Badge>
            ) : (
              <Badge variant="premium" icon={Crown}>
                Premium
              </Badge>
            )}
            <Badge variant={story.completion === "complete" ? "complete" : "ongoing"}>
              {story.completion === "complete" ? "Concluída" : "Em curso"}
            </Badge>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {story.title}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            {authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatar}
                alt={story.authorName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                {story.authorName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold">{story.authorName}</p>
              {authorBio && (
                <p className="line-clamp-1 text-xs text-muted">{authorBio}</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <StarRating value={story.ratingAvg} count={story.ratingCount} />
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" aria-hidden />
              {formatNumber(story.readsCount)} leituras
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" aria-hidden />
              {chapters.length} {chapters.length === 1 ? "capítulo" : "capítulos"}
            </span>
            {story.publishedAt && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden />
                {formatDate(story.publishedAt)}
              </span>
            )}
          </div>

          <p className="mt-6 max-w-3xl leading-relaxed text-foreground/90">{story.synopsis}</p>

          {story.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/explorar?tag=${tag.slug}`}
                  className="rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {chapters.length > 0 && (
              <Button href={`/ler/${story.slug}/${startNumber}`} size="lg">
                {ctaLocked ? (
                  <Lock className="h-4 w-4" aria-hidden />
                ) : progress?.completed ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                ) : (
                  <BookOpen className="h-4 w-4" aria-hidden />
                )}
                {ctaLabel}
              </Button>
            )}
            {!story.isFree && !detail.ownsStory && story.priceCents !== null && (
              <Button href={`/comprar/${story.slug}`} variant="gold" size="lg">
                <Crown className="h-4 w-4" aria-hidden />
                Comprar obra · {formatMT(story.priceCents)}
              </Button>
            )}
            {!detail.isAuthenticated && chapters.length > 1 && (
              <Button
                href={`/criar-conta?redirect=${encodeURIComponent(
                  `/ler/${story.slug}/${chapters[1].number}`,
                )}`}
                variant="outline"
                size="lg"
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                Criar conta para continuar
              </Button>
            )}
            <FavoriteButton
              storyId={story.id}
              initialFavorite={social.isFavorite}
              isAuthenticated={detail.isAuthenticated}
            />
            {!detail.isAuthenticated && chapters.length > 1 && (
              <span className="text-xs text-muted">
                O primeiro capítulo é grátis. Cria conta para ler os restantes.
              </span>
            )}
            {ctaLocked && (
              <span className="text-xs text-muted">
                Capítulo premium — desbloqueia para continuar
              </span>
            )}
            {!story.isFree && !detail.ownsStory && detail.previewLimit > 0 && (
              <span className="text-xs text-muted">
                Os {detail.previewLimit} primeiros capítulos são uma prévia gratuita.
              </span>
            )}
            {progress && (
              <span className="text-xs text-muted">
                {progress.completed ? "História concluída" : `${progress.percent}% lido`}
              </span>
            )}
          </div>

          {progress && !progress.completed && (
            <div className="mt-4 h-1.5 max-w-md overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                style={{ width: `${Math.max(2, progress.percent)}%` }}
              />
            </div>
          )}

          <div className="mt-6 max-w-md">
            <RatingWidget
              storyId={story.id}
              initialRating={social.myRating}
              isAuthenticated={detail.isAuthenticated}
              ratingAvg={story.ratingAvg}
              ratingCount={story.ratingCount}
            />
          </div>
        </div>
      </section>

      {/* Personagens */}
      {SHOW_STORY_CHARACTERS && characters.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">Personagens</h2>
            <span className="text-sm text-muted">
              {characters.length} {characters.length === 1 ? "ficha" : "fichas"}
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      )}

      {/* Capítulos */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">Capítulos</h2>
          <span className="text-sm text-muted">{chapters.length} no total</span>
        </div>

        {chapters.length > 0 ? (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-surface shadow-soft">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/ler/${story.slug}/${chapter.number}`}
                  className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-2 sm:px-5"
                >
                  <span className="w-8 shrink-0 text-center font-display text-lg font-bold text-muted group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {chapter.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {chapter.title}
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 text-xs text-muted sm:flex">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    {formatNumber(chapter.readsCount)}
                  </span>
                  {!detail.isAuthenticated ? (
                    chapter.number <= 1 ? (
                      <Badge variant="free">Grátis</Badge>
                    ) : (
                      <Badge variant="brand" icon={Lock}>
                        Requer conta
                      </Badge>
                    )
                  ) : chapter.isFree || !chapter.locked ? (
                    chapter.isFree ? (
                      <Badge variant="free">Grátis</Badge>
                    ) : !story.isFree && chapter.number <= detail.previewLimit ? (
                      <Badge variant="brand">Prévia</Badge>
                    ) : (
                      <Badge variant="brand" icon={CheckCircle2}>
                        Desbloqueado
                      </Badge>
                    )
                  ) : (
                    <Badge variant="premium" icon={Lock}>
                      Premium
                    </Badge>
                  )}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed bg-surface px-6 py-10 text-center text-sm text-muted">
            Os capítulos desta história ainda estão a ser escritos.
          </p>
        )}
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading
            title="Poderás também gostar"
            href={story.category ? `/categorias/${story.category.slug}` : "/explorar"}
            cta={`Mais em ${story.category?.name ?? "romance"}`}
          />
          <StoryGrid stories={related} />
        </section>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/explorar"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar a explorar
        </Link>
      </div>
    </div>
  );
}
