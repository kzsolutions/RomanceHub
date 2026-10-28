import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/site";
import type { Database } from "@/types/database";

export const revalidate = 3600;

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${baseUrl}/explorar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const supabase = createSupabase();
  if (!supabase) return entries;

  try {
    const [storiesRes, categoriesRes, firstChaptersRes] = await Promise.all([
      supabase
        .from("stories")
        .select("id,slug,updated_at")
        .eq("status", "published")
        .order("updated_at", { ascending: false }),
      supabase
        .from("categories")
        .select("slug,created_at")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("chapters")
        .select("story_id,updated_at")
        .eq("is_published", true)
        .eq("number", 1),
    ]);

    if (storiesRes.error) console.error("[sitemap] stories:", storiesRes.error.message);
    if (categoriesRes.error) console.error("[sitemap] categories:", categoriesRes.error.message);
    if (firstChaptersRes.error) console.error("[sitemap] chapters:", firstChaptersRes.error.message);

    const stories = storiesRes.data ?? [];
    const storyById = new Map(stories.map((story) => [story.id, story]));

    for (const story of stories) {
      entries.push({
        url: `${baseUrl}/historias/${story.slug}`,
        lastModified: new Date(story.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const category of categoriesRes.data ?? []) {
      entries.push({
        url: `${baseUrl}/categorias/${category.slug}`,
        lastModified: new Date(category.created_at),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const chapter of firstChaptersRes.data ?? []) {
      const story = storyById.get(chapter.story_id);
      if (!story) continue;

      entries.push({
        url: `${baseUrl}/ler/${story.slug}/1`,
        lastModified: new Date(chapter.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error("[sitemap] failed to load dynamic entries:", error);
  }

  return entries;
}
