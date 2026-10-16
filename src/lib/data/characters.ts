import { createClient } from "@/lib/supabase/server";

export type CharacterRole = "protagonista" | "coprotagonista" | "antagonista" | "secundario";

export type StoryCharacter = {
  id: string;
  storyId: string;
  name: string;
  role: CharacterRole;
  age: string | null;
  occupation: string | null;
  appearance: string | null;
  personality: string | null;
  bio: string | null;
  portraitUrl: string | null;
  portraitPrompt: string | null;
  sortOrder: number;
  isPublic: boolean;
};

const SELECT =
  "id,story_id,name,role,age,occupation,appearance,personality,bio,portrait_url,portrait_prompt,sort_order,is_public";

type Row = {
  id: string;
  story_id: string;
  name: string;
  role: string;
  age: string | null;
  occupation: string | null;
  appearance: string | null;
  personality: string | null;
  bio: string | null;
  portrait_url: string | null;
  portrait_prompt: string | null;
  sort_order: number;
  is_public: boolean;
};

function mapRow(row: Row): StoryCharacter {
  return {
    id: row.id,
    storyId: row.story_id,
    name: row.name,
    role: row.role as CharacterRole,
    age: row.age,
    occupation: row.occupation,
    appearance: row.appearance,
    personality: row.personality,
    bio: row.bio,
    portraitUrl: row.portrait_url,
    portraitPrompt: row.portrait_prompt,
    sortOrder: row.sort_order,
    isPublic: row.is_public,
  };
}

/** Fichas visíveis na página pública da história. */
export async function getStoryCharacters(storyId: string): Promise<StoryCharacter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select(SELECT)
    .eq("story_id", storyId)
    .eq("is_public", true)
    .order("sort_order")
    .order("name");

  if (error) {
    console.error("[getStoryCharacters]", error.message);
    return [];
  }
  return ((data ?? []) as unknown as Row[]).map(mapRow);
}

/** Todas as fichas de uma história (inclui não públicas) — uso no admin. */
export async function getStoryCharactersAdmin(storyId: string): Promise<StoryCharacter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select(SELECT)
    .eq("story_id", storyId)
    .order("sort_order")
    .order("name");

  if (error) {
    console.error("[getStoryCharactersAdmin]", error.message);
    return [];
  }
  return ((data ?? []) as unknown as Row[]).map(mapRow);
}
