"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/library";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  storyId,
  initialFavorite,
  isAuthenticated,
  variant = "full",
  className,
}: {
  storyId: string;
  initialFavorite: boolean;
  isAuthenticated: boolean;
  variant?: "full" | "icon";
  className?: string;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <a
        href={`/entrar?redirect=${encodeURIComponent(pathname)}`}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border bg-surface font-semibold text-foreground transition-colors hover:bg-surface-2",
          variant === "icon" ? "h-10 w-10 justify-center" : "h-11 px-5 text-sm",
          className,
        )}
        aria-label="Favoritar"
      >
        <Heart className="h-4 w-4" aria-hidden />
        {variant === "full" && "Favoritar"}
      </a>
    );
  }

  function onClick() {
    const next = !favorite;
    setFavorite(next);
    startTransition(async () => {
      const result = await toggleFavorite(storyId);
      if (!result.ok) setFavorite(!next);
      else router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorite}
      aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-colors disabled:opacity-60",
        favorite
          ? "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300"
          : "bg-surface text-foreground hover:bg-surface-2",
        variant === "icon" ? "h-10 w-10 justify-center" : "h-11 px-5 text-sm",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", favorite && "fill-current")} aria-hidden />
      {variant === "full" && (favorite ? "Nos favoritos" : "Favoritar")}
    </button>
  );
}
