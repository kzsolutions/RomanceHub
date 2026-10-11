import type { Metadata } from "next";
import Link from "next/link";
import { Check, Eye, EyeOff, Pencil, Plus, Star } from "lucide-react";
import { getAdminCategories, getAdminStories, PAGE_SIZE } from "@/lib/data/admin";
import type { StoryStatus } from "@/lib/data/admin";
import { Card, StatusBadge, Td, TableWrap, Th, btnGhost, labelClass, inputClass } from "@/components/admin/ui";
import { Pagination } from "@/components/stories/Pagination";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/stories/EmptyState";
import { toggleStoryFlag, setStoryStatus } from "@/lib/actions/admin";
import { formatDate, formatNumber, formatRating, firstParam } from "@/lib/utils";

export const metadata: Metadata = { title: "Histórias · Admin" };

const STATUSES: { value: StoryStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "published", label: "Publicadas" },
  { value: "draft", label: "Rascunhos" },
  { value: "pending", label: "Em revisão" },
  { value: "rejected", label: "Rejeitadas" },
];

export default async function AdminStoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = firstParam(sp.q) ?? "";
  const status = (firstParam(sp.estado) ?? "all") as StoryStatus | "all";
  const categoryId = firstParam(sp.categoria) ?? "";
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);

  const [{ items, total }, categories] = await Promise.all([
    getAdminStories({ q, status, categoryId, page }),
    getAdminCategories(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Histórias</h1>
          <p className="mt-1 text-sm text-muted">{total} no total</p>
        </div>
        <Button href="/admin/historias/nova">
          <Plus className="h-4 w-4" aria-hidden />
          Nova história
        </Button>
      </div>

      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className={labelClass} htmlFor="q">
              Pesquisar por título
            </label>
            <input id="q" name="q" defaultValue={q} className={inputClass} placeholder="Título…" />
          </div>
          <div>
            <label className={labelClass} htmlFor="estado">
              Estado
            </label>
            <select id="estado" name="estado" defaultValue={status} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="categoria">
              Categoria
            </label>
            <select id="categoria" name="categoria" defaultValue={categoryId} className={inputClass}>
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={btnGhost}>
            Filtrar
          </button>
        </form>
      </Card>

      {items.length > 0 ? (
        <>
          <TableWrap>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Autor</Th>
                <Th>Categoria</Th>
                <Th>Estado</Th>
                <Th>Leituras</Th>
                <Th>Avaliação</Th>
                <Th>Atualizada</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((story) => (
                <tr key={story.id} className="hover:bg-surface-2/60">
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/historias/${story.id}`}
                        className="font-semibold hover:text-brand-700 dark:hover:text-brand-400"
                      >
                        {story.title}
                      </Link>
                      {story.isFeatured && <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-label="Destaque" />}
                    </div>
                    <p className="text-xs text-muted">/{story.slug}</p>
                  </Td>
                  <Td className="text-muted">{story.authorName}</Td>
                  <Td className="text-muted">{story.categoryName ?? "—"}</Td>
                  <Td>
                    <StatusBadge status={story.status} />
                  </Td>
                  <Td className="tabular-nums text-muted">{formatNumber(story.readsCount)}</Td>
                  <Td className="tabular-nums text-muted">
                    {formatRating(story.ratingAvg)} ({formatNumber(story.ratingCount)})
                  </Td>
                  <Td className="text-xs text-muted">{formatDate(story.updatedAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/historias/${story.id}`}
                        title="Editar"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                      {story.status !== "published" && (
                        <form action={setStoryStatus}>
                          <input type="hidden" name="id" value={story.id} />
                          <input type="hidden" name="slug" value={story.slug} />
                          <input type="hidden" name="status" value="published" />
                          <button
                            type="submit"
                            title="Publicar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </form>
                      )}
                      {story.status === "published" && (
                        <form action={setStoryStatus}>
                          <input type="hidden" name="id" value={story.id} />
                          <input type="hidden" name="slug" value={story.slug} />
                          <input type="hidden" name="status" value="draft" />
                          <button
                            type="submit"
                            title="Despublicar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground"
                          >
                            <EyeOff className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </form>
                      )}
                      <form action={toggleStoryFlag}>
                        <input type="hidden" name="id" value={story.id} />
                        <input type="hidden" name="slug" value={story.slug} />
                        <input type="hidden" name="field" value="is_featured" />
                        <input type="hidden" name="value" value={story.isFeatured ? "false" : "true"} />
                        <button
                          type="submit"
                          title={story.isFeatured ? "Remover destaque" : "Destacar"}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-gold-600"
                        >
                          {story.isFeatured ? (
                            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-hidden />
                          ) : (
                            <Star className="h-3.5 w-3.5" aria-hidden />
                          )}
                        </button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <Pagination page={page} totalPages={totalPages} basePath="/admin/historias" params={sp} />
        </>
      ) : (
        <EmptyState
          icon={Eye}
          title="Sem histórias"
          description="Nenhuma história corresponde aos filtros selecionados."
          action={{ label: "Nova história", href: "/admin/historias/nova" }}
        />
      )}
    </div>
  );
}
