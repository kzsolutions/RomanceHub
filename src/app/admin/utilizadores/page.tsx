import type { Metadata } from "next";
import { Save } from "lucide-react";
import { getAdminUsers, PAGE_SIZE } from "@/lib/data/admin";
import type { UserRole } from "@/lib/data/admin";
import { Card, Td, TableWrap, Th, inputClass, labelClass, btnPrimary } from "@/components/admin/ui";
import { Pagination } from "@/components/stories/Pagination";
import { updateUserRole } from "@/lib/actions/admin";
import { formatDate, firstParam } from "@/lib/utils";

export const metadata: Metadata = { title: "Utilizadores · Admin" };

const ROLES: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "reader", label: "Leitores" },
  { value: "author", label: "Autores" },
  { value: "admin", label: "Administradores" },
];

const roleLabel: Record<UserRole, string> = {
  reader: "Leitor",
  author: "Autor",
  admin: "Administrador",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = firstParam(sp.q) ?? "";
  const role = (firstParam(sp.role) ?? "all") as UserRole | "all";
  const page = Math.max(1, Number.parseInt(firstParam(sp.page) ?? "1", 10) || 1);

  const { items, total } = await getAdminUsers({ q, role, page });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Utilizadores</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        {total} contas · {items.filter((u) => u.role === "admin").length} administradores nesta página
      </p>

      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className={labelClass} htmlFor="q">
              Pesquisar por nome
            </label>
            <input id="q" name="q" defaultValue={q} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="role">
              Tipo
            </label>
            <select id="role" name="role" defaultValue={role} className={inputClass}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={btnPrimary}>
            Filtrar
          </button>
        </form>
      </Card>

      <TableWrap>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Tipo</Th>
            <Th>Histórias</Th>
            <Th>Registo</Th>
            <Th className="text-right">Alterar tipo</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="hover:bg-surface-2/60">
              <Td className="font-medium">{u.name}</Td>
              <Td className="text-muted">{roleLabel[u.role]}</Td>
              <Td className="tabular-nums text-muted">{u.storyCount}</Td>
              <Td className="text-xs text-muted">{formatDate(u.createdAt)}</Td>
              <Td>
                <form action={updateUserRole} className="flex items-center justify-end gap-2">
                  <input type="hidden" name="id" value={u.id} />
                  <select name="role" defaultValue={u.role} className={`${inputClass} h-9 w-40`}>
                    <option value="reader">Leitor</option>
                    <option value="author">Autor</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-surface px-3 text-xs font-semibold transition-colors hover:bg-surface-2"
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden />
                    Guardar
                  </button>
                </form>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/utilizadores" params={sp} />
    </div>
  );
}
