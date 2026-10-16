import { Skeleton, StoryGridSkeleton } from "@/components/stories/StoryCardSkeleton";

export default function PesquisaLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="text-center">
        <Skeleton className="mx-auto h-9 w-64" />
        <Skeleton className="mx-auto mt-2 h-4 w-full max-w-md" />
        <Skeleton className="mx-auto mt-6 h-12 w-full max-w-xl rounded-full" />
      </header>

      <div className="mt-10">
        <StoryGridSkeleton count={12} />
      </div>
    </div>
  );
}
