import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SignUpForm } from "./SignUpForm";

export default async function CriarContaPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; email?: string; redirect?: string }>;
}) {
  const { enviado, email, redirect } = await searchParams;

  if (enviado) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Quase lá!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enviámos um email de confirmação para{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          Clica no link para ativar a conta e volta para iniciar sessão.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/entrar">
            <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              Ir para início de sessão
            </span>
          </Link>
          <p className="text-xs text-muted">
            Não encontras o email? Verifica a pasta de spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Criar conta grátis</h1>
        <p className="mt-2 text-sm text-muted">
          Guarda favoritos, segue autores e lê onde paraste
        </p>
      </div>

      <div className="rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <SignUpForm redirectTo={redirect} />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Já tens conta?{" "}
        <Link
          href="/entrar"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Iniciar sessão
        </Link>
      </p>
    </div>
  );
}
