import { Skeleton } from "@/components/stories/StoryCardSkeleton";

export default function CategoriasLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-2xl" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="rounded-2xl border bg-surface p-6 shadow-soft">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-5 h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
