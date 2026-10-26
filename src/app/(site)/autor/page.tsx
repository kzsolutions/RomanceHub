import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, PenLine } from "lucide-react";
import { getAuthContext, getCurrentProfile } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber, formatRating } from "@/lib/utils";

export const metadata: Metadata = { title: "Área do autor" };

type StoryRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  is_free: boolean;
  reads_count: number;
  rating_avg: number;
};

const statusMeta: Record<StoryRow["status"], { label: string; variant: "free" | "premium" | "default" | "complete" }> = {
  published: { label: "Publicada", variant: "free" },
  pending: { label: "Em revisão", variant: "premium" },
  draft: { label: "Rascunho", variant: "default" },
  rejected: { label: "Rejeitada", variant: "complete" },
};

export default async function AuthorAreaPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/entrar?redirect=%2Fautor");
  if (profile.role !== "author" && profile.role !== "admin") redirect("/");

  const { supabase, userId } = await getAuthContext();
  const [storiesRes, authorRes] = await Promise.all([
    supabase
      .from("stories")
      .select("id,title,slug,status,is_free,reads_count,rating_avg")
      .eq("author_id", userId!)
      .order("updated_at", { ascending: false }),
    supabase.from("authors").select("pen_name,is_approved").eq("profile_id", userId!).maybeSingle(),
  ]);

  const stories = (storiesRes.data ?? []) as StoryRow[];
  const isApproved = authorRes.data?.is_approved ?? false;
  const penName = authorRes.data?.pen_name ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Área do autor
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold">Olá, {profile.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {penName ? (
              <>
                Assinas como <span className="font-semibold text-foreground">{penName}</span> nas
                páginas públicas.
              </>
            ) : (
              "Ainda não definiste um pseudónimo público."
            )}
          </p>
        </div>
        <Badge variant={isApproved ? "free" : "premium"}>
          {isApproved ? "Autor aprovado" : "Aguarda aprovação"}
        </Badge>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold">As minhas histórias</h2>
          <span className="text-sm text-muted">
            {stories.length} {stories.length === 1 ? "obra" : "obras"}
          </span>
        </div>

        {stories.length > 0 ? (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-surface shadow-soft">
            {stories.map((story) => {
              const meta = statusMeta[story.status];
              return (
                <li key={story.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{story.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted">
                      <span>{formatNumber(story.reads_count)} leituras</span>
                      <span>{formatRating(story.rating_avg)} ★</span>
                    </p>
                  </div>
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                  {story.status === "published" && (
                    <Link
                      href={`/historias/${story.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Ver
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed bg-surface px-6 py-12 text-center">
            <PenLine className="mx-auto h-8 w-8 text-muted" aria-hidden />
            <p className="mt-3 text-sm text-muted">
              Ainda não tens histórias nesta plataforma. A criação e edição de obras é feita pela
              equipa editorial.
            </p>
            <Button href="/explorar" variant="outline" size="sm" className="mt-5">
              Explorar histórias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
