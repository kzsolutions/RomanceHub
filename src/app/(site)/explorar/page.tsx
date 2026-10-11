import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, Tag, X } from "lucide-react";
import {
  getCategoriesWithCounts,
  listStories,
  normalizeSort,
  SORT_OPTIONS,
  STORY_PAGE_SIZE,
} from "@/lib/data/stories";
import { EmptyState } from "@/components/stories/EmptyState";
import { FilterSelect } from "@/components/stories/FilterSelect";
import { Pagination } from "@/components/stories/Pagination";
import { StoryGrid } from "@/components/stories/StoryCard";
import { buildQuery, cn, firstParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Explorar histórias",
  description:
    "Filtra romances por categoria, tags, conclusão e popularidade. Encontra a tua próxima história em português.",
};

const COMPLETION_OPTIONS = [
  { value: "", label: "Qualquer estado" },
  { value: "ongoing", label: "Em curso" },
  { value: "complete", label: "Concluídas" },
];

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const categorySlug = firstParam(sp.categoria);
  const tagSlug = firstParam(sp.tag);
  const freeOnly = firstParam(sp.gratis) === "1";
  const completionRaw = firstParam(sp.conclusao);
  const completion =
    completionRaw === "ongoing" || completionRaw === "complete" ? completionRaw : undefined;
  const sort = normalizeSort(firstParam(sp.ordenar));
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);

  const [{ items, total }, categories] = await Promise.all([
    listStories({ categorySlug, tagSlug, freeOnly, completion, sort, page }),
    getCategoriesWithCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / STORY_PAGE_SIZE));
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const chip = (label: string, patch: Record<string, string | undefined>, active: boolean) => (
    <Link
      key={label}
      href={buildQuery(sp, patch)}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brand-600 bg-brand-600 text-white shadow-soft"
          : "bg-surface text-muted hover:bg-surface-2 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Explorar histórias</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Usa os filtros para encontrar exatamente o tipo de romance que te apetece ler.
        </p>
      </header>

      {/* Filtro de categorias */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {chip("Todas", { categoria: undefined, tag: undefined, page: undefined }, !categorySlug && !tagSlug)}
        {categories.map((cat) =>
          chip(
            `${cat.name} (${cat.storyCount})`,
            { categoria: cat.slug, tag: undefined, page: undefined },
            cat.slug === categorySlug,
          ),
        )}
      </div>

      {/* Controlos */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-y py-4">
        <FilterSelect
          param="ordenar"
          label="Ordenar por"
          value={sort}
          defaultValue="novidades"
          options={SORT_OPTIONS}
        />
        <FilterSelect
          param="conclusao"
          label="Estado"
          value={completion ?? ""}
          defaultValue=""
          options={COMPLETION_OPTIONS}
        />
        <Link
          href={buildQuery(sp, { gratis: freeOnly ? undefined : "1", page: undefined })}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            freeOnly
              ? "border-emerald-600 bg-emerald-600 text-white shadow-soft"
              : "bg-surface text-muted hover:bg-surface-2 hover:text-foreground",
          )}
        >
          Só grátis
        </Link>
        {tagSlug && (
          <Link
            href={buildQuery(sp, { tag: undefined, page: undefined })}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
          >
            <Tag className="h-3.5 w-3.5" aria-hidden />
            {tagSlug.replace(/-/g, " ")}
            <X className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
        <span className="ml-auto text-sm text-muted">
          {total} {total === 1 ? "história" : "histórias"}
          {activeCategory && ` em ${activeCategory.name}`}
        </span>
      </div>

      <div className="mt-8">
        {items.length > 0 ? (
          <>
            <StoryGrid stories={items} eagerCount={4} />
            <Pagination page={page} totalPages={totalPages} basePath="/explorar" params={sp} />
          </>
        ) : total > 0 && page > 1 ? (
          <EmptyState
            icon={SearchX}
            title="Esta página não tem resultados"
            description={`Existem ${total} histórias com estes filtros, mas nada na página ${page}.`}
            action={{
              label: "Voltar à primeira página",
              href: buildQuery(sp, { page: undefined }),
            }}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="Nenhuma história com estes filtros"
            description="Experimenta remover alguns filtros ou explora as nossas categorias."
            action={{
              label: "Limpar filtros",
              href: "/explorar",
            }}
          />
        )}
      </div>
    </div>
  );
}
