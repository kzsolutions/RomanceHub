import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import type { ReaderChapterLink } from "@/lib/data/reader";
import { cn } from "@/lib/utils";

export function ChapterNav({
  storySlug,
  prevNumber,
  nextNumber,
}: {
  storySlug: string;
  prevNumber: number | null;
  nextNumber: number | null;
}) {
  return (
    <nav className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
      {prevNumber !== null ? (
        <Link
          href={`/ler/${storySlug}/${prevNumber}`}
          className="group flex items-center gap-2 rounded-xl px-3 py-2 -ml-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
        >
          <ChevronLeft className="h-4 w-4 text-muted transition-transform group-hover:-translate-x-0.5" aria-hidden />
          <span>
            <span className="block text-[11px] font-medium text-muted">Anterior</span>
            Capítulo {prevNumber}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {nextNumber !== null ? (
        <Link
          href={`/ler/${storySlug}/${nextNumber}`}
          className="group ml-auto flex items-center gap-2 rounded-xl px-3 py-2 -mr-3 text-right text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
        >
          <span>
            <span className="block text-[11px] font-medium text-muted">Seguinte</span>
            Capítulo {nextNumber}
          </span>
          <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function ChapterMenu({
  storySlug,
  currentNumber,
  chapters,
  className,
}: {
  storySlug: string;
  currentNumber: number;
  chapters: ReaderChapterLink[];
  className?: string;
}) {
  const current = chapters.find((c) => c.number === currentNumber);

  return (
    <details className={cn("group relative", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border bg-surface px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
        <List className="h-4 w-4 text-muted" aria-hidden />
        <span className="hidden sm:inline">Capítulo {currentNumber}</span>
        <span className="sm:hidden">Cap. {currentNumber}</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-90" aria-hidden />
      </summary>
      <div className="absolute right-0 z-50 mt-2 max-h-80 w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border bg-surface p-2 shadow-card">
        <p className="px-3 py-2 text-xs font-semibold text-muted">
          {current?.title ?? "Capítulos"}
        </p>
        <ul className="space-y-0.5">
          {chapters.map((c) => {
            const active = c.number === currentNumber;
            return (
              <li key={c.number}>
                <Link
                  href={`/ler/${storySlug}/${c.number}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                      : "text-foreground hover:bg-surface-2",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    <span className="tabular-nums text-muted">{c.number}.</span> {c.title}
                  </span>
                  {c.requiresAuth && (
                    <span className="shrink-0 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                      Conta
                    </span>
                  )}
                  {!c.requiresAuth && c.locked && (
                    <span className="shrink-0 text-gold-500">Premium</span>
                  )}
                  {!c.locked && c.isFree && (
                    <span className="shrink-0 text-[11px] font-semibold text-emerald-600">Grátis</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
