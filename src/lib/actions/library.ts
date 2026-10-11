"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; error?: string };

export async function toggleFavorite(storyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Precisas de iniciar sessão." };

  const { data: existing } = await supabase
    .from("favorites")
    .select("story_id")
    .eq("user_id", user.id)
    .eq("story_id", storyId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("story_id", storyId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, story_id: storyId });
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/favoritos");
  revalidatePath("/biblioteca");
  return { ok: true };
}

export async function rateStory(storyId: string, rating: number): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Precisas de iniciar sessão." };

  const value = Math.max(1, Math.min(5, Math.round(rating)));
  const { error } = await supabase
    .from("ratings")
    .upsert(
      { user_id: user.id, story_id: storyId, rating: value, updated_at: new Date().toISOString() },
      { onConflict: "user_id,story_id" },
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Precisas de iniciar sessão." };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/notificacoes");
  return { ok: true };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Precisas de iniciar sessão." };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/notificacoes");
  return { ok: true };
}

export async function removeFromLibrary(storyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Precisas de iniciar sessão." };

  const { error } = await supabase
    .from("reading_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("story_id", storyId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/biblioteca");
  return { ok: true };
}
