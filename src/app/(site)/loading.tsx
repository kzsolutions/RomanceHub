import { Skeleton, StoryGridSkeleton } from "@/components/stories/StoryCardSkeleton";

export default function HomeLoading() {
  return (
    <>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-5">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-12 w-full max-w-xl" />
              <Skeleton className="h-12 w-3/4 max-w-lg" />
              <Skeleton className="h-5 w-full max-w-xl" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-12 w-44 rounded-full" />
                <Skeleton className="h-12 w-44 rounded-full" />
              </div>
              <div className="flex gap-8 border-t pt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <Skeleton className="aspect-[4/5] w-full rounded-3xl lg:aspect-square" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <StoryGridSkeleton count={6} />
        </section>
        <section className="space-y-6">
          <Skeleton className="h-8 w-56" />
          <StoryGridSkeleton count={6} />
        </section>
      </div>
    </>
  );
}
