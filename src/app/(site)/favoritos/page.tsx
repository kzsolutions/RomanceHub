import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { getFavoriteStories } from "@/lib/data/library";
import { StoryCard } from "@/components/stories/StoryCard";
import { FavoriteButton } from "@/components/stories/FavoriteButton";
import { EmptyState } from "@/components/stories/EmptyState";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritosPage() {
  const favorites = await getFavoriteStories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Favoritos
        </p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">As tuas histórias guardadas</h1>
        <p className="mt-2 text-sm text-muted">
          {favorites.length} {favorites.length === 1 ? "história" : "histórias"} nos teus favoritos
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {favorites.map(({ story }) => (
            <div key={story.id} className="relative">
              <StoryCard story={story} />
              <div className="absolute right-2 top-2 z-10">
                <FavoriteButton
                  storyId={story.id}
                  initialFavorite
                  isAuthenticated
                  variant="icon"
                  className="h-8 w-8 border-brand-300 bg-brand-50/95 text-brand-700 backdrop-blur dark:border-brand-500/40 dark:bg-brand-500/30 dark:text-brand-200"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Ainda não tens favoritos"
          description="Toca no coração numa história para a guardares aqui e encontrares rapidamente."
          action={{ label: "Explorar histórias", href: "/explorar" }}
        />
      )}
    </div>
  );
}
