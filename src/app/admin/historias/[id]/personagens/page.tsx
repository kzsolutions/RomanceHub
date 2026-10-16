import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { getAdminStory } from "@/lib/data/admin";
import { getStoryCharactersAdmin } from "@/lib/data/characters";
import { CharacterForm } from "@/components/admin/CharacterForm";
import { deleteCharacter } from "@/lib/actions/admin";
import {
  AdminPageHeader,
  Card,
  btnDanger,
} from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Personagens · Admin" };

export default async function StoryCharactersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getAdminStory(id);
  if (!story) notFound();

  const characters = await getStoryCharactersAdmin(id);

  return (
    <div>
      <Link
        href={`/admin/historias/${story.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {story.title}
      </Link>

      <AdminPageHeader
        title="Personagens"
        description="Fichas visuais (texto editorial + retrato estilo anime) apresentadas na página da história."
        action={
          <Link
            href={`/historias/${story.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver no site
          </Link>
        }
      />

      {characters.length > 0 ? (
        <div className="space-y-6">
          {characters.map((character) => (
            <Card key={character.id}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  {character.name}
                  {!character.isPublic && <Badge>Oculto</Badge>}
                </h2>
                <form action={deleteCharacter}>
                  <input type="hidden" name="id" value={character.id} />
                  <input type="hidden" name="story_id" value={story.id} />
                  <input type="hidden" name="slug" value={story.slug} />
                  <button type="submit" className={btnDanger} title="Eliminar personagem">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Eliminar
                  </button>
                </form>
              </div>
              <CharacterForm storyId={story.id} slug={story.slug} character={character} />
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <p className="text-sm text-muted">
            Ainda não há personagens. Adiciona a primeira ficha abaixo.
          </p>
        </Card>
      )}

      <Card className="mt-6 border-dashed">
        <h2 className="mb-4 font-display text-lg font-bold">Adicionar personagem</h2>
        <CharacterForm storyId={story.id} slug={story.slug} />
      </Card>
    </div>
  );
}
