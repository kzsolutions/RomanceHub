import type { Metadata } from "next";
import Link from "next/link";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { getAdminComments, PAGE_SIZE } from "@/lib/data/admin";
import { Card, Td, TableWrap, Th, btnDanger, inputClass, labelClass } from "@/components/admin/ui";
import { Pagination } from "@/components/stories/Pagination";
import { deleteComment, toggleCommentHidden } from "@/lib/actions/admin";
import { formatDate, firstParam } from "@/lib/utils";

export const metadata: Metadata = { title: "Comentários · Admin" };

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const state = firstParam(sp.estado) ?? "all";
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);
  const hidden = state === "ocultos" ? true : state === "visiveis" ? false : "all";

  const { items, total } = await getAdminComments({ hidden, page });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Comentários</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{total} no total</p>

      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div>
            <label className={labelClass} htmlFor="estado">
              Estado
            </label>
            <select id="estado" name="estado" defaultValue={state} className={inputClass}>
              <option value="all">Todos</option>
              <option value="visiveis">Visíveis</option>
              <option value="ocultos">Ocultos</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border bg-surface px-4 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            Filtrar
          </button>
        </form>
      </Card>

      {items.length > 0 ? (
        <>
          <TableWrap>
            <thead>
              <tr>
                <Th>Comentário</Th>
                <Th>Autor</Th>
                <Th>História</Th>
                <Th>Data</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="align-top hover:bg-surface-2/60">
                  <Td className="max-w-md">
                    <p className={c.isHidden ? "text-muted line-through" : ""}>{c.content}</p>
                    {c.isHidden && <span className="text-xs font-semibold text-amber-600">Oculto</span>}
                  </Td>
                  <Td className="text-muted">{c.userName}</Td>
                  <Td className="text-muted">
                    {c.storySlug ? (
                      <Link href={`/historias/${c.storySlug}`} className="hover:text-foreground">
                        {c.storyTitle}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-xs text-muted">{formatDate(c.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <form action={toggleCommentHidden}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="hidden" value={c.isHidden ? "false" : "true"} />
                        <button
                          type="submit"
                          title={c.isHidden ? "Mostrar" : "Ocultar"}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:text-foreground"
                        >
                          {c.isHidden ? (
                            <Eye className="h-3.5 w-3.5" aria-hidden />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" aria-hidden />
                          )}
                        </button>
                      </form>
                      <form action={deleteComment}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className={btnDanger}>
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <Pagination page={page} totalPages={totalPages} basePath="/admin/comentarios" params={sp} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed bg-surface px-6 py-10 text-center text-sm text-muted">
          Sem comentários.
        </p>
      )}
    </div>
  );
}
