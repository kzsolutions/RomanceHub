import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import type { Database } from "@/types/database";

export const AUTH_STATE_HEADER = "x-auth-state";
export const USER_ID_HEADER = "x-user-id";

export type UserRole = "reader" | "author" | "admin";

export type CurrentProfile = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
};

/**
 * Um cliente por request: o React `cache` garante que layout, páginas e funções
 * de dados partilham a mesma instância (e, com ela, os cookies e a cache JWKS).
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de Server Component — o middleware trata a renovação da sessão.
          }
        },
      },
    },
  );
});

/**
 * Identidade do utilizador para o request atual.
 *
 * O `middleware` valida a sessão uma única vez e comunica o resultado por
 * cabeçalhos internos, pelo que este helper não faz chamadas de rede no caminho
 * normal (apenas um pedido ao Auth server se os cabeçalhos não existirem, por
 * exemplo em rotas fora do matcher).
 */
export const getAuthContext = cache(async () => {
  const supabase = await createClient();
  const headerStore = await headers();
  const authState = headerStore.get(AUTH_STATE_HEADER);

  if (authState === "anon") {
    return { supabase, userId: null as string | null };
  }

  if (authState === "user") {
    const fromMiddleware = headerStore.get(USER_ID_HEADER);
    if (fromMiddleware) return { supabase, userId: fromMiddleware };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
});

/** Perfil do utilizador atual, partilhado por todos os consumidores do request. */
export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const { supabase, userId } = await getAuthContext();
  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,name,avatar_url,role")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    avatarUrl: data.avatar_url,
    role: data.role,
  };
});
