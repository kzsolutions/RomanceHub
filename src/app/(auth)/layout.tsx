import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.10),transparent_55%)]"
      />
      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
