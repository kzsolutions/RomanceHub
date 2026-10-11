"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

function safeRedirect(target: string | null | undefined) {
  if (!target) return "/";
  if (!target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirect") as string | null);

  if (!email || !password) {
    return { error: "Preenche o email e a palavra-passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email ou palavra-passe incorretos."
          : error.message === "Email not confirmed"
            ? "Confirma o email antes de iniciar sessão."
            : "Não foi possível iniciar sessão. Tenta novamente.",
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirect") as string | null);

  if (!name || !email || !password) {
    return { error: "Preenche todos os campos." };
  }
  if (password.length < 8) {
    return { error: "A palavra-passe deve ter pelo menos 8 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    return {
      error:
        error.message === "User already registered"
          ? "Já existe uma conta com este email."
          : "Não foi possível criar a conta. Tenta novamente.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(redirectTo);
  }

  revalidatePath("/", "layout");
  redirect(`/criar-conta?enviado=1&email=${encodeURIComponent(email)}`);
}

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Indica o teu email." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/recuperar`,
  });

  redirect(`/recuperar-palavra-passe?enviado=1&email=${encodeURIComponent(email)}`);
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "A palavra-passe deve ter pelo menos 8 caracteres." };
  }
  if (password !== confirm) {
    return { error: "As palavras-passe não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Não foi possível alterar a palavra-passe." };

  redirect("/perfil?palavra-passe=alterada");
}

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (!name) return { error: "O nome é obrigatório." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entra novamente." };

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "Não foi possível guardar o perfil." };

  revalidatePath("/", "layout");
  return null;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
