"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { rateStory } from "@/lib/actions/library";
import { cn, formatNumber, formatRating } from "@/lib/utils";

export function RatingWidget({
  storyId,
  initialRating,
  isAuthenticated,
  ratingAvg,
  ratingCount,
}: {
  storyId: string;
  initialRating: number | null;
  isAuthenticated: boolean;
  ratingAvg: number;
  ratingCount: number;
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const shown = hover || rating || 0;

  function choose(value: number) {
    if (!isAuthenticated) return;
    const previous = rating;
    setRating(value);
    startTransition(async () => {
      const result = await rateStory(storyId, value);
      if (!result.ok) setRating(previous);
      else router.refresh();
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border bg-surface-2/60 p-4">
        <div className="flex items-center gap-2">
          <Stars value={0} />
          <span className="text-sm font-semibold">{formatRating(ratingAvg)}</span>
          <span className="text-xs text-muted">
            ({formatNumber(ratingCount)} avaliaç{ratingCount === 1 ? "ão" : "ões"})
          </span>
        </div>
        <a
          href={`/entrar?redirect=${encodeURIComponent(pathname)}`}
          className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Inicia sessão para avaliar
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-surface-2/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center" role="radiogroup" aria-label="A tua avaliação">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
              disabled={pending}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => choose(value)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  value <= shown ? "fill-gold-400 text-gold-400" : "text-muted/50",
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
        <div className="text-sm">
          {rating ? (
            <span className="font-semibold text-brand-700 dark:text-brand-300">
              A tua avaliação: {rating}/5
            </span>
          ) : (
            <span className="text-muted">Toca para avaliar</span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        Média da comunidade: {formatRating(ratingAvg)} ({formatNumber(ratingCount)} avaliaç
        {ratingCount === 1 ? "ão" : "ões"})
      </p>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center">
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          className={cn("h-4 w-4", v <= Math.round(value) ? "fill-gold-400 text-gold-400" : "text-muted/40")}
          aria-hidden
        />
      ))}
    </span>
  );
}
