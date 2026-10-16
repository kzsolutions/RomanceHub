import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Enums = Database["public"]["Enums"];
export type StoryStatus = Enums["story_status"];
export type UserRole = Enums["user_role"];
export type ReportStatus = Enums["report_status"];
export type ReportTarget = Enums["report_target"];

export const PAGE_SIZE = 20;

export type AdminStats = {
  stories: number;
  published: number;
  drafts: number;
  pending: number;
  users: number;
  authors: number;
  chapters: number;
  comments: number;
  ratings: number;
  reads: number;
  favorites: number;
  purchases: number;
  revenueCents: number;
  openReports: number;
  pendingAuthors: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  const [
    storiesRes,
    profilesRes,
    authorsRes,
    chaptersRes,
    commentsRes,
    ratingsRes,
    favoritesRes,
    reportsRes,
    pendingAuthorsRes,
    purchasesRes,
  ] = await Promise.all([
    supabase.from("stories").select("status,reads_count"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("authors").select("profile_id", { count: "exact", head: true }),
    supabase.from("chapters").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("ratings").select("id", { count: "exact", head: true }),
    supabase.from("favorites").select("user_id", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("authors")
      .select("profile_id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase.from("purchases").select("price_cents,status").eq("status", "completed"),
  ]);

  const storyRows = (storiesRes.data ?? []) as { status: StoryStatus; reads_count: number }[];
  const purchases = (purchasesRes.data ?? []) as { price_cents: number }[];

  return {
    stories: storyRows.length,
    published: storyRows.filter((s) => s.status === "published").length,
    drafts: storyRows.filter((s) => s.status === "draft").length,
    pending: storyRows.filter((s) => s.status === "pending").length,
    users: profilesRes.count ?? 0,
    authors: authorsRes.count ?? 0,
    chapters: chaptersRes.count ?? 0,
    comments: commentsRes.count ?? 0,
    ratings: ratingsRes.count ?? 0,
    favorites: favoritesRes.count ?? 0,
    reads: storyRows.reduce((sum, s) => sum + s.reads_count, 0),
    purchases: purchases.length,
    revenueCents: purchases.reduce((sum, p) => sum + p.price_cents, 0),
    openReports: reportsRes.count ?? 0,
    pendingAuthors: pendingAuthorsRes.count ?? 0,
  };
}

export type AdminCharts = {
  topStories: { title: string; reads: number }[];
  ratingsDistribution: { rating: number; count: number }[];
  signups: { month: string; count: number }[];
};

export async function getAdminCharts(): Promise<AdminCharts> {
  const supabase = await createClient();
  const [topRes, ratingsRes, profilesRes] = await Promise.all([
    supabase
      .from("stories")
      .select("title,reads_count")
      .eq("status", "published")
      .order("reads_count", { ascending: false })
      .limit(8),
    supabase.from("ratings").select("rating"),
    supabase.from("profiles").select("created_at"),
  ]);

  const topStories = ((topRes.data ?? []) as { title: string; reads_count: number }[]).map((s) => ({
    title: s.title.length > 22 ? `${s.title.slice(0, 21)}…` : s.title,
    reads: s.reads_count,
  }));

  const histogram = new Map<number, number>([1, 2, 3, 4, 5].map((r) => [r, 0]));
  for (const row of (ratingsRes.data ?? []) as { rating: number }[]) {
    histogram.set(row.rating, (histogram.get(row.rating) ?? 0) + 1);
  }
  const ratingsDistribution = [...histogram.entries()]
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => b.rating - a.rating);

  const months = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0);
  }
  for (const row of (profilesRes.data ?? []) as { created_at: string }[]) {
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (months.has(key)) months.set(key, (months.get(key) ?? 0) + 1);
  }
  const signups = [...months.entries()].map(([month, count]) => ({ month, count }));

  return { topStories, ratingsDistribution, signups };
}

export type AdminStoryRow = {
  id: string;
  title: string;
  slug: string;
  status: StoryStatus;
  isFeatured: boolean;
  isFree: boolean;
  completion: Enums["story_completion"];
  readsCount: number;
  ratingAvg: number;
  ratingCount: number;
  updatedAt: string;
  authorName: string;
  categoryName: string | null;
};

