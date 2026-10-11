import type { Metadata } from "next";
import Link from "next/link";
import { Check, Flag, RotateCcw, X } from "lucide-react";
import { getAdminReports } from "@/lib/data/admin";
import type { ReportStatus } from "@/lib/data/admin";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/admin/ui";
import { updateReportStatus } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Denúncias · Admin" };

const statusLabel: Record<ReportStatus, string> = {
  open: "Por tratar",
  reviewing: "Em análise",
  resolved: "Resolvida",
  dismissed: "Ignorada",
};

const statusVariant: Record<ReportStatus, "premium" | "brand" | "free" | "default"> = {
  open: "premium",
  reviewing: "brand",
  resolved: "free",
  dismissed: "default",
};

const targetLabel: Record<string, string> = {
  story: "História",
  chapter: "Capítulo",
  comment: "Comentário",
};

export default async function AdminReportsPage() {
  const reports = await getAdminReports();
  const open = reports.filter((r) => r.status === "open").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Denúncias</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        {reports.length} no total · {open} por tratar
      </p>

      {reports.length > 0 ? (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant[r.status]}>{statusLabel[r.status]}</Badge>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {targetLabel[r.target]}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold">{r.reason}</p>
                    {r.details && <p className="mt-1 text-sm text-muted">{r.details}</p>}
                    <p className="mt-2 text-xs text-muted">
                      Denunciado por {r.reporterName} · {formatDate(r.createdAt)}
                      {r.storyTitle && r.storySlug && (
                        <>
                          {" · "}
                          <Link href={`/historias/${r.storySlug}`} className="text-brand-600 hover:underline dark:text-brand-400">
                            {r.storyTitle}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    {r.status !== "reviewing" && (
                      <form action={updateReportStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="reviewing" />
                        <button className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-surface px-3 text-xs font-semibold transition-colors hover:bg-surface-2">
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                          Em análise
                        </button>
                      </form>
                    )}
                    <form action={updateReportStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="resolved" />
                      <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Resolver
                      </button>
                    </form>
                    <form action={updateReportStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-surface px-3 text-xs font-semibold text-muted transition-colors hover:bg-surface-2">
                        <X className="h-3.5 w-3.5" aria-hidden />
                        Ignorar
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface px-6 py-16 text-center">
          <Flag className="mb-3 h-8 w-8 text-muted" aria-hidden />
          <p className="font-display text-lg font-bold">Sem denúncias</p>
          <p className="mt-1 text-sm text-muted">Não há nada por moderar neste momento.</p>
        </div>
      )}
    </div>
  );
}
