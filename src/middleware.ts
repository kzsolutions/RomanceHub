import { createServerClient } from "@supabase/ssr";
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

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && PROTECTED_PATHS.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = `?redirect=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PATHS.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const requiredRole = Object.entries(ROLE_PATHS).find(([p]) =>
    path.startsWith(p),
  )?.[1];

  if (requiredRole) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/entrar";
      url.search = `?redirect=${encodeURIComponent(path)}`;
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role ?? "reader";
    const allowed =
      requiredRole === "admin"
        ? role === "admin"
        : role === "author" || role === "admin";

    if (!allowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|covers/|banners/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
