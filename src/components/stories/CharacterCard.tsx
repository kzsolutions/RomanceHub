import { Briefcase, Cake, ImageIcon, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { CharacterRole, StoryCharacter } from "@/lib/data/characters";

const roleMeta: Record<
  CharacterRole,
  { label: string; variant: "brand" | "complete" | "premium" | "default" }
> = {
  protagonista: { label: "Protagonista", variant: "brand" },
  coprotagonista: { label: "Coprotagonista", variant: "complete" },
  antagonista: { label: "Antagonista", variant: "premium" },
  secundario: { label: "Secundário", variant: "default" },
};

function Section({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{value}</p>
    </div>
  );
}

export function CharacterCard({ character }: { character: StoryCharacter }) {
  const meta = roleMeta[character.role] ?? roleMeta.secundario;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-soft">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-brand-100 via-surface-2 to-brand-50 dark:from-brand-500/15 dark:via-surface-2 dark:to-brand-500/10">
        {character.portraitUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.portraitUrl}
            alt={`Retrato de ${character.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
            <ImageIcon className="h-8 w-8 text-brand-400/70" aria-hidden />
            <p className="text-xs font-semibold text-muted">Espaço de ilustração</p>
            <p className="text-[11px] text-muted/80">Retrato estilo anime em breve</p>
          </div>
        )}
        <span className="absolute left-3 top-3">
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-bold leading-tight">
            <UserRound className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
            {character.name}
          </h3>
          {(character.age || character.occupation) && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {character.age && (
                <span className="flex items-center gap-1.5">
                  <Cake className="h-3.5 w-3.5" aria-hidden />
                  {character.age}
                </span>
              )}
              {character.occupation && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden />
                  {character.occupation}
                </span>
              )}
            </div>
          )}
        </div>

        {character.bio && (
          <p className="text-sm leading-relaxed text-foreground/90">{character.bio}</p>
        )}

        <div className="mt-auto space-y-3 border-t pt-3">
          <Section label="Aparência" value={character.appearance} />
          {character.personality && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                Personalidade
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                {character.personality}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
