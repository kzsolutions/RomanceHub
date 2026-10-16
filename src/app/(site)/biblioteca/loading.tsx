import { Skeleton } from "@/components/stories/StoryCardSkeleton";

export default function BibliotecaLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-xl" />

      <div className="mt-8 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border bg-surface p-5 shadow-soft">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Skeleton className="h-7 w-48" />
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex gap-4 rounded-2xl border bg-surface p-4 shadow-soft">
              <Skeleton className="aspect-[2/3] w-20 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="mt-auto h-2 w-full rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
