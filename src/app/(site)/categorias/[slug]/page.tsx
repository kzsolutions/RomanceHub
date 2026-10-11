import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import {
  getCategoriesWithCounts,
  listStories,
  normalizeSort,
  SORT_OPTIONS,
  STORY_PAGE_SIZE,
} from "@/lib/data/stories";
import { CategoryIcon } from "@/components/stories/CategoryIcon";
import { EmptyState } from "@/components/stories/EmptyState";
import { FilterSelect } from "@/components/stories/FilterSelect";
import { Pagination } from "@/components/stories/Pagination";
import { StoryGrid } from "@/components/stories/StoryCard";
import { buildQuery, firstParam } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategoriesWithCounts();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Categoria" };
  return {
    title: category.name,
    description: category.description ?? `Histórias de romance na categoria ${category.name}.`,
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const categories = await getCategoriesWithCounts();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const sort = normalizeSort(firstParam(sp.ordenar));
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);
  const { items, total } = await listStories({ categorySlug: slug, sort, page });
  const totalPages = Math.max(1, Math.ceil(total / STORY_PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/categorias"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Todas as categorias
      </Link>

      <header className="mb-8 flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft"
          style={{ backgroundColor: category.color ?? "#cf216d" }}
        >
          <CategoryIcon name={category.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-1 max-w-2xl text-sm text-muted">{category.description}</p>
          )}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
        <FilterSelect
          param="ordenar"
          label="Ordenar por"
          value={sort}
          defaultValue="novidades"
          options={SORT_OPTIONS}
        />
        <span className="text-sm text-muted">
          {total} {total === 1 ? "história" : "histórias"}
        </span>
      </div>

      <div className="mt-8">
        {items.length > 0 ? (
          <>
            <StoryGrid stories={items} eagerCount={4} />
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath={`/categorias/${slug}`}
              params={sp}
            />
          </>
        ) : total > 0 && page > 1 ? (
          <EmptyState
            icon={SearchX}
            title="Esta página não tem resultados"
            description={`Existem ${total} histórias nesta categoria, mas nada na página ${page}.`}
            action={{
              label: "Voltar à primeira página",
              href: buildQuery(sp, { page: undefined }),
            }}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="Ainda não há histórias nesta categoria"
            description="Volta em breve — novas histórias são publicadas todas as semanas."
            action={{ label: "Explorar tudo", href: "/explorar" }}
          />
        )}
      </div>
    </div>
  );
}
