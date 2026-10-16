import { cache } from "react";
import { createClient, getAuthContext, getCurrentProfile } from "@/lib/supabase/server";
import { previewChapterLimit } from "@/lib/preview";
import type { Database } from "@/types/database";

type Enums = Database["public"]["Enums"];

export type StoryCard = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
  readsCount: number;
  isFree: boolean;
  isFeatured: boolean;
  priceCents: number | null;
  completion: Enums["story_completion"];
  publishedAt: string | null;
  authorName: string;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
};

export type ChapterSummary = {
  id: string;
  number: number;
  title: string;
  isFree: boolean;
  readsCount: number;
  locked: boolean;
};

export type StoryDetail = {
  story: StoryCard;
  authorId: string;
  authorBio: string | null;
  authorAvatar: string | null;
  categoryId: string | null;
  updatedAt: string;
  chapters: ChapterSummary[];
  progress: { chapterNumber: number; percent: number; completed: boolean } | null;
  isOwner: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  ownsStory: boolean;
  previewLimit: number;
  publishedCount: number;
  related: StoryCard[];
};

export type CategoryWithCount = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  storyCount: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
};

export type SortKey = "novidades" | "mais-lidas" | "rating" | "titulo";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "novidades", label: "Novidades" },
  { value: "mais-lidas", label: "Mais lidas" },
  { value: "rating", label: "Melhor avaliadas" },
  { value: "titulo", label: "Título (A-Z)" },
];

export function normalizeSort(value: string | undefined): SortKey {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "novidades";
}

const CARD_SELECT = [
  "id",
  "slug",
  "title",
  "synopsis",
  "cover_url",
  "rating_avg",
  "rating_count",
  "reads_count",
  "is_free",
  "is_featured",
  "price_cents",
  "completion",
  "published_at",
  "author:profiles!stories_author_id_fkey(name,authors(pen_name))",
  "category:categories(name,slug)",
  "tags(name,slug)",
].join(",");

type CardRow = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  cover_url: string | null;
  rating_avg: number;
  rating_count: number;
  reads_count: number;
  is_free: boolean;
  is_featured: boolean;
  price_cents: number | null;
  completion: Enums["story_completion"];
  published_at: string | null;
  author: { name: string; authors: { pen_name: string | null } | null } | null;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[] | null;
};

/**
 * Nome público do autor: usa o pseudónimo (`authors.pen_name`) quando existe,
 * caindo para o nome interno do perfil. O nome interno (profiles.name) fica
 * reservado à área de administração e nunca deve ser exposto publicamente.
 */
export function publicAuthorName(
  author: { name: string; authors?: { pen_name: string | null } | null } | null | undefined,
  fallback = "Autor desconhecido",
): string {
  return author?.authors?.pen_name || author?.name || fallback;
}

function mapCard(row: CardRow): StoryCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    synopsis: row.synopsis,
    coverUrl: row.cover_url,
    ratingAvg: row.rating_avg,
    ratingCount: row.rating_count,
    readsCount: row.reads_count,
    isFree: row.is_free,
    isFeatured: row.is_featured,
    priceCents: row.price_cents ?? null,
    completion: row.completion,
    publishedAt: row.published_at,
    authorName: publicAuthorName(row.author),
    category: row.category ?? null,
    tags: row.tags ?? [],
  };
}

export type ListStoriesOptions = {
  categorySlug?: string;
  tagSlug?: string;
  freeOnly?: boolean;
  completion?: Enums["story_completion"];
  sort?: SortKey;
  page?: number;
  pageSize?: number;
};

export const STORY_PAGE_SIZE = 12;

export async function listStories(
  options: ListStoriesOptions = {},
): Promise<{ items: StoryCard[]; total: number }> {
  const {
    categorySlug,
    tagSlug,
    freeOnly,
    completion,
    sort = "novidades",
    page = 1,
    pageSize = STORY_PAGE_SIZE,
  } = options;

  const supabase = await createClient();

  let categoryId: string | undefined;
  if (categorySlug) {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .maybeSingle();
    if (!data) return { items: [], total: 0 };
    categoryId = data.id;
  }

  let storyIds: string[] | undefined;
  if (tagSlug) {
    const { data: tag } = await supabase.from("tags").select("id").eq("slug", tagSlug).maybeSingle();
    if (!tag) return { items: [], total: 0 };
    const { data: links } = await supabase.from("story_tags").select("story_id").eq("tag_id", tag.id);
    storyIds = (links ?? []).map((l) => l.story_id);
    if (storyIds.length === 0) return { items: [], total: 0 };
  }

  let query = supabase
    .from("stories")
    .select(CARD_SELECT, { count: "exact" })
    .eq("status", "published");

  if (categoryId) query = query.eq("category_id", categoryId);
  if (storyIds) query = query.in("id", storyIds);
  if (freeOnly) query = query.eq("is_free", true);
  if (completion) query = query.eq("completion", completion);

  const ordered =
    sort === "rating"
      ? query
          .order("rating_avg", { ascending: false })
          .order("rating_count", { ascending: false })
          .order("title", { ascending: true })
      : sort === "mais-lidas"
        ? query
            .order("reads_count", { ascending: false })
            .order("title", { ascending: true })
        : sort === "titulo"
          ? query.order("title", { ascending: true })
          : query
              .order("published_at", { ascending: false })
              .order("created_at", { ascending: false });

  const from = (Math.max(1, page) - 1) * pageSize;
  const { data, count, error } = await ordered.range(from, from + pageSize - 1);

  if (error) {
    if (error.code === "PGRST103") {
      // Página além do fim dos resultados — devolve só a contagem real.
      let recount = supabase
        .from("stories")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
      if (categoryId) recount = recount.eq("category_id", categoryId);
      if (storyIds) recount = recount.in("id", storyIds);
      if (freeOnly) recount = recount.eq("is_free", true);
      if (completion) recount = recount.eq("completion", completion);
      const { count: exact } = await recount;
      return { items: [], total: exact ?? 0 };
    }
    console.error("[listStories]", error.message);
    return { items: [], total: 0 };
  }

  return { items: ((data ?? []) as unknown as CardRow[]).map(mapCard), total: count ?? 0 };
}

