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
              rows={6}
              defaultValue={story?.synopsis ?? ""}
              className={textareaClass}
              placeholder="Abre com uma regra, um segredo ou um limite prestes a ser quebrado. Apresenta os protagonistas e o que têm a perder, o conflito que os aproxima e os afasta, e fecha com uma pergunta por responder — sem revelar o desfecho."
            />
            <details className="mt-2 rounded-xl border bg-surface-2/40 px-3 py-2 text-sm">
              <summary className="cursor-pointer font-semibold text-muted">
                Como escrever uma sinopse envolvente
              </summary>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted">
                <li>
                  <strong>Gancho inicial:</strong> uma frase de impacto que apresente uma regra, uma
                  ameaça, um segredo ou uma promessa impossível (original de cada obra).
                </li>
                <li>
                  <strong>Protagonistas:</strong> objetivos, personalidade, vulnerabilidades e o que
                  cada um tem a perder.
                </li>
                <li>
                  <strong>Conflito central:</strong> o que os obriga a aproximar-se e, ao mesmo
                  tempo, o que os impede de ficar juntos.
                </li>
                <li>
                  <strong>Atração e tensão:</strong> gestos, silêncios e contradições — sem resolver
                  os sentimentos cedo demais.
                </li>
                <li>
                  <strong>Consequências:</strong> o risco de cederem, revelarem um segredo ou
                  tomarem a decisão errada.
                </li>
                <li>
                  <strong>Gancho final:</strong> uma ameaça, uma escolha difícil ou uma revelação
                  iminente. Nunca revelar o desfecho.
                </li>
              </ul>
              <p className="mt-2 text-xs text-muted">
                Evita resumir os acontecimentos ou tornar todas as obras iguais — a sinopse deve
                respeitar a identidade de cada história.
              </p>
            </details>
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

        <div className="mt-4 grid max-w-md gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="preview_percent">
              Prévia gratuita (%)
            </label>
            <input
              id="preview_percent"
              name="preview_percent"
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              step="1"
              defaultValue={story ? String(story.previewPercent) : "50"}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="preview_min">
              Mínimo de capítulos grátis
            </label>
            <input
              id="preview_min"
              name="preview_min"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              defaultValue={story ? String(story.previewMin) : "3"}
              className={inputClass}
            />
          </div>
          <p className="text-xs text-muted sm:col-span-2">
            Para obras premium, a prévia é 50% dos capítulos publicados (arredondado para baixo),
            com o mínimo aplicado apenas quando existirem 6 ou mais publicados. As obras gratuitas
            ficam sempre legíveis na totalidade.
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
