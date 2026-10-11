"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  CreditCard,
  Flag,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tags,
  Users,
  Layers,
  Image as ImageIcon,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/historias", label: "Histórias", icon: BookOpen },
  { href: "/admin/categorias", label: "Categorias", icon: Layers },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/comentarios", label: "Comentários", icon: MessageSquare },
  { href: "/admin/reports", label: "Denúncias", icon: Flag },
  { href: "/admin/utilizadores", label: "Utilizadores", icon: Users },
  { href: "/admin/autores", label: "Autores", icon: PenLine },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/definicoes", label: "Definições", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-60 lg:shrink-0 lg:border-r lg:bg-surface">
      <nav
        className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:p-4"
        aria-label="Navegação do admin"
      >
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
        <div className="mt-2 hidden border-t pt-3 lg:block">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Bell className="h-4 w-4" aria-hidden />
            Ver site
          </Link>
        </div>
      </nav>
    </aside>
  );
}
