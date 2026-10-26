import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Save, Trash2 } from "lucide-react";
import { getAdminChapter } from "@/lib/data/admin";
import { Card, labelClass, inputClass, textareaClass, btnPrimary } from "@/components/admin/ui";
import { deleteChapter, saveChapterContent, upsertChapter } from "@/lib/actions/admin";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Editar capítulo · Admin" };

export default async function EditChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = await getAdminChapter(id);
  if (!chapter) notFound();

  return (
    <div>
      <Link
        href={`/admin/historias/${chapter.storyId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {chapter.storyTitle}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Capítulo {chapter.number}: {chapter.title}
          </h1>
          <p className="mt-1 text-sm text-muted">{formatNumber(chapter.readsCount)} leituras</p>
        </div>
        {chapter.isPublished && (
          <Link
            href={`/ler/${chapter.storySlug}/${chapter.number}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver no leitor
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <h2 className="mb-4 font-display text-lg font-bold">Detalhes</h2>
          <form action={upsertChapter} className="space-y-4">
            <input type="hidden" name="id" value={chapter.id} />
            <input type="hidden" name="story_id" value={chapter.storyId} />
            <div>
              <label className={labelClass} htmlFor="number">
                Número
              </label>
              <input
                id="number"
                name="number"
                type="number"
                min={1}
                defaultValue={chapter.number}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="title">
                Título
              </label>
              <input id="title" name="title" required defaultValue={chapter.title} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="price">
                Preço (MT)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                defaultValue={
                  chapter.priceCents !== null ? Number((chapter.priceCents / 100).toFixed(2)) : ""
                }
                placeholder="Em branco para não ser vendável"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_free"
                  defaultChecked={chapter.isFree}
                  className="h-4 w-4 accent-brand-600"
                />
                Capítulo grátis
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={chapter.isPublished}
                  className="h-4 w-4 accent-brand-600"
                />
                Publicado
              </label>
            </div>
            <button type="submit" className={btnPrimary}>
              <Save className="h-4 w-4" aria-hidden />
              Guardar
            </button>
          </form>

          <form action={deleteChapter} className="mt-6 border-t pt-4">
            <input type="hidden" name="id" value={chapter.id} />
            <input type="hidden" name="story_id" value={chapter.storyId} />
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Eliminar capítulo
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-1 font-display text-lg font-bold">Conteúdo</h2>
          <p className="mb-4 text-sm text-muted">
            Texto puro. Separa os parágrafos com uma linha em branco.
          </p>
          <details className="mb-4 rounded-xl border bg-surface-2/40 px-3 py-2 text-sm">
            <summary className="cursor-pointer font-semibold text-muted">
              Guia rápido de escrita do capítulo
            </summary>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted">
              <li>
                <strong>Microcontactos:</strong> roçar de dedos, olhares que demoram um instante a
                mais, um ombro que se afasta — a tensão vive nos gestos pequenos, não só no diálogo.
              </li>
              <li>
                <strong>Contradição interna:</strong> o que a personagem sente e o que diz ou faz
                devem divergir; é essa fricção que revela desejo e medo.
              </li>
              <li>
                <strong>Detalhes sensoriais:</strong> cheiros, temperatura, textura e som ancoram a
                cena no corpo do leitor (uma lista de sensações nunca conta; usa uma por parágrafo).
              </li>
              <li>
                <strong>Cenário com função:</strong> o espaço deve intensificar o conflito — o
                silêncio de um escritório, o ruído de uma festa, a chuva que atrasa uma despedida.
              </li>
              <li>
                <strong>Ritmo:</strong> alterna frases curtas nas confrontações com frases longas na
                introspeção; fecha cenas no momento em que a tensão chega ao máximo.
              </li>
              <li>
                <strong>Evolução da personagem:</strong> cada capítulo deve mudar algo — uma decisão,
                uma revelação ou uma nova percepção de si mesma.
              </li>
              <li>
                <strong>Originalidade:</strong> evita resolver tudo com beijos ou mal-entendidos
                repetidos; procura a reacção que só <em>estas</em> personagens teriam.
              </li>
              <li>
                <strong>Fecho com gancho:</strong> termina numa pergunta sem resposta, numa ameaça
                ou numa escolha iminente para obrigar à leitura do capítulo seguinte.
              </li>
            </ul>
          </details>
          <form action={saveChapterContent}>
            <input type="hidden" name="chapter_id" value={chapter.id} />
            <input type="hidden" name="story_id" value={chapter.storyId} />
            <textarea
              name="content"
              rows={22}
              defaultValue={chapter.content}
              className={`${textareaClass} font-mono text-[13px] leading-relaxed`}
              placeholder="Escreve aqui o capítulo…"
            />
            <button type="submit" className={`${btnPrimary} mt-4`}>
              <Save className="h-4 w-4" aria-hidden />
              Guardar conteúdo
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
