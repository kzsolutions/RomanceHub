"use server";

import { getAuthContext } from "@/lib/supabase/server";

export type TrackResult = { ok: boolean };

export async function trackReading(input: {
  storyId: string;
  chapterId: string;
  chapterNumber: number;
  percent: number;
  completed: boolean;
}): Promise<TrackResult> {
  const { supabase, userId } = await getAuthContext();

  // Visitantes anónimos não têm progresso persistido.
  if (!userId) return { ok: false };

  const percent = Math.max(0, Math.min(100, Math.round(input.percent)));

  // Regista a leitura (contagem de leituras) — melhor esforço.
  await supabase.rpc("record_read", {
    p_story_id: input.storyId,
    p_chapter_id: input.chapterId,
  });

  // Guarda a posição exata, idempotente por (user_id, story_id).
  const { error } = await supabase.from("reading_progress").upsert(
    {
      user_id: userId,
      story_id: input.storyId,
      chapter_id: input.chapterId,
      chapter_number: input.chapterNumber,
      progress: percent,
      completed: input.completed,
      last_read_at: new Date().toISOString(),
    },
    { onConflict: "user_id,story_id" },
  );

  if (error) {
    console.error("[trackReading]", error.message);
    return { ok: false };
  }

  return { ok: true };
}
