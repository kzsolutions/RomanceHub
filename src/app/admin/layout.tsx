import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAuthContext, getCurrentProfile } from "@/lib/supabase/server";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await getAuthContext();
  if (!userId) redirect("/entrar?redirect=/admin");

  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Logo />
          <span className="hidden rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-muted sm:inline">
            Painel de administração
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver site
            </Link>
            <ThemeToggle />
            <span className="hidden text-sm font-medium sm:inline">{profile?.name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
