import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; erro?: string }>;
}) {
  const { redirect, erro } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-muted">
          Entra para continuar a ler as tuas histórias
        </p>
      </div>

      <div className="rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <LoginForm redirectTo={redirect} serverError={erro} />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tens conta?{" "}
        <Link
          href="/criar-conta"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
