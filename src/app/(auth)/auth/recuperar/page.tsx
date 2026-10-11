import Link from "next/link";
import { NewPasswordForm } from "./NewPasswordForm";

export default function AuthRecuperarPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Nova palavra-passe</h1>
        <p className="mt-2 text-sm text-muted">
          Escolhe uma nova palavra-passe para a tua conta
        </p>
      </div>

      <div className="rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <NewPasswordForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link
          href="/entrar"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Voltar a iniciar sessão
        </Link>
      </p>
    </div>
  );
}
