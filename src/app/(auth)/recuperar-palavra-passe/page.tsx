import Link from "next/link";
import { MailCheck } from "lucide-react";
import { ResetForm } from "./ResetForm";

export default async function RecuperarPalavraPassePage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; email?: string }>;
}) {
  const { enviado, email } = await searchParams;

  if (enviado) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <MailCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Email enviado</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Se existir uma conta para{" "}
          <span className="font-semibold text-foreground">{email}</span>,
          receberás um link para escolher uma nova palavra-passe.
        </p>
        <Link
          href="/entrar"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Voltar a iniciar sessão
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Recuperar acesso</h1>
        <p className="mt-2 text-sm text-muted">
          Enviaremos um link de recuperação para o teu email
        </p>
      </div>

      <div className="rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <ResetForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Lembras-te da palavra-passe?{" "}
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
