import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { JWK } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PROTECTED_PATHS = [
  "/biblioteca",
  "/favoritos",
  "/notificacoes",
  "/perfil",
  "/configuracoes",
  "/carteira",
  "/comprar",
  "/pagamento",
  "/compras",
];
const AUTH_PATHS = ["/entrar", "/criar-conta"];
const ROLE_PATHS: Record<string, "admin" | "author"> = {
  "/admin": "admin",
  "/autor": "author",
};

type PendingCookie = { name: string; value: string; options: CookieOptions };

type Jwks = { keys: JWK[] };

// O JWKS é estável, por isso é guardado em memória do módulo (reaproveitado
// enquanto a instância do middleware estiver quente). Assim a verificação do
// JWT é local e não gera um pedido de rede ao Auth server por pedido.
let jwksCache: Jwks | null = null;
let jwksCachedAt = 0;
const JWKS_TTL_MS = 10 * 60 * 1000;

async function loadJwks(): Promise<Jwks | null> {
  if (jwksCache && Date.now() - jwksCachedAt < JWKS_TTL_MS) return jwksCache;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
        cache: "no-store",
      },
    );
    if (!response.ok) return jwksCache;
    const data = (await response.json()) as Jwks;
    if (!data?.keys?.length) return jwksCache;
    jwksCache = data;
    jwksCachedAt = Date.now();
    return jwksCache;
  } catch {
    return jwksCache;
  }
}

function hasSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"));
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => path.startsWith(p));
  const requiredRole = Object.entries(ROLE_PATHS).find(([p]) =>
    path.startsWith(p),
  )?.[1];

  // Cookies de sessão renovados durante este pedido (o refresh de token do
  // Supabase ocorre no getClaims/getUser) e que têm de ser devolvidos ao
  // browser mesmo quando a resposta é um redirect.
  let pendingCookies: PendingCookie[] = [];

  const applyPendingCookies = (response: NextResponse) => {
    pendingCookies.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
    );
    return response;
  };

  const redirectTo = (pathname: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search;
    return applyPendingCookies(NextResponse.redirect(url));
  };

  const loginRedirect = () =>
    redirectTo("/entrar", `?redirect=${encodeURIComponent(path)}`);

  // Sem cookie de sessão não há nada para validar nem para renovar: evita um
  // pedido de rede ao Auth server em todos os acessos anónimos.
  if (!hasSessionCookie(request)) {
    if (isProtected || requiredRole) return loginRedirect();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-auth-state", "anon");
    requestHeaders.delete("x-user-id");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          pendingCookies = cookiesToSet;
        },
      },
    },
  );

  // Verificação local (assinatura ES256 validada contra o JWKS em cache) com
  // fallback para getUser() caso o JWKS não esteja disponível ou o token não
  // seja verificável localmente.
  let userId: string | null = null;
  const jwks = await loadJwks();
  if (jwks) {
    try {
      const { data, error } = await supabase.auth.getClaims(undefined, { jwks });
      if (!error && data) userId = data.claims.sub ?? null;
    } catch {
      // sem problema: cai no getUser() abaixo
    }
  }
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-auth-state", userId ? "user" : "anon");
  if (userId) requestHeaders.set("x-user-id", userId);
  else requestHeaders.delete("x-user-id");

  const supabaseResponse = applyPendingCookies(
    NextResponse.next({ request: { headers: requestHeaders } }),
  );

  if (!userId) {
    if (isProtected || requiredRole) return loginRedirect();
    return supabaseResponse;
  }

  if (isAuthPath) return redirectTo("/");

  if (requiredRole) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    const role = profile?.role ?? "reader";
    const allowed =
      requiredRole === "admin"
        ? role === "admin"
        : role === "author" || role === "admin";

    if (!allowed) return redirectTo("/");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|covers/|banners/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
