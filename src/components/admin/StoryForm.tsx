import { upsertStory } from "@/lib/actions/admin";
import type { AdminStoryDetail, AdminAuthorRow } from "@/lib/data/admin";
import { Card, labelClass, inputClass, textareaClass, btnPrimary } from "@/components/admin/ui";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

export function StoryForm({
  story,
  categories,
  tags,
  authors,
}: {
  story?: AdminStoryDetail;
  categories: Category[];
  tags: Tag[];
  authors: AdminAuthorRow[];
}) {
  return (
    <form action={upsertStory} className="space-y-4">
      {story && <input type="hidden" name="id" value={story.id} />}

      <Card>
        <h2 className="mb-4 font-display text-lg font-bold">Informação principal</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="title">
              Título *
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={story?.title ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="slug">
              Slug (opcional)
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={story?.slug ?? ""}
              className={inputClass}
              placeholder="gerado a partir do título"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="author_id">
              Autor *
            </label>
            <select
              id="author_id"
              name="author_id"
              required
              defaultValue={story?.authorId ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Seleciona um autor
              </option>
              {authors.map((a) => (
                <option key={a.profileId} value={a.profileId}>
                  {a.penName ? `${a.penName} (${a.name})` : a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="synopsis">
              Sinopse *
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              required
              rows={4}
              defaultValue={story?.synopsis ?? ""}
              className={textareaClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="category_id">
              Categoria
            </label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={story?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="cover_url">
              URL da capa
            </label>
            <input
              id="cover_url"
              name="cover_url"
              defaultValue={story?.coverUrl ?? ""}
              className={inputClass}
              placeholder="/covers/exemplo.svg"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-lg font-bold">Publicação</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="status">
              Estado
            </label>
            <select id="status" name="status" defaultValue={story?.status ?? "draft"} className={inputClass}>
              <option value="draft">Rascunho</option>
              <option value="pending">Em revisão</option>
              <option value="published">Publicada</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="completion">
              Conclusão
            </label>
            <select
              id="completion"
              name="completion"
              defaultValue={story?.completion ?? "ongoing"}
              className={inputClass}
            >
              <option value="ongoing">Em curso</option>
              <option value="complete">Concluída</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="is_free" defaultChecked={story?.isFree ?? false} className="h-4 w-4 accent-brand-600" />
              Gratuita (toda a obra)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={story?.isFeatured ?? false}
                className="h-4 w-4 accent-brand-600"
              />
              Em destaque
            </label>
          </div>
        </div>
        <div className="mt-4 max-w-xs">
          <label className={labelClass} htmlFor="price">
            Preço da obra (MT)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            defaultValue={
              story?.priceCents !== null && story?.priceCents !== undefined
                ? Number((story.priceCents / 100).toFixed(2))
                : ""
            }
            placeholder="Em branco para não ser vendável"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">
            Para obras gratuitas não é necessário definir preço.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-lg font-bold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-surface px-3 py-1.5 text-sm transition-colors has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 dark:has-[:checked]:bg-brand-500/15"
            >
              <input
                type="checkbox"
                name="tags"
                value={tag.id}
                defaultChecked={story?.tagIds.includes(tag.id) ?? false}
                className="h-3.5 w-3.5 accent-brand-600"
              />
              {tag.name}
            </label>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted">Ainda não há tags.</p>}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button type="submit" className={btnPrimary}>
          {story ? "Guardar alterações" : "Criar história"}
        </button>
      </div>
    </form>
  );
}
