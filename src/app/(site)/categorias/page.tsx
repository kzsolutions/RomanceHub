import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/data/stories";
import { CategoryIcon } from "@/components/stories/CategoryIcon";

export const metadata: Metadata = {
  title: "Categorias",
  description:
    "Todas as categorias de romance do RomanceHub: enemies-to-lovers, segunda chance, CEO, suspense romântico e mais.",
};

export default async function CategoriasPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Categorias</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Escolhe o tropeço, o humor ou a atmosfera que te apetece — cada categoria reúne as
          histórias feitas para ti.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categorias/${cat.slug}`}
            className="group flex gap-4 rounded-2xl border bg-surface p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft"
              style={{ backgroundColor: cat.color ?? "#cf216d" }}
            >
              <CategoryIcon name={cat.icon} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-bold transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                  {cat.name}
                </h2>
                <span className="shrink-0 text-xs font-semibold text-muted">
                  {cat.storyCount} {cat.storyCount === 1 ? "história" : "histórias"}
                </span>
              </div>
              {cat.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">{cat.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
