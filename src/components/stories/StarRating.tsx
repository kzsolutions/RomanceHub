import { Star } from "lucide-react";
import { cn, formatNumber, formatRating } from "@/lib/utils";

export function StarRating({
  value,
  count,
  className,
  iconClassName,
}: {
  value: number;
  count?: number;
  className?: string;
  iconClassName?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" aria-label={`Avaliação ${formatRating(value)} de 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              "h-4 w-4",
              n <= rounded ? "fill-gold-400 text-gold-400" : "text-border",
              iconClassName,
            )}
            aria-hidden
          />
        ))}
      </span>
      <span className="text-sm font-semibold">{formatRating(value)}</span>
      {count !== undefined && <span className="text-xs text-muted">({formatNumber(count)})</span>}
    </span>
  );
}
