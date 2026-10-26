import { cache } from "react";
import { getAuthContext, getCurrentProfile } from "@/lib/supabase/server";
import { previewChapterLimit } from "@/lib/preview";
import { guestCanRead, isFreeAccessActive } from "@/lib/access";
import { publicAuthorName } from "@/lib/data/stories";

export type ReaderChapterLink = {
  number: number;
  title: string;
  isFree: boolean;
  locked: boolean;
  requiresAuth: boolean;
};

export type ReaderChapter = {
  story: {
    id: string;
    slug: string;
    title: string;
    isFree: boolean;
    coverUrl: string | null;
    synopsis: string;
    authorId: string;
    authorName: string;
    priceCents: number | null;
    category: { name: string; slug: string } | null;
    publishedCount: number;
    previewLimit: number;
    purchased: boolean;
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
  /** Motivo do bloqueio: sessão em falta ou compra/prévia. */
  lockReason: "auth" | "premium" | null;
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
  synopsis: string;
  author_id: string;
  price_cents: number | null;
  preview_percent: number | null;
  preview_min: number | null;
  author: { name: string; authors: { pen_name: string | null } | null } | null;
  category: { name: string; slug: string } | null;
};

export const getReaderChapter = cache(
  async (slug: string, number: number): Promise<ReaderChapter | null> => {
    const { supabase, userId } = await getAuthContext();

    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .select(
        "id,slug,title,is_free,cover_url,author_id,price_cents,preview_percent,preview_min,synopsis,author:profiles!stories_author_id_fkey(name,authors(pen_name)),category:categories(name,slug)",
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

    const [profile, purchasesRes, progressRes] = await Promise.all([
      getCurrentProfile(),
      userId
        ? supabase
            .from("purchases")
            .select("chapter_id,kind")
            .eq("user_id", userId)
            .eq("story_id", story.id)
            .eq("status", "completed")
        : Promise.resolve({ data: null }),
      userId
        ? supabase
            .from("reading_progress")
            .select("chapter_number,progress")
            .eq("story_id", story.id)
            .eq("user_id", userId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const isOwner = Boolean(userId && userId === story.author_id);
    const isAdmin = profile?.role === "admin";
    const purchaseRows = (purchasesRes.data ?? []) as {
      chapter_id: string | null;
      kind: string;
    }[];
    const purchasedStory = purchaseRows.some((p) => p.kind === "story" && !p.chapter_id);
    const purchasedChapters = new Set(
      purchaseRows.filter((p) => p.kind === "chapter" && p.chapter_id).map((p) => p.chapter_id!),
    );

    const freeAccess = isFreeAccessActive();
    const isGuest = !userId;
    const publishedCount = chapterRows.length;
    const previewLimit = previewChapterLimit({
      publishedCount,
      isFree: story.is_free,
      previewPercent: story.preview_percent,
      previewMin: story.preview_min,
    });

    // Visitantes só podem ler o primeiro capítulo. A regra tem prioridade
    // sobre histórias gratuitas e sobre a janela de acesso livre: o cadastro
    // é obrigatório a partir do segundo capítulo. Para quem tem sessão, tudo
    // continua como antes (acesso livre, compras, prévia, autor/admin).
    const entitled = (ch: { id: string; is_free: boolean; number: number }) =>
      isGuest
        ? guestCanRead(ch.number)
        : freeAccess ||
          story.is_free ||
          ch.is_free ||
          isOwner ||
          isAdmin ||
          purchasedStory ||
          purchasedChapters.has(ch.id) ||
          ch.number <= previewLimit;

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
        isFree: freeAccess || story.is_free,
        coverUrl: story.cover_url,
        synopsis: story.synopsis,
        authorId: story.author_id,
        authorName: publicAuthorName(story.author, "Autor"),
        priceCents: story.price_cents,
        category: story.category,
        publishedCount,
        previewLimit,
        purchased: purchasedStory,
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
      lockReason: locked ? (isGuest ? "auth" : "premium") : null,
      isAuthenticated: Boolean(userId),
      prevNumber: index > 0 ? chapterRows[index - 1].number : null,
      nextNumber: index >= 0 && index < chapterRows.length - 1 ? chapterRows[index + 1].number : null,
      chapters: chapterRows.map((c) => ({
        number: c.number,
        title: c.title,
        isFree: c.is_free,
        locked: !entitled(c),
        requiresAuth: isGuest && !guestCanRead(c.number),
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
