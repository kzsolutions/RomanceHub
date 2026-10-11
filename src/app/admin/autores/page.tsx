import type { Metadata } from "next";
import { BadgeCheck, BadgeX } from "lucide-react";
import { getAdminAuthors } from "@/lib/data/admin";
import { Card, Td, TableWrap, Th } from "@/components/admin/ui";
import { Badge } from "@/components/ui/Badge";
import { setAuthorApproval } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Autores · Admin" };

export default async function AdminAuthorsPage() {
  const authors = await getAdminAuthors();
  const pending = authors.filter((a) => !a.isApproved).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Autores</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        {authors.length} autores · {pending} por aprovar
      </p>

      <TableWrap>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Pseudónimo</Th>
            <Th>Website</Th>
            <Th>Histórias</Th>
            <Th>Estado</Th>
            <Th className="text-right">Aprovação</Th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.profileId} className="hover:bg-surface-2/60">
              <Td className="font-medium">{a.name}</Td>
              <Td className="text-muted">{a.penName ?? "—"}</Td>
              <Td className="text-muted">
                {a.website ? (
                  <a
                    href={a.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline dark:text-brand-400"
                  >
                    visitar
                  </a>
                ) : (
                  "—"
                )}
              </Td>
              <Td className="tabular-nums text-muted">{a.storyCount}</Td>
              <Td>
                {a.isApproved ? (
                  <Badge variant="free">Aprovado</Badge>
                ) : (
                  <Badge variant="premium">Pendente</Badge>
                )}
              </Td>
              <Td>
                <form action={setAuthorApproval} className="flex justify-end">
                  <input type="hidden" name="profile_id" value={a.profileId} />
                  <input type="hidden" name="approved" value={a.isApproved ? "false" : "true"} />
                  <button
                    type="submit"
                    className={
                      a.isApproved
                        ? "inline-flex h-9 items-center gap-1.5 rounded-full border bg-surface px-3 text-xs font-semibold text-muted transition-colors hover:bg-surface-2"
                        : "inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }
                  >
                    {a.isApproved ? (
                      <>
                        <BadgeX className="h-3.5 w-3.5" aria-hidden />
                        Revogar
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                        Aprovar
                      </>
                    )}
                  </button>
                </form>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      {authors.length === 0 && (
        <Card className="mt-4">
          <p className="text-sm text-muted">Ainda não há autores registados.</p>
        </Card>
      )}
    </div>
  );
}