export async function getStoriesByIds(ids: string[]): Promise<StoryCard[]> {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(CARD_SELECT)
    .eq("status", "published")
    .in("id", unique);

  if (error) {
    console.error("[getStoriesByIds]", error.message);
    return [];
  }

  const byId = new Map(((data ?? []) as unknown as CardRow[]).map((r) => [r.id, mapCard(r)]));
  return ids.map((id) => byId.get(id)).filter((s): s is StoryCard => Boolean(s));
}

export async function searchStories(
  q: string,
  sort: SortKey,
  page: number,
  pageSize: number = STORY_PAGE_SIZE,
): Promise<{ items: StoryCard[]; total: number }> {
  const trimmed = q.trim();
  if (!trimmed) return { items: [], total: 0 };

  const supabase = await createClient();
  const { data: matches, error } = await supabase.rpc("search_stories", {
    p_query: trimmed,
    p_limit: 60,
    p_offset: 0,
  });

  if (error) {
    console.error("[searchStories]", error.message);
    return { items: [], total: 0 };
  }

  const ids = (matches ?? []).map((m) => m.id);
  if (ids.length === 0) return { items: [], total: 0 };

  let items = await getStoriesByIds(ids);

  if (sort === "rating") {
    items = [...items].sort(
      (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
    );
  } else if (sort === "mais-lidas") {
    items = [...items].sort((a, b) => b.readsCount - a.readsCount);
  } else if (sort === "titulo") {
    items = [...items].sort((a, b) => a.title.localeCompare(b.title, "pt"));
  }
  // "novidades" mantém a ordem do motor de pesquisa (mais relevante primeiro)

  const from = (Math.max(1, page) - 1) * pageSize;
  return { items: items.slice(from, from + pageSize), total: items.length };
}

type DetailRow = CardRow & {
  author_id: string;
  category_id: string | null;
  updated_at: string;
  preview_percent: number | null;
  preview_min: number | null;
  author: {
    name: string;
    bio: string | null;
    avatar_url: string | null;
    authors: { pen_name: string | null } | null;
  } | null;
};

const DETAIL_SELECT = [
  "id",
  "slug",
  "title",
  "synopsis",
  "cover_url",
  "rating_avg",
  "rating_count",
  "reads_count",
  "is_free",
  "is_featured",
  "price_cents",
  "preview_percent",
  "preview_min",
  "completion",
  "published_at",
  "author_id",
  "category_id",
  "updated_at",
  "author:profiles!stories_author_id_fkey(name,bio,avatar_url,authors(pen_name))",
  "category:categories(name,slug)",
  "tags(name,slug)",
].join(",");

export const getStoryBySlug = cache(async (slug: string): Promise<StoryDetail | null> => {
  const { supabase, userId } = await getAuthContext();

  const { data, error } = await supabase
    .from("stories")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[getStoryBySlug]", error.message);
    return null;
  }
  if (!data) return null;
  const row = data as unknown as DetailRow;

  const [chaptersRes, progressRes, relatedRes, purchasesRes, profile] = await Promise.all([
    supabase
      .from("chapters")
      .select("id,number,title,is_free,reads_count")
      .eq("story_id", row.id)
      .eq("is_published", true)
      .order("number"),
    userId
      ? supabase
          .from("reading_progress")
          .select("chapter_number,progress,completed")
          .eq("story_id", row.id)
          .eq("user_id", userId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    row.category_id
      ? supabase
          .from("stories")
          .select(CARD_SELECT)
          .eq("status", "published")
          .eq("category_id", row.category_id)
          .neq("id", row.id)
          .order("rating_avg", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: null }),
    userId
      ? supabase
          .from("purchases")
          .select("chapter_id,kind")
          .eq("user_id", userId)
          .eq("story_id", row.id)
          .eq("status", "completed")
      : Promise.resolve({ data: null }),
    getCurrentProfile(),
  ]);

  const isOwner = Boolean(userId && userId === row.author_id);
  const isAdmin = profile?.role === "admin";
  const purchaseRows = (purchasesRes.data ?? []) as {
    chapter_id: string | null;
    kind: string;
  }[];
  const purchasedStory = purchaseRows.some((p) => p.kind === "story" && !p.chapter_id);
  const purchasedChapters = new Set(
    purchaseRows.filter((p) => p.kind === "chapter" && p.chapter_id).map((p) => p.chapter_id!),
  );

  const publishedCount = (chaptersRes.data ?? []).length;
  const previewLimit = previewChapterLimit({
    publishedCount,
    isFree: row.is_free,
    previewPercent: row.preview_percent,
    previewMin: row.preview_min,
  });

  const chapters: ChapterSummary[] = ((chaptersRes.data ?? []) as {
    id: string;
    number: number;
    title: string;
    is_free: boolean;
    reads_count: number;
  }[]).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title,
    isFree: ch.is_free,
    readsCount: ch.reads_count,
    locked:
      !row.is_free &&
      !ch.is_free &&
      !isOwner &&
      !isAdmin &&
      !purchasedStory &&
      !purchasedChapters.has(ch.id) &&
      ch.number > previewLimit,
  }));

  const related = ((relatedRes.data ?? []) as unknown as CardRow[]).map(mapCard);

  const progressData = progressRes.data as {
    chapter_number: number;
    progress: number;
    completed: boolean;
  } | null;

  return {
    story: mapCard(row),
    authorId: row.author_id,
    authorBio: row.author?.bio ?? null,
    authorAvatar: row.author?.avatar_url ?? null,
    categoryId: row.category_id,
    updatedAt: row.updated_at,
    chapters,
    progress: progressData
      ? {
          chapterNumber: progressData.chapter_number,
          percent: Math.max(0, Math.min(100, Math.round(progressData.progress))),
          completed: progressData.completed,
        }
      : null,
    isOwner,
    isAdmin,
    isAuthenticated: Boolean(userId),
    ownsStory: row.is_free || isOwner || isAdmin || purchasedStory,
    previewLimit,
    publishedCount,
    related,
  };
});

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();
  const [categoriesRes, storiesRes] = await Promise.all([
    supabase
      .from("categories")
      .select("id,slug,name,icon,color,description")
      .eq("is_active", true)
      .order("sort_order"),
    supabase.from("stories").select("category_id").eq("status", "published"),
  ]);

  if (categoriesRes.error) console.error("[getCategoriesWithCounts]", categoriesRes.error.message);

  const counts = new Map<string, number>();
  for (const row of storiesRes.data ?? []) {
    if (row.category_id) counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return (categoriesRes.data ?? []).map((c) => ({
    ...c,
    storyCount: counts.get(c.id) ?? 0,
  }));
}

