"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthContext, getCurrentProfile } from "@/lib/supabase/server";
import { slugify, mtToCents } from "@/lib/utils";
import type { StoryStatus, UserRole, ReportStatus } from "@/lib/data/admin";

async function requireAdmin() {
  const { supabase, userId } = await getAuthContext();
  if (!userId) throw new Error("Não autenticado.");

  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") throw new Error("Sem permissão de administrador.");

  return supabase;
}

const bool = (v: FormDataEntryValue | null) => v === "on" || v === "true";

function clampInt(
  value: FormDataEntryValue | null,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/categorias");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/historias/${slug}`);
}

export async function upsertStory(formData: FormData) {
  const supabase = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const synopsis = String(formData.get("synopsis") ?? "").trim();
  const authorId = String(formData.get("author_id") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const completion = (String(formData.get("completion") ?? "ongoing") || "ongoing") as
    | "ongoing"
    | "complete";
  const status = (String(formData.get("status") ?? "draft") || "draft") as StoryStatus;
  const isFree = bool(formData.get("is_free"));
  const isFeatured = bool(formData.get("is_featured"));
  const tagIds = formData.getAll("tags").map(String);
  const priceCents = isFree ? null : mtToCents(String(formData.get("price") ?? ""));
  const previewPercent = clampInt(formData.get("preview_percent"), 0, 100, 50);
  const previewMin = clampInt(formData.get("preview_min"), 0, 999, 3);

  if (!title || !synopsis || !authorId) {
    throw new Error("Título, sinopse e autor são obrigatórios.");
  }

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);

  const payload = {
    title,
    slug,
    synopsis,
    author_id: authorId,
    category_id: categoryId,
    cover_url: coverUrl,
    completion,
    status,
    is_free: isFree,
    is_featured: isFeatured,
    price_cents: priceCents,
    preview_percent: previewPercent,
    preview_min: previewMin,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  let storyId = id;
  if (id) {
    const { error } = await supabase.from("stories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("stories")
      .insert(payload)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    storyId = data!.id;
  }

  await supabase.from("story_tags").delete().eq("story_id", storyId);
  if (tagIds.length > 0) {
    await supabase
      .from("story_tags")
      .insert(tagIds.map((tag_id) => ({ story_id: storyId, tag_id })));
  }

  revalidatePublic(slug);
  if (!id) redirect(`/admin/historias/${storyId}`);
}

export async function deleteStory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("stories").delete().eq("id", id);
  revalidatePublic();
  redirect("/admin/historias");
}

export async function setStoryStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as StoryStatus;
  if (!id || !status) return;
  await supabase
    .from("stories")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePublic(String(formData.get("slug") ?? ""));
}

export async function toggleStoryFlag(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = bool(formData.get("value"));
  if (!id || (field !== "is_featured" && field !== "is_free")) return;
  const patch = field === "is_featured" ? { is_featured: value } : { is_free: value };
  await supabase.from("stories").update(patch).eq("id", id);
  revalidatePublic(String(formData.get("slug") ?? ""));
}

