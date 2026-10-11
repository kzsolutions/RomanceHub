import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(".", ",")} mil`;
  return String(value);
}

export function formatDate(date: string | Date, withYear = true): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function readingPercent(chapterNumber: number, totalChapters: number): number {
  if (!totalChapters) return 0;
  return Math.min(100, Math.round((chapterNumber / totalChapters) * 100));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function formatRating(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

export function formatMT(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return `${(cents / 100).toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MT`;
}

/** Converte um valor em meticais (ex.: "150" ou "150,50") para centavos. */
export function mtToCents(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

export function firstParam(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.length > 0 ? v : undefined;
}

/**
 * Constrói uma query string a partir dos parâmetros actuais aplicando um patch.
 * Valores `undefined` ou vazios removem o parâmetro.
 */
export function buildQuery(
  current: Record<string, string | string[] | undefined>,
  patch: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(current)) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value) params.set(key, value);
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
