import { SiteHeader, type HeaderUser } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

async function getCurrentUser(): Promise<HeaderUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, avatar_url, role")
      .eq("id", user.id)
      .maybeSingle();

    const { count: unread } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    return {
      name: profile?.name || user.email?.split("@")[0] || "Leitor",
      avatarUrl: profile?.avatar_url ?? null,
      role: profile?.role ?? "reader",
      unreadCount: unread ?? 0,
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
      <Footer />
    </div>
  );
}
