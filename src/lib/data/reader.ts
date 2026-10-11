import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type ReaderChapterLink = {
  number: number;
  title: string;
  isFree: boolean;
  locked: boolean;
};

export type ReaderChapter = {
  story: {
    id: string;
    slug: string;
    title: string;
    isFree: boolean;
    coverUrl: string | null;
    authorId: string;
    authorName: string;
    priceCents: number | null;
    category: { name: string; slug: string } | null;
  };
  chapter: {
    id: string;
    number: number;
    title: string;
    isFree: boolean;
    priceCents: number | null;
    readsCount: number;
    publishedAt: string | null;
  };
  content: string | null;
  locked: boolean;
  isAuthenticated: boolean;
  prevNumber: number | null;
  nextNumber: number | null;
  chapters: ReaderChapterLink[];
  progress: { chapterNumber: number; percent: number } | null;
};

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  is_free: boolean;
  cover_url: string | null;
  author_id: string;
  price_cents: number | null;
  author: { name: string } | null;
  category: { name: string; slug: string } | null;
};

export const getReaderChapter = cache(
  async (slug: string, number: number): Promise<ReaderChapter | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .select(
        "id,slug,title,is_free,cover_url,author_id,price_cents,author:profiles!stories_author_id_fkey(name),category:categories(name,slug)",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (storyError) {
      console.error("[getReaderChapter] story", storyError.message);
      return null;
    }
    if (!storyData) return null;
    const story = storyData as unknown as StoryRow;

    const { data: chaptersData, error: chaptersError } = await supabase
      .from("chapters")
      .select("id,number,title,is_free,price_cents,reads_count,published_at")
      .eq("story_id", story.id)
      .eq("is_published", true)
      .order("number");

    if (chaptersError) {
      console.error("[getReaderChapter] chapters", chaptersError.message);
      return null;
    }
    const chapterRows = (chaptersData ?? []) as {
      id: string;
      number: number;
      title: string;
      is_free: boolean;
      price_cents: number | null;
      reads_count: number;
      published_at: string | null;
    }[];

    const current = chapterRows.find((c) => c.number === number);
    if (!current) return null;

    const [profileRes, purchasesRes, progressRes] = await Promise.all([
      user
        ? supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("purchases")
            .select("chapter_id,kind")
            .eq("user_id", user.id)
            .eq("story_id", story.id)
            .eq("status", "completed")
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("reading_progress")
            .select("chapter_number,progress")
            .eq("story_id", story.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const isOwner = Boolean(user && user.id === story.author_id);
    const isAdmin = (profileRes.data as { role?: string } | null)?.role === "admin";
    const purchaseRows = (purchasesRes.data ?? []) as {
      chapter_id: string | null;
      kind: string;
    }[];
    const purchasedStory = purchaseRows.some((p) => p.kind === "story" && !p.chapter_id);
    const purchasedChapters = new Set(
      purchaseRows.filter((p) => p.kind === "chapter" && p.chapter_id).map((p) => p.chapter_id!),
    );

    const entitled = (ch: { id: string; is_free: boolean }) =>
      story.is_free ||
      ch.is_free ||
      isOwner ||
      isAdmin ||
      purchasedStory ||
      purchasedChapters.has(ch.id);

    const locked = !entitled(current);

    let content: string | null = null;
    if (!locked) {
      const { data: contentRow, error: contentError } = await supabase
        .from("chapter_contents")
        .select("content")
        .eq("chapter_id", current.id)
        .maybeSingle();
      if (contentError) console.error("[getReaderChapter] content", contentError.message);
      content = contentRow?.content ?? null;
    }

    const index = chapterRows.findIndex((c) => c.id === current.id);

    const progressData = progressRes.data as {
      chapter_number: number;
      progress: number;
    } | null;

    return {
      story: {
        id: story.id,
        slug: story.slug,
        title: story.title,
        isFree: story.is_free,
        coverUrl: story.cover_url,
        authorId: story.author_id,
        authorName: story.author?.name ?? "Autor",
        priceCents: story.price_cents,
        category: story.category,
      },
      chapter: {
        id: current.id,
        number: current.number,
        title: current.title,
        isFree: current.is_free,
        priceCents: current.price_cents,
        readsCount: current.reads_count,
        publishedAt: current.published_at,
      },
      content: locked ? null : content,
      locked,
      isAuthenticated: Boolean(user),
      prevNumber: index > 0 ? chapterRows[index - 1].number : null,
      nextNumber: index >= 0 && index < chapterRows.length - 1 ? chapterRows[index + 1].number : null,
      chapters: chapterRows.map((c) => ({
        number: c.number,
        title: c.title,
        isFree: c.is_free,
        locked: !entitled(c),
      })),
      progress: progressData
        ? {
            chapterNumber: progressData.chapter_number,
            percent: Math.max(0, Math.min(100, Math.round(progressData.progress))),
          }
        : null,
    };
  },
);
