import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  getAdminAuthors,
  getAdminCategories,
  getAdminStory,
  getAdminTags,
} from "@/lib/data/admin";
import { StoryForm } from "@/components/admin/StoryForm";
import { Card, StatusBadge, Td, TableWrap, Th, btnPrimary, inputClass, labelClass } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import {
  deleteChapter,
  deleteStory,
  moveChapter,
  upsertChapter,
} from "@/lib/actions/admin";
import { formatMT, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Editar história · Admin" };

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getAdminStory(id);
  if (!story) notFound();

  const [categories, tags, authors] = await Promise.all([
    getAdminCategories(),
    getAdminTags(),
    getAdminAuthors(),
  ]);

  const nextNumber =
    story.chapters.length > 0 ? Math.max(...story.chapters.map((c) => c.number)) + 1 : 1;

  return (
    <div>
      <Link
        href="/admin/historias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Histórias
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{story.title}</h1>
          <StatusBadge status={story.status} />
          {story.isFree && <Badge variant="free">Grátis</Badge>}
        </div>
        <Link
          href={`/historias/${story.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Ver no site
        </Link>
      </div>

      <StoryForm story={story} categories={categories} tags={tags} authors={authors} />

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold">Capítulos ({story.chapters.length})</h2>
        </div>

        {story.chapters.length > 0 ? (
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-16">Nº</Th>
                <Th>Título</Th>
                <Th>Estado</Th>
                <Th>Acesso</Th>
                <Th>Conteúdo</Th>
                <Th>Leituras</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {story.chapters.map((chapter, i) => (
                <tr key={chapter.id} className="hover:bg-surface-2/60">
                  <Td className="font-display font-bold tabular-nums">{chapter.number}</Td>
                  <Td>
                    <Link
                      href={`/admin/capitulos/${chapter.id}`}
                      className="font-medium hover:text-brand-700 dark:hover:text-brand-400"
                    >
                      {chapter.title}
                    </Link>
                  </Td>
                  <Td>
                    {chapter.isPublished ? (
                      <Badge variant="complete">Publicado</Badge>
                    ) : (
                      <Badge>Rascunho</Badge>
                    )}
                  </Td>
                  <Td>
                    {chapter.isFree ? (
                      <Badge variant="free">Grátis</Badge>
                    ) : (
                      <Badge variant="premium">Premium{chapter.priceCents ? ` · ${formatMT(chapter.priceCents)}` : ""}</Badge>
                    )}
                  </Td>
                  <Td>
                    {chapter.hasContent ? (
                      <FileText className="h-4 w-4 text-emerald-600" aria-label="Tem conteúdo" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted/40" aria-label="Sem conteúdo" />
                    )}
                  </Td>
                  <Td className="tabular-nums text-muted">{formatNumber(chapter.readsCount)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <form action={moveChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="story_id" value={story.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={i === 0}
                          title="Subir"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                      <form action={moveChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="story_id" value={story.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={i === story.chapters.length - 1}
                          title="Descer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                      <Link
                        href={`/admin/capitulos/${chapter.id}`}
                        title="Editar capítulo"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="story_id" value={story.id} />
                        <button
                          type="submit"
                          title="Eliminar capítulo"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <p className="text-sm text-muted">Ainda não há capítulos. Adiciona o primeiro abaixo.</p>
        )}

        <form action={upsertChapter} className="mt-6 grid items-end gap-3 sm:grid-cols-[80px_1fr_120px_auto_auto]">
          <input type="hidden" name="story_id" value={story.id} />
          <div>
            <label className={labelClass} htmlFor="number">
              Nº
            </label>
            <input
              id="number"
              name="number"
              type="number"
              min={1}
              defaultValue={nextNumber}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="chapter_title">
              Título do capítulo
            </label>
            <input id="chapter_title" name="title" required className={inputClass} placeholder="Ex.: O primeiro encontro" />
          </div>
          <div>
            <label className={labelClass} htmlFor="chapter_price">
              Preço (MT)
            </label>
            <input
              id="chapter_price"
              name="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className={inputClass}
              placeholder="Em branco = não vendável"
            />
          </div>
          <div className="flex flex-col gap-1.5 pb-2 text-xs">
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" name="is_free" className="h-3.5 w-3.5 accent-brand-600" /> Grátis
            </label>
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" name="is_published" defaultChecked className="h-3.5 w-3.5 accent-brand-600" /> Publicado
            </label>
          </div>
          <button type="submit" className={btnPrimary}>
            <Plus className="h-4 w-4" aria-hidden />
            Adicionar
          </button>
        </form>
      </Card>

      <Card className="mt-6 border-red-200 dark:border-red-500/30">
        <h2 className="font-display text-lg font-bold text-red-700 dark:text-red-400">Zona de perigo</h2>
        <p className="mt-1 text-sm text-muted">
          Eliminar a história remove também os capítulos e conteúdos associados. Esta ação é
          irreversível.
        </p>
        <form action={deleteStory} className="mt-4">
          <input type="hidden" name="id" value={story.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Eliminar história
          </button>
        </form>
      </Card>
    </div>
  );
}
