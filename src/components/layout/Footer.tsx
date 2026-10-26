import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

type FooterUser = {
  role: "reader" | "author" | "admin";
} | null;

type FooterLink = { label: string; href: string };

export function Footer({ user = null }: { user?: FooterUser }) {
  const isAuthed = Boolean(user);
  const isAuthor = user?.role === "author" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const exploreLinks: FooterLink[] = [
    { label: "Todas as histórias", href: "/explorar" },
    { label: "Categorias", href: "/categorias" },
    { label: "Mais lidas", href: "/explorar?ordenar=mais-lidas" },
    { label: "Novidades", href: "/explorar?ordenar=novidades" },
  ];

  // Visitantes veem as opções de entrada; quem já tem sessão vê antes as
  // áreas da sua conta (evita links "Entrar"/"Criar conta" incompatíveis).
  const accountLinks: FooterLink[] = isAuthed
    ? [
        { label: "Minha Biblioteca", href: "/biblioteca" },
        { label: "Favoritos", href: "/favoritos" },
        { label: "Compras", href: "/compras" },
        { label: "Perfil", href: "/perfil" },
      ]
    : [
        { label: "Entrar", href: "/entrar" },
        { label: "Criar conta", href: "/criar-conta" },
        { label: "Recuperar palavra-passe", href: "/recuperar-palavra-passe" },
      ];

  // Links de autor e de administração só aparecem a quem tem o papel. A
  // autorização efetiva continua a ser verificada no servidor (middleware + RLS).
  const platformLinks: FooterLink[] = [
    { label: "Sobre nós", href: "/sobre" },
    { label: "Contacto", href: "/contacto" },
    ...(isAuthor ? [{ label: "Área do autor", href: "/autor" }] : []),
    ...(isAdmin ? [{ label: "Painel administrativo", href: "/admin" }] : []),
  ];

  const legalLinks: FooterLink[] = [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Termos de Uso", href: "/termos" },
    { label: "Definições de Cookies", href: "/cookies" },
  ];

  const columns = [
    { title: "Explorar", links: exploreLinks },
    { title: "Conta", links: accountLinks },
    { title: "Plataforma", links: platformLinks },
    { title: "Legal", links: legalLinks },
  ];

  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Biblioteca digital de romances originais em português. Histórias de
              amor, paixão e segundas chances para ler onde estiveres.
            </p>
            <p className="text-sm text-muted">
              Contacto:{" "}
              <a
                href="tel:+258876477153"
                className="font-semibold text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
              >
                876 477 153
              </a>
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} RomanceHub — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