export type HomeData = {
  featured: StoryCard[];
  banners: Banner[];
  categories: CategoryWithCount[];
  novidades: StoryCard[];
  maisLidas: StoryCard[];
  gratuitas: StoryCard[];
  stats: { stories: number; chapters: number; categories: number };
};

export async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [
    featuredRes,
    bannersRes,
    categories,
    publishedRes,
    chaptersCountRes,
    novidades,
    maisLidas,
    gratuitas,
  ] = await Promise.all([
    supabase
      .from("stories")
      .select(CARD_SELECT)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("reads_count", { ascending: false })
      .limit(2),
    supabase
      .from("banners")
      .select("id,title,subtitle,image_url,link_url,position,starts_at,ends_at")
      .eq("is_active", true)
      .order("sort_order"),
    getCategoriesWithCounts(),
    supabase.from("stories").select("id").eq("status", "published"),
    supabase
      .from("chapters")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    listStories({ sort: "novidades", page: 1, pageSize: 6 }),
    listStories({ sort: "mais-lidas", page: 1, pageSize: 6 }),
    supabase
      .from("stories")
      .select(CARD_SELECT)
      .eq("status", "published")
      .eq("is_free", true)
      .order("rating_avg", { ascending: false })
      .limit(4),
  ]);

  const banners = ((bannersRes.data ?? []) as unknown as {
    id: string;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    position: string;
    starts_at: string | null;
    ends_at: string | null;
  }[])
    .filter((b) => {
      const activeFrom = !b.starts_at || b.starts_at <= now;
      const activeUntil = !b.ends_at || b.ends_at >= now;
      return activeFrom && activeUntil;
    })
    .map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.image_url,
      linkUrl: b.link_url,
      position: b.position,
    }));

  return {
    featured: ((featuredRes.data ?? []) as unknown as CardRow[]).map(mapCard),
    banners,
    categories,
    novidades: novidades.items,
    maisLidas: maisLidas.items,
    gratuitas: ((gratuitas.data ?? []) as unknown as CardRow[]).map(mapCard),
    stats: {
      stories: publishedRes.data?.length ?? 0,
      chapters: chaptersCountRes.count ?? 0,
      categories: categories.length,
    },
  };
}
