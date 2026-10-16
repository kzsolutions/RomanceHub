import { Skeleton } from "@/components/stories/StoryCardSkeleton";

export default function ReaderLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 pb-20 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <header className="mx-auto mt-8 max-w-2xl space-y-3 text-center">
        <Skeleton className="mx-auto h-4 w-24" />
        <Skeleton className="mx-auto h-9 w-3/4" />
        <Skeleton className="mx-auto h-4 w-48" />
      </header>

      <div className="mx-auto mt-10 max-w-2xl space-y-3">
        {Array.from({ length: 14 }, (_, i) => (
          <Skeleton
            key={i}
            className={i % 5 === 4 ? "h-4 w-2/3" : "h-4 w-full"}
          />
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-2xl items-center justify-between">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
    </div>
  );
}
