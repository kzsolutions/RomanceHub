"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  updatePassword,
  updateProfile,
  type AuthState,
} from "@/lib/actions/auth";

export function ProfileForm({
  initial,
  email,
}: {
  initial: { name: string; bio: string; avatarUrl: string };
  email: string;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateProfile,
    null,
  );
  const [pwState, pwAction, pwPending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-10">
      <form action={formAction} className="space-y-4">
        <h2 className="text-lg font-semibold">Dados da conta</h2>

        {state?.error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {state.error}
          </div>
        )}
        {state === null && pending === false && (
          <p className="sr-only" role="status">
            Perfil guardado
          </p>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            value={email}
            disabled
            className="h-11 w-full rounded-xl border bg-surface-2 px-4 text-sm text-muted"
          />
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initial.name}
            className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={initial.bio}
            placeholder="Conta um pouco sobre ti (opcional)"
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div>
          <label htmlFor="avatar_url" className="mb-1.5 block text-sm font-medium">
            URL do avatar
          </label>
          <input
            id="avatar_url"
            name="avatar_url"
            type="url"
            defaultValue={initial.avatarUrl}
            placeholder="https://…"
            className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar alterações
        </Button>
      </form>

      <form action={pwAction} className="space-y-4 border-t pt-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-500" />
          <h2 className="text-lg font-semibold">Alterar palavra-passe</h2>
        </div>

        {pwState?.error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {pwState.error}
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
              aria-label={showPassword ? "Ocultar" : "Mostrar"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
            Confirmar
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

        <Button type="submit" variant="outline" disabled={pwPending}>
          {pwPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Alterar palavra-passe
        </Button>
      </form>
    </div>
  );
}