export async function getAdminStories(filters: {
  q?: string;
  status?: StoryStatus | "all";
  categoryId?: string;
  page?: number;
}): Promise<{ items: AdminStoryRow[]; total: number }> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("stories")
    .select(
      "id,title,slug,status,is_featured,is_free,completion,reads_count,rating_avg,rating_count,updated_at,author:profiles!stories_author_id_fkey(name),category:categories(name)",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false });

  if (filters.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);

  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) {
    console.error("[getAdminStories]", error.message);
    return { items: [], total: 0 };
  }

  const items: AdminStoryRow[] = ((data ?? []) as unknown as {
    id: string;
    title: string;
    slug: string;
    status: StoryStatus;
    is_featured: boolean;
    is_free: boolean;
    completion: Enums["story_completion"];
    reads_count: number;
    rating_avg: number;
    rating_count: number;
    updated_at: string;
    author: { name: string } | null;
    category: { name: string } | null;
  }[]).map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    status: s.status,
    isFeatured: s.is_featured,
    isFree: s.is_free,
    completion: s.completion,
    readsCount: s.reads_count,
    ratingAvg: s.rating_avg,
    ratingCount: s.rating_count,
    updatedAt: s.updated_at,
    authorName: s.author?.name ?? "—",
    categoryName: s.category?.name ?? null,
  }));

  return { items, total: count ?? 0 };
}

export type AdminChapterRow = {
  id: string;
  number: number;
  title: string;
  isFree: boolean;
  isPublished: boolean;
  readsCount: number;
  priceCents: number | null;
  hasContent: boolean;
};

export type AdminStoryDetail = {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  status: StoryStatus;
  completion: Enums["story_completion"];
  isFree: boolean;
  isFeatured: boolean;
  priceCents: number | null;
  previewPercent: number;
  previewMin: number;
  coverUrl: string | null;
  categoryId: string | null;
  authorId: string;
  readsCount: number;
  ratingAvg: number;
  ratingCount: number;
  tagIds: string[];
  chapters: AdminChapterRow[];
};

export async function getAdminStory(id: string): Promise<AdminStoryDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id,title,slug,synopsis,status,completion,is_free,is_featured,price_cents,preview_percent,preview_min,cover_url,category_id,author_id,reads_count,rating_avg,rating_count",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getAdminStory]", error.message);
    return null;
  }
  if (!data) return null;

  const [chaptersRes, tagsRes] = await Promise.all([
    supabase
      .from("chapters")
      .select("id,number,title,is_free,is_published,price_cents,reads_count,chapter_contents(chapter_id)")
      .eq("story_id", id)
      .order("number"),
    supabase.from("story_tags").select("tag_id").eq("story_id", id),
  ]);

  const chapters: AdminChapterRow[] = ((chaptersRes.data ?? []) as unknown as {
    id: string;
    number: number;
    title: string;
    is_free: boolean;
    is_published: boolean;
    reads_count: number;
    price_cents: number | null;
    chapter_contents: { chapter_id: string } | { chapter_id: string }[] | null;
  }[]).map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    isFree: c.is_free,
    isPublished: c.is_published,
    readsCount: c.reads_count,
    priceCents: c.price_cents ?? null,
    hasContent: Array.isArray(c.chapter_contents)
      ? c.chapter_contents.length > 0
      : Boolean(c.chapter_contents),
  }));

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    synopsis: data.synopsis,
    status: data.status,
    completion: data.completion,
    isFree: data.is_free,
    isFeatured: data.is_featured,
    priceCents: data.price_cents ?? null,
    previewPercent: data.preview_percent ?? 50,
    previewMin: data.preview_min ?? 3,
    coverUrl: data.cover_url,
    categoryId: data.category_id,
    authorId: data.author_id,
    readsCount: data.reads_count,
    ratingAvg: data.rating_avg,
    ratingCount: data.rating_count,
    tagIds: (tagsRes.data ?? []).map((t) => t.tag_id),
    chapters,
  };
}

export async function getAdminChapterContent(chapterId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapter_contents")
    .select("content")
    .eq("chapter_id", chapterId)
    .maybeSingle();
  return data?.content ?? "";
}

export type AdminChapterDetail = {
  id: string;
  storyId: string;
  storyTitle: string;
  storySlug: string;
  number: number;
  title: string;
  isFree: boolean;
  isPublished: boolean;
  priceCents: number | null;
  readsCount: number;
  content: string;
};

export async function getAdminChapter(id: string): Promise<AdminChapterDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("id,story_id,number,title,is_free,is_published,price_cents,reads_count,story:stories(title,slug)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getAdminChapter]", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    story_id: string;
    number: number;
    title: string;
    is_free: boolean;
    is_published: boolean;
    price_cents: number | null;
    reads_count: number;
    story: { title: string; slug: string } | null;
  };

  return {
    id: row.id,
    storyId: row.story_id,
    storyTitle: row.story?.title ?? "—",
    storySlug: row.story?.slug ?? "",
    number: row.number,
    title: row.title,
    isFree: row.is_free,
    isPublished: row.is_published,
    priceCents: row.price_cents ?? null,
    readsCount: row.reads_count,
    content: await getAdminChapterContent(id),
  };
}

