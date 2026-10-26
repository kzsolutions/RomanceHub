import Link from "next/link";
import { BookOpen, Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, formatNumber, formatRating } from "@/lib/utils";
import type { StoryCard as StoryCardData } from "@/lib/data/stories";

export function StoryCard({
  story,
  eager = false,
}: {
  story: StoryCardData;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/historias/${story.slug}`}
      prefetch
      className="group flex flex-col rounded-2xl border bg-surface p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2">
        {story.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.coverUrl}
            alt={`Capa de ${story.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-200 via-brand-300 to-brand-500 p-4 text-center">
            <span className="font-display text-lg font-bold text-white drop-shadow">{story.title}</span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          {story.isFree ? (
            <Badge variant="free">Grátis</Badge>
          ) : (
            <Badge variant="premium" icon={Crown}>
              Premium
            </Badge>
          )}
        </div>
        <div className="absolute right-2 top-2">
          <Badge variant={story.completion === "complete" ? "complete" : "ongoing"}>
            {story.completion === "complete" ? "Concluída" : "Em curso"}
          </Badge>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
          {story.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{story.authorName}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-hidden />
            <span className="font-semibold text-foreground/80">{formatRating(story.ratingAvg)}</span>
            <span>({formatNumber(story.ratingCount)})</span>
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            {formatNumber(story.readsCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StoryGrid({
  stories,
  className,
  eagerCount = 0,
}: {
  stories: StoryCardData[];
  className?: string;
  eagerCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {stories.map((story, i) => (
        <StoryCard key={story.id} story={story} eager={i < eagerCount} />
      ))}
    </div>
  );
}
