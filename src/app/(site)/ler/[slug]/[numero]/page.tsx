import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Eye, Feather } from "lucide-react";
import { getReaderChapter } from "@/lib/data/reader";
import { ChapterMenu, ChapterNav } from "@/components/reader/ChapterNav";
import { Reader } from "@/components/reader/Reader";
import { UnlockScreen } from "@/components/reader/UnlockScreen";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string; numero: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, numero } = await params;
  const number = Number.parseInt(numero, 10);
  if (!Number.isFinite(number)) return { title: "Capítulo não encontrado" };

  const data = await getReaderChapter(slug, number);
  if (!data) return { title: "Capítulo não encontrado" };

  const title = `${data.chapter.title} · ${data.story.title}`;
  return {
    title,
    robots: data.locked ? { index: false } : undefined,
    openGraph: { title, type: "article" },
  };
}

export default async function ReaderPage({ params }: PageProps) {
  const { slug, numero } = await params;
  const number = Number.parseInt(numero, 10);
  if (!Number.isFinite(number) || number < 1) notFound();

  const data = await getReaderChapter(slug, number);
  if (!data) notFound();

  const { story, chapter, chapters, content, locked } = data;
  const firstReadableNumber = chapters.length > 0 ? chapters[0].number : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 pb-20 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/historias/${story.slug}`}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          {story.title}
        </Link>
        <ChapterMenu storySlug={story.slug} currentNumber={chapter.number} chapters={chapters} />
      </div>

      <header className="mx-auto mt-8 max-w-2xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-serif text-sm font-semibold text-brand-600 dark:text-brand-400">
            Capítulo {chapter.number}
          </span>
          {locked ? (
            <Badge variant="premium">Premium</Badge>
          ) : chapter.isFree || story.isFree ? (
            <Badge variant="free">Grátis</Badge>
          ) : chapter.number <= story.previewLimit ? (
            <Badge variant="brand">Prévia</Badge>
          ) : (
            <Badge variant="brand">Desbloqueado</Badge>
          )}
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {chapter.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Feather className="h-3.5 w-3.5" aria-hidden />
            {story.authorName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {formatNumber(chapter.readsCount)} leituras
          </span>
          {chapter.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {formatDate(chapter.publishedAt)}
            </span>
          )}
        </div>
      </header>

      <div className="mt-10">
        {locked ? (
          <UnlockScreen
            storyId={story.id}
            storySlug={story.slug}
            storyTitle={story.title}
            authorName={story.authorName}
            coverUrl={story.coverUrl}
            synopsis={story.synopsis}
            publishedCount={story.publishedCount}
            previewLimit={story.previewLimit}
            isAuthenticated={data.isAuthenticated}
            firstReadableNumber={firstReadableNumber}
            nextNumber={data.nextNumber}
            storyPriceCents={story.priceCents}
          />
        ) : content ? (
          <Reader
            storyId={story.id}
            chapterId={chapter.id}
            chapterNumber={chapter.number}
            content={content}
            initiallyCompleted={data.progress?.percent === 100}
          />
        ) : (
          <p className="mx-auto max-w-2xl text-center text-muted italic">
            Este capítulo ainda não tem conteúdo publicado.
          </p>
        )}
      </div>

      <div className="mx-auto max-w-2xl">
        <ChapterNav
          storySlug={story.slug}
          prevNumber={data.prevNumber}
          nextNumber={data.nextNumber}
        />
      </div>
    </div>
  );
}
