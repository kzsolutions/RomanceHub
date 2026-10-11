import type { Metadata } from "next";
import { Search, SearchX } from "lucide-react";
import {
  getCategoriesWithCounts,
  normalizeSort,
  searchStories,
  SORT_OPTIONS,
  STORY_PAGE_SIZE,
} from "@/lib/data/stories";
import { CategoryIcon } from "@/components/stories/CategoryIcon";
import { EmptyState } from "@/components/stories/EmptyState";
import { FilterSelect } from "@/components/stories/FilterSelect";
import { Pagination } from "@/components/stories/Pagination";
import { StoryGrid } from "@/components/stories/StoryCard";
import { buildQuery, firstParam } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pesquisar",
  description: "Procura histórias por título, autor, sinopse ou tema.",
};

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = firstParam(sp.q)?.trim() ?? "";
  const sort = normalizeSort(firstParam(sp.ordenar));
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);

  const { items, total } = q
    ? await searchStories(q, sort, page)
    : { items: [], total: 0 };
  const totalPages = Math.max(1, Math.ceil(total / STORY_PAGE_SIZE));
  const categories = q ? [] : await getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {q ? (
            <>
              Resultados para <span className="text-brand-600 dark:text-brand-400">«{q}»</span>
            </>
          ) : (
            "Pesquisar histórias"
          )}
        </h1>
        {q && (
          <p className="mt-2 text-muted">
            {total} {total === 1 ? "resultado encontrado" : "resultados encontrados"}
          </p>
        )}
      </header>

      {!q ? (
        <div>
          <div className="rounded-2xl border bg-surface px-6 py-12 text-center shadow-soft">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
              <Search className="h-7 w-7" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-bold">O que te apetece ler hoje?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Escreve no campo de pesquisa do topo — procuramos por título, autor, sinopse e tema.
            </p>
          </div>
          <h2 className="mb-4 mt-10 font-display text-xl font-bold">Ou explora por categoria</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                <CategoryIcon name={cat.icon} className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-4 border-y py-4">
            <FilterSelect
              param="ordenar"
              label="Ordenar por"
              value={sort}
              defaultValue="novidades"
              options={SORT_OPTIONS}
            />
          </div>
          <StoryGrid stories={items} eagerCount={4} />
          <Pagination page={page} totalPages={totalPages} basePath="/pesquisa" params={sp} />
        </>
      ) : total > 0 && page > 1 ? (
        <EmptyState
          icon={SearchX}
          title="Esta página não tem resultados"
          description={`Há ${total} resultados para «${q}», mas nada na página ${page}.`}
          action={{
            label: "Voltar à primeira página",
            href: buildQuery(sp, { page: undefined }),
          }}
        />
      ) : (
        <EmptyState
          icon={SearchX}
          title={`Nada encontrado para «${q}»`}
          description="Tenta outras palavras, o nome de um autor ou o título de uma categoria."
          action={{ label: "Explorar todas as histórias", href: "/explorar" }}
        />
      )}
    </div>
  );
}
