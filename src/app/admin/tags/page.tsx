import type { Metadata } from "next";
import { Plus, Trash2 } from "lucide-react";
import { getAdminTags } from "@/lib/data/admin";
import { Card, inputClass, btnPrimary } from "@/components/admin/ui";
import { deleteTag, upsertTag } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Tags · Admin" };

export default async function AdminTagsPage() {
  const tags = await getAdminTags();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Tags</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{tags.length} tags</p>

      <Card className="mb-6">
        <form action={upsertTag} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <input name="name" required placeholder="Nova tag…" className={inputClass} aria-label="Nome da tag" />
          </div>
          <button type="submit" className={btnPrimary}>
            <Plus className="h-4 w-4" aria-hidden />
            Adicionar
          </button>
        </form>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="inline-flex items-center gap-2 rounded-full border bg-surface py-1 pl-3 pr-1 text-sm shadow-soft"
          >
            <span className="font-medium">#{tag.name}</span>
            <form action={deleteTag}>
              <input type="hidden" name="id" value={tag.id} />
              <button
                type="submit"
                title="Eliminar"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