export async function upsertChapter(formData: FormData) {
  const supabase = await requireAdmin();
  const storyId = String(formData.get("story_id") ?? "");
  const id = String(formData.get("id") ?? "").trim();
  const number = Number.parseInt(String(formData.get("number") ?? ""), 10);
  const title = String(formData.get("title") ?? "").trim();
  const isFree = bool(formData.get("is_free"));
  const isPublished = bool(formData.get("is_published"));
  const priceCents = isFree ? null : mtToCents(String(formData.get("price") ?? ""));

  if (!storyId || !title || !Number.isFinite(number)) {
    throw new Error("Número e título do capítulo são obrigatórios.");
  }

  const payload = {
    story_id: storyId,
    number,
    title,
    is_free: isFree,
    is_published: isPublished,
    price_cents: priceCents,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await supabase.from("chapters").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("chapters").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath(`/historias`);
  revalidatePath("/ler", "layout");
}

export async function deleteChapter(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const storyId = String(formData.get("story_id") ?? "");
  if (id) await supabase.from("chapters").delete().eq("id", id);
  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath("/ler", "layout");
}

export async function saveChapterContent(formData: FormData) {
  const supabase = await requireAdmin();
  const chapterId = String(formData.get("chapter_id") ?? "");
  const storyId = String(formData.get("story_id") ?? "");
  const content = String(formData.get("content") ?? "");
  if (!chapterId) return;

  const { error } = await supabase
    .from("chapter_contents")
    .upsert(
      { chapter_id: chapterId, content, updated_at: new Date().toISOString() },
      { onConflict: "chapter_id" },
    );
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath("/ler", "layout");
}

export async function moveChapter(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const storyId = String(formData.get("story_id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !storyId || (direction !== "up" && direction !== "down")) return;

  const { data } = await supabase
    .from("chapters")
    .select("id,number")
    .eq("story_id", storyId)
    .order("number");
  const chapters = (data ?? []) as { id: string; number: number }[];
  const index = chapters.findIndex((c) => c.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= chapters.length) return;

  const current = chapters[index];
  const other = chapters[swapIndex];
  const temp = 100000 + current.number;

  await supabase.from("chapters").update({ number: temp }).eq("id", current.id);
  await supabase.from("chapters").update({ number: current.number }).eq("id", other.id);
  await supabase.from("chapters").update({ number: other.number }).eq("id", current.id);

  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath("/ler", "layout");
}

export async function upsertCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const icon = String(formData.get("icon") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const isActive = bool(formData.get("is_active"));
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);

  if (!name) throw new Error("Nome é obrigatório.");
  const payload = { name, slug, description, icon, color, sort_order: sortOrder, is_active: isActive };

  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
}

export async function upsertTag(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  if (!name) throw new Error("Nome é obrigatório.");

  if (id) await supabase.from("tags").update({ name, slug }).eq("id", id);
  else await supabase.from("tags").insert({ name, slug });

  revalidatePath("/admin/tags");
}

export async function deleteTag(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
}

export async function updateUserRole(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;
  if (!id || !["reader", "author", "admin"].includes(role)) return;
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/utilizadores");
}

export async function setAuthorApproval(formData: FormData) {
  const supabase = await requireAdmin();
  const profileId = String(formData.get("profile_id") ?? "");
  const approved = bool(formData.get("approved"));
  if (!profileId) return;
  await supabase.from("authors").update({ is_approved: approved }).eq("profile_id", profileId);
  revalidatePath("/admin/autores");
}

export async function toggleCommentHidden(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const hidden = bool(formData.get("hidden"));
  if (!id) return;
  await supabase.from("comments").update({ is_hidden: hidden }).eq("id", id);
  revalidatePath("/admin/comentarios");
}

export async function deleteComment(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("comments").delete().eq("id", id);
  revalidatePath("/admin/comentarios");
}

export async function updateReportStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ReportStatus;
  if (!id || !["open", "reviewing", "resolved", "dismissed"].includes(status)) return;
  await supabase.from("reports").update({ status }).eq("id", id);
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}

export async function upsertBanner(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const linkUrl = String(formData.get("link_url") ?? "").trim() || null;
  const position = String(formData.get("position") ?? "home_strip").trim() || "home_strip";
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const isActive = bool(formData.get("is_active"));
  const startsAt = String(formData.get("starts_at") ?? "").trim() || null;
  const endsAt = String(formData.get("ends_at") ?? "").trim() || null;

  if (!title || !imageUrl) throw new Error("Título e imagem são obrigatórios.");
  const payload = {
    title,
    subtitle,
    image_url: imageUrl,
    link_url: linkUrl,
    position,
    sort_order: sortOrder,
    is_active: isActive,
    starts_at: startsAt,
    ends_at: endsAt,
  };

  if (id) await supabase.from("banners").update(payload).eq("id", id);
  else await supabase.from("banners").insert(payload);

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

const CHARACTER_ROLES = ["protagonista", "coprotagonista", "antagonista", "secundario"] as const;

export async function upsertCharacter(formData: FormData) {
  const supabase = await requireAdmin();

  const storyId = String(formData.get("story_id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const roleInput = String(formData.get("role") ?? "secundario");
  const role = (CHARACTER_ROLES as readonly string[]).includes(roleInput) ? roleInput : "secundario";

  if (!storyId || !name) throw new Error("Nome do personagem é obrigatório.");

  const age = String(formData.get("age") ?? "").trim() || null;
  const occupation = String(formData.get("occupation") ?? "").trim() || null;
  const appearance = String(formData.get("appearance") ?? "").trim() || null;
  const personality = String(formData.get("personality") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const portraitPrompt = String(formData.get("portrait_prompt") ?? "").trim() || null;
  const sortOrder = clampInt(formData.get("sort_order"), 0, 9999, 0);
  const isPublic = bool(formData.get("is_public"));

  let portraitUrl = String(formData.get("portrait_url") ?? "").trim() || null;

  const file = formData.get("portrait");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("O retrato não pode exceder 5 MB.");
    }
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const path = `${storyId}/${id || "novo"}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("portraits")
      .upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (uploadError) throw new Error(`Falha no upload do retrato: ${uploadError.message}`);
    const { data: pub } = supabase.storage.from("portraits").getPublicUrl(path);
    portraitUrl = pub.publicUrl;
  }

  const payload = {
    story_id: storyId,
    name,
    role,
    age,
    occupation,
    appearance,
    personality,
    bio,
    portrait_url: portraitUrl,
    portrait_prompt: portraitPrompt,
    sort_order: sortOrder,
    is_public: isPublic,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("characters").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("characters").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath(`/admin/historias/${storyId}/personagens`);
  if (slug) revalidatePath(`/historias/${slug}`);
}

export async function deleteCharacter(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const storyId = String(formData.get("story_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (id) await supabase.from("characters").delete().eq("id", id);
  revalidatePath(`/admin/historias/${storyId}`);
  revalidatePath(`/admin/historias/${storyId}/personagens`);
  if (slug) revalidatePath(`/historias/${slug}`);
}

export async function updateSetting(formData: FormData) {
  const supabase = await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const raw = String(formData.get("value") ?? "");
  if (!key) return;

  let value: unknown = raw;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }

  await supabase
    .from("settings")
    .update({ value: value as never, updated_at: new Date().toISOString() })
    .eq("key", key);
  revalidatePath("/admin/definicoes");
}
