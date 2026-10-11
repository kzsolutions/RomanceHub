import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminAuthors, getAdminCategories, getAdminTags } from "@/lib/data/admin";
import { StoryForm } from "@/components/admin/StoryForm";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Nova história · Admin" };

export default async function NovaHistoriaPage() {
  const [categories, tags, authors] = await Promise.all([
    getAdminCategories(),
    getAdminTags(),
    getAdminAuthors(),
  ]);

  return (
    <div>
      <Link
        href="/admin/historias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Histórias
      </Link>
      <AdminPageHeader title="Nova história" description="Cria uma nova obra no catálogo." />
      <StoryForm categories={categories} tags={tags} authors={authors} />
    </div>
  );
}
