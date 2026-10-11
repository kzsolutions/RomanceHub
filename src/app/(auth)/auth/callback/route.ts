import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(next: string | null) {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeNext(url.searchParams.get("next"));

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type) {
    await supabase.auth.verifyOtp({
      type: type as "signup" | "recovery" | "email_change",
      token_hash: tokenHash,
    });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
