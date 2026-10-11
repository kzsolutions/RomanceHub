"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signIn, type AuthState } from "@/lib/actions/auth";

export function LoginForm({
  redirectTo,
  serverError,
}: {
  redirectTo?: string;
  serverError?: string;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const error = state?.error ?? serverError;

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@exemplo.com"
          className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Palavra-passe
          </label>
          <Link
            href="/recuperar-palavra-passe"
            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Esqueceste-te?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}
