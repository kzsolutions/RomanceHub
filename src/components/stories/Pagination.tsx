import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageHref(
  basePath: string,
  params: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const qs = new URLSearchParams();
  for (const [key, raw] of Object.entries(params)) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value) qs.set(key, value);
  }
  if (page > 1) qs.set("page", String(page));
  else qs.delete("page");
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginação">
      {page > 1 ? (
        <Link
          href={pageHref(basePath, params, page - 1)}
          className="flex h-10 items-center gap-1 rounded-full border bg-surface px-4 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Anterior
        </Link>
      ) : (
        <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-full border bg-surface px-4 text-sm font-medium text-muted opacity-50">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Anterior
        </span>
      )}

      {start > 1 && <span className="px-1 text-sm text-muted">…</span>}
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(basePath, params, p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            p === page
              ? "bg-brand-600 text-white shadow-soft"
              : "border bg-surface hover:bg-surface-2",
          )}
        >
          {p}
        </Link>
      ))}
      {end < totalPages && <span className="px-1 text-sm text-muted">…</span>}

      {page < totalPages ? (
        <Link
          href={pageHref(basePath, params, page + 1)}
          className="flex h-10 items-center gap-1 rounded-full border bg-surface px-4 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          Seguinte
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-full border bg-surface px-4 text-sm font-medium text-muted opacity-50">
          Seguinte
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
