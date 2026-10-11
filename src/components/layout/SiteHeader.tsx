"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Heart,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  PenLine,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export type HeaderUser = {
  name: string;
  avatarUrl: string | null;
  role: "reader" | "author" | "admin";
  unreadCount: number;
};

const navItems = [
  { label: "Início", href: "/" },
  { label: "Explorar", href: "/explorar" },
  { label: "Categorias", href: "/categorias" },
  { label: "Mais lidas", href: "/explorar?ordenar=mais-lidas" },
  { label: "Novidades", href: "/explorar?ordenar=novidades" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SiteHeader({ user }: { user: HeaderUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/pesquisa?q=${encodeURIComponent(q)}` : "/pesquisa");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/85 backdrop-blur-lg transition-shadow duration-300",
        scrolled ? "shadow-soft" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-brand-700 dark:text-brand-400"
                    : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Pesquisar"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>

          <ThemeToggle className="hidden h-10 w-10 rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:flex" />

          {user && (
            <Link
              href="/notificacoes"
              aria-label={`Notificações${user.unreadCount > 0 ? ` (${user.unreadCount} por ler)` : ""}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {user.unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {user.unreadCount > 9 ? "9+" : user.unreadCount}
                </span>
              )}
            </Link>
          )}

          {!user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button href="/entrar" variant="ghost" size="sm">
                Entrar
              </Button>
              <Button href="/criar-conta" size="sm">
                Criar conta
              </Button>
            </div>
          ) : (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-surface-2"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                    {initials(user.name)}
                  </span>
                )}
                <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", menuOpen && "rotate-180")} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="animate-fade-up absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-surface shadow-card"
                >
                  <div className="border-b px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted">
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "author"
                          ? "Autor"
                          : "Leitor"}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <MenuLink href="/biblioteca" icon={Library}>
                      Minha Biblioteca
                    </MenuLink>
                    <MenuLink href="/favoritos" icon={Heart}>
                      Favoritos
                    </MenuLink>
                    <MenuLink href="/compras" icon={ShoppingBag}>
                      Compras
                    </MenuLink>
                    <MenuLink href="/notificacoes" icon={Bell}>
                      Notificações
                    </MenuLink>
                    <MenuLink href="/perfil" icon={User}>
                      Perfil
                    </MenuLink>
                    {(user.role === "author" || user.role === "admin") && (
                      <MenuLink href="/autor" icon={PenLine}>
                        Área do autor
                      </MenuLink>
                    )}
                    {user.role === "admin" && (
                      <MenuLink href="/admin" icon={LayoutDashboard}>
                        Painel admin
                      </MenuLink>
                    )}
                  </div>
                  <form action={signOut} className="border-t p-1.5">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Terminar sessão
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t bg-background/95 backdrop-blur-lg">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl gap-2 px-4 py-3 sm:px-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por título, autor, categoria ou tags…"
                className="h-11 w-full rounded-full border bg-surface pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <Button type="submit" size="sm" className="h-11">
              Pesquisar
            </Button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6" aria-label="Navegação móvel">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t px-4 pt-4">
              <ThemeToggle />
              {!user ? (
                <div className="flex gap-2">
                  <Button href="/entrar" variant="outline" size="sm">
                    Entrar
                  </Button>
                  <Button href="/criar-conta" size="sm">
                    Criar conta
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button href="/biblioteca" variant="outline" size="sm">
                    <Library className="h-4 w-4" /> Biblioteca
                  </Button>
                  <form action={signOut}>
                    <Button type="submit" variant="ghost" size="sm">
                      <LogOut className="h-4 w-4" /> Sair
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
    >
      <Icon className="h-4 w-4 text-muted" />
      {children}
    </Link>
  );
}

export function ReadingIcon() {
  return <BookOpen className="h-4 w-4" />;
}
