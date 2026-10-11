"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updatePassword, type AuthState } from "@/lib/actions/auth";

export function NewPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Nova palavra-passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
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

      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
          Confirmar palavra-passe
        </label>
        <input
          id="confirm"
          name="confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repete a palavra-passe"
          className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar nova palavra-passe
      </Button>
    </form>
  );
}
