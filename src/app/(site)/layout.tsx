import { SiteHeader, type HeaderUser } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { getAuthContext, getCurrentProfile } from "@/lib/supabase/server";

async function getCurrentUser(): Promise<HeaderUser | null> {
  try {
    const { supabase, userId } = await getAuthContext();
    if (!userId) return null;

    const [profile, notifications] = await Promise.all([
      getCurrentProfile(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false),
    ]);

    return {
      name: profile?.name || "Leitor",
      avatarUrl: profile?.avatarUrl ?? null,
      role: profile?.role ?? "reader",
      unreadCount: notifications.count ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <Footer user={user} />
    </div>
  );
}
