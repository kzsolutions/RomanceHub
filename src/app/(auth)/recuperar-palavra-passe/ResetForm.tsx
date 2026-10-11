"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";

export function ResetForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    null,
  );

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

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar link de recuperação
      </Button>
    </form>
  );
}
