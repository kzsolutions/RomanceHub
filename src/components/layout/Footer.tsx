import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const columns = [
  {
    title: "Explorar",
    links: [
      { label: "Todas as histórias", href: "/explorar" },
      { label: "Categorias", href: "/categorias" },
      { label: "Mais lidas", href: "/explorar?ordenar=mais-lidas" },
      { label: "Novidades", href: "/explorar?ordenar=novidades" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Entrar", href: "/entrar" },
      { label: "Criar conta", href: "/criar-conta" },
      { label: "Minha Biblioteca", href: "/biblioteca" },
      { label: "Favoritos", href: "/favoritos" },
    ],
  },
  {
    title: "Plataforma",
    links: [
      { label: "Para autores", href: "/autor" },
      { label: "Painel administrativo", href: "/admin" },
      { label: "Recuperar palavra-passe", href: "/recuperar-palavra-passe" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Biblioteca digital de romances originais em português. Histórias de
              amor, paixão e segundas chances para ler onde estiveres.
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