export async function getAdminCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,icon,color,sort_order,is_active")
    .order("sort_order");
  if (error) {
    console.error("[getAdminCategories]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAdminTags() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("id,slug,name").order("name");
  if (error) {
    console.error("[getAdminTags]", error.message);
    return [];
  }
  return data ?? [];
}

export type AdminUserRow = {
  id: string;
  name: string;
  role: UserRole;
  createdAt: string;
  storyCount: number;
};

export async function getAdminUsers(filters: { q?: string; role?: UserRole | "all"; page?: number }): Promise<{
  items: AdminUserRow[];
  total: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("profiles")
    .select("id,name,role,created_at,stories!stories_author_id_fkey(count)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.q) query = query.ilike("name", `%${filters.q}%`);
  if (filters.role && filters.role !== "all") query = query.eq("role", filters.role);

  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) {
    console.error("[getAdminUsers]", error.message);
    return { items: [], total: 0 };
  }

  const items: AdminUserRow[] = ((data ?? []) as unknown as {
    id: string;
    name: string;
    role: UserRole;
    created_at: string;
    stories: { count: number }[] | null;
  }[]).map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    createdAt: u.created_at,
    storyCount: u.stories?.[0]?.count ?? 0,
  }));

  return { items, total: count ?? 0 };
}

export type AdminAuthorRow = {
  profileId: string;
  name: string;
  penName: string | null;
  website: string | null;
  isApproved: boolean;
  createdAt: string;
  storyCount: number;
};

export async function getAdminAuthors(): Promise<AdminAuthorRow[]> {
  const supabase = await createClient();
  const [authorsRes, storiesRes] = await Promise.all([
    supabase
      .from("authors")
      .select("profile_id,pen_name,website,is_approved,created_at,profile:profiles!authors_profile_id_fkey(name)")
      .order("created_at", { ascending: false }),
    supabase.from("stories").select("author_id"),
  ]);

  if (authorsRes.error) {
    console.error("[getAdminAuthors]", authorsRes.error.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of (storiesRes.data ?? []) as { author_id: string }[]) {
    counts.set(row.author_id, (counts.get(row.author_id) ?? 0) + 1);
  }

  return ((authorsRes.data ?? []) as unknown as {
    profile_id: string;
    pen_name: string | null;
    website: string | null;
    is_approved: boolean;
    created_at: string;
    profile: { name: string } | null;
  }[]).map((a) => ({
    profileId: a.profile_id,
    name: a.profile?.name ?? "—",
    penName: a.pen_name,
    website: a.website,
    isApproved: a.is_approved,
    createdAt: a.created_at,
    storyCount: counts.get(a.profile_id) ?? 0,
  }));
}

export type AdminCommentRow = {
  id: string;
  content: string;
  createdAt: string;
  isHidden: boolean;
  userName: string;
  storyTitle: string | null;
  storySlug: string | null;
};

export async function getAdminComments(filters: { hidden?: boolean | "all"; page?: number }): Promise<{
  items: AdminCommentRow[];
  total: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("comments")
    .select(
      "id,content,created_at,is_hidden,user:profiles!comments_user_id_fkey(name),story:stories!comments_story_id_fkey(title,slug)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (filters.hidden === true) query = query.eq("is_hidden", true);
  if (filters.hidden === false) query = query.eq("is_hidden", false);

  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) {
    console.error("[getAdminComments]", error.message);
    return { items: [], total: 0 };
  }

  const items: AdminCommentRow[] = ((data ?? []) as unknown as {
    id: string;
    content: string;
    created_at: string;
    is_hidden: boolean;
    user: { name: string } | null;
    story: { title: string; slug: string } | null;
  }[]).map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.created_at,
    isHidden: c.is_hidden,
    userName: c.user?.name ?? "—",
    storyTitle: c.story?.title ?? null,
    storySlug: c.story?.slug ?? null,
  }));

  return { items, total: count ?? 0 };
}

export type AdminReportRow = {
  id: string;
  target: ReportTarget;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  reporterName: string;
  storyTitle: string | null;
  storySlug: string | null;
};

export async function getAdminReports(): Promise<AdminReportRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      "id,target,reason,details,status,created_at,reporter:profiles!reports_reporter_id_fkey(name),story:stories!reports_story_id_fkey(title,slug)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminReports]", error.message);
    return [];
  }

  return ((data ?? []) as unknown as {
    id: string;
    target: ReportTarget;
    reason: string;
    details: string | null;
    status: ReportStatus;
    created_at: string;
    reporter: { name: string } | null;
    story: { title: string; slug: string } | null;
  }[]).map((r) => ({
    id: r.id,
    target: r.target,
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
    reporterName: r.reporter?.name ?? "—",
    storyTitle: r.story?.title ?? null,
    storySlug: r.story?.slug ?? null,
  }));
}

export async function getAdminBanners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id,title,subtitle,image_url,link_url,position,sort_order,is_active,starts_at,ends_at")
    .order("sort_order");
  if (error) {
    console.error("[getAdminBanners]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAdminSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("key,value,description,updated_at")
    .order("key");
  if (error) {
    console.error("[getAdminSettings]", error.message);
    return [];
  }
  return data ?? [];
}
