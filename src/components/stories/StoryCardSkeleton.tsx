import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-surface-2", className)}
    />
  );
}

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border bg-surface p-3 shadow-soft">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <div className="mt-3 flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/3" />
        <div className="mt-auto flex items-center justify-between pt-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function StoryGridSkeleton({
  count = 12,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
