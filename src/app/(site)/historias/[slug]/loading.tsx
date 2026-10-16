import { Skeleton } from "@/components/stories/StoryCardSkeleton";

export default function StoryDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 border-b pb-10 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[260px] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <div className="flex gap-6 pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-10">
        <section className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-full max-w-3xl" />
          <Skeleton className="h-4 w-full max-w-3xl" />
          <Skeleton className="h-4 w-2/3 max-w-2xl" />
        </section>

        <section className="space-y-3">
          <Skeleton className="h-7 w-48" />
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </section>
      </div>
    </div>
  );
}
