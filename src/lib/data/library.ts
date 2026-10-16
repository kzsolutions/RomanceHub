import { getAuthContext } from "@/lib/supabase/server";
import { getStoriesByIds, type StoryCard } from "@/lib/data/stories";

export type LibraryEntry = {
  story: StoryCard;
  chapterNumber: number;
  percent: number;
  completed: boolean;
  lastReadAt: string;
};

export type LibraryData = {
  continueReading: LibraryEntry[];
  history: LibraryEntry[];
  favorites: { story: StoryCard; addedAt: string }[];
  stats: { reading: number; favorites: number; completed: number };
};

type ProgressRow = {
  story_id: string;
  chapter_number: number;
  progress: number;
  completed: boolean;
  last_read_at: string;
};

export async function getLibrary(): Promise<LibraryData> {
  const empty: LibraryData = {
    continueReading: [],
    history: [],
    favorites: [],
    stats: { reading: 0, favorites: 0, completed: 0 },
  };

  const { supabase, userId } = await getAuthContext();
  if (!userId) return empty;

  const [progressRes, favoritesRes] = await Promise.all([
    supabase
      .from("reading_progress")
      .select("story_id,chapter_number,progress,completed,last_read_at")
      .eq("user_id", userId)
      .order("last_read_at", { ascending: false }),
    supabase
      .from("favorites")
      .select("story_id,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const progressRows = (progressRes.data ?? []) as ProgressRow[];
  const favoriteRows = (favoritesRes.data ?? []) as { story_id: string; created_at: string }[];

  const storyIds = [...progressRows.map((p) => p.story_id), ...favoriteRows.map((f) => f.story_id)];
  const stories = await getStoriesByIds(storyIds);
  const byId = new Map(stories.map((s) => [s.id, s]));

  const entries: LibraryEntry[] = progressRows.flatMap((p) => {
    const story = byId.get(p.story_id);
    if (!story) return [];
    return [
      {
        story,
        chapterNumber: p.chapter_number,
        percent: Math.max(0, Math.min(100, Math.round(p.progress))),
        completed: p.completed,
        lastReadAt: p.last_read_at,
      },
    ];
  });

  const continueReading = entries.filter((e) => !e.completed && e.percent < 100);
  const history = entries;

  const favorites = favoriteRows.flatMap((f) => {
    const story = byId.get(f.story_id);
    return story ? [{ story, addedAt: f.created_at }] : [];
  });

  return {
    continueReading,
    history,
    favorites,
    stats: {
      reading: continueReading.length,
      favorites: favorites.length,
      completed: entries.filter((e) => e.completed).length,
    },
  };
}

export async function getFavoriteStories(): Promise<{ story: StoryCard; addedAt: string }[]> {
  const { supabase, userId } = await getAuthContext();
  if (!userId) return [];

  const { data } = await supabase
    .from("favorites")
    .select("story_id,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as { story_id: string; created_at: string }[];
  const stories = await getStoriesByIds(rows.map((r) => r.story_id));
  const byId = new Map(stories.map((s) => [s.id, s]));

  return rows.flatMap((r) => {
    const story = byId.get(r.story_id);
    return story ? [{ story, addedAt: r.created_at }] : [];
  });
}

export type NotificationItem = {
  id: string;
  type: "system" | "chapter" | "comment" | "promotion";
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export async function getNotifications(): Promise<{
  items: NotificationItem[];
  unread: number;
}> {
  const { supabase, userId } = await getAuthContext();
  if (!userId) return { items: [], unread: 0 };

  const { data, error } = await supabase
    .from("notifications")
    .select("id,type,title,body,link,is_read,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getNotifications]", error.message);
    return { items: [], unread: 0 };
  }

  const items: NotificationItem[] = (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    isRead: n.is_read,
    createdAt: n.created_at,
  }));

  return { items, unread: items.filter((n) => !n.isRead).length };
}

export async function getStorySocialState(storyId: string): Promise<{
  isFavorite: boolean;
  myRating: number | null;
}> {
  const { supabase, userId } = await getAuthContext();
  if (!userId) return { isFavorite: false, myRating: null };

  const [favRes, ratingRes] = await Promise.all([
    supabase
      .from("favorites")
      .select("story_id")
      .eq("user_id", userId)
      .eq("story_id", storyId)
      .maybeSingle(),
    supabase
      .from("ratings")
      .select("rating")
      .eq("user_id", userId)
      .eq("story_id", storyId)
      .maybeSingle(),
  ]);

  return {
    isFavorite: Boolean(favRes.data),
    myRating: ratingRes.data?.rating ?? null,
  };
}
