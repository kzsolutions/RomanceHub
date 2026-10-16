import { ImageIcon } from "lucide-react";
import { upsertCharacter } from "@/lib/actions/admin";
import { inputClass, labelClass, textareaClass, btnPrimary } from "@/components/admin/ui";
import type { StoryCharacter } from "@/lib/data/characters";

const roles = [
  { value: "protagonista", label: "Protagonista" },
  { value: "coprotagonista", label: "Coprotagonista" },
  { value: "antagonista", label: "Antagonista" },
  { value: "secundario", label: "Secundário" },
];

export function CharacterForm({
  storyId,
  slug,
  character,
}: {
  storyId: string;
  slug: string;
  character?: StoryCharacter;
}) {
  const uid = character?.id ?? "novo";

  return (
    <form action={upsertCharacter} className="space-y-4">
      <input type="hidden" name="story_id" value={storyId} />
      <input type="hidden" name="slug" value={slug} />
      {character && <input type="hidden" name="id" value={character.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`name-${uid}`}>
            Nome *
          </label>
          <input
            id={`name-${uid}`}
            name="name"
            required
            defaultValue={character?.name ?? ""}
            className={inputClass}
            placeholder="Ex.: Ana Beatriz"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`role-${uid}`}>
            Papel
          </label>
          <select
            id={`role-${uid}`}
            name="role"
            defaultValue={character?.role ?? "secundario"}
            className={inputClass}
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor={`age-${uid}`}>
            Idade
          </label>
          <input
            id={`age-${uid}`}
            name="age"
            defaultValue={character?.age ?? ""}
            className={inputClass}
            placeholder="Ex.: 27 anos"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`occupation-${uid}`}>
            Profissão
          </label>
          <input
            id={`occupation-${uid}`}
            name="occupation"
            defaultValue={character?.occupation ?? ""}
            className={inputClass}
            placeholder="Ex.: Advogada"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor={`bio-${uid}`}>
            Biografia
          </label>
          <textarea
            id={`bio-${uid}`}
            name="bio"
            rows={3}
            defaultValue={character?.bio ?? ""}
            className={textareaClass}
            placeholder="Quem é este personagem e qual o seu papel na história."
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`appearance-${uid}`}>
            Aparência
          </label>
          <textarea
            id={`appearance-${uid}`}
            name="appearance"
            rows={3}
            defaultValue={character?.appearance ?? ""}
            className={textareaClass}
            placeholder="Cabelo, olhos, altura, estilo de vestir."
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`personality-${uid}`}>
            Personalidade
          </label>
          <textarea
            id={`personality-${uid}`}
            name="personality"
            rows={3}
            defaultValue={character?.personality ?? ""}
            className={textareaClass}
            placeholder="Traços de carácter, temperamento."
          />
        </div>
      </div>

      <div className="rounded-xl border bg-surface-2/40 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <ImageIcon className="h-4 w-4 text-brand-500" aria-hidden />
          Retrato (estilo anime)
        </h3>
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <div className="w-28 overflow-hidden rounded-xl border bg-surface">
            <div className="aspect-[3/4] w-full">
              {character?.portraitUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={character.portraitUrl}
                  alt={`Retrato de ${character.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] text-muted">
                  Sem retrato
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelClass} htmlFor={`portrait-${uid}`}>
                Carregar imagem (JPG/PNG, máx. 5 MB)
              </label>
              <input
                id={`portrait-${uid}`}
                name="portrait"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`portrait_url-${uid}`}>
                …ou URL do retrato
              </label>
              <input
                id={`portrait_url-${uid}`}
                name="portrait_url"
                defaultValue={character?.portraitUrl ?? ""}
                className={inputClass}
                placeholder="https://… ou caminho no bucket 'portraits'"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className={labelClass} htmlFor={`portrait_prompt-${uid}`}>
            Prompt de geração (inglês, para referência)
          </label>
          <textarea
            id={`portrait_prompt-${uid}`}
            name="portrait_prompt"
            rows={2}
            defaultValue={character?.portraitPrompt ?? ""}
            className={textareaClass}
            placeholder="anime portrait, …"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="w-32">
          <label className={labelClass} htmlFor={`sort_order-${uid}`}>
            Ordem
          </label>
          <input
            id={`sort_order-${uid}`}
            name="sort_order"
            type="number"
            min={0}
            defaultValue={character?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_public"
            defaultChecked={character?.isPublic ?? true}
            className="h-4 w-4 accent-brand-600"
          />
          Visível no site
        </label>
        <button type="submit" className={btnPrimary}>
          {character ? "Guardar" : "Adicionar personagem"}
        </button>
      </div>
    </form>
  );
}
