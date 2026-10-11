"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterSelect({
  param,
  value,
  options,
  label,
  defaultValue,
}: {
  param: string;
  value: string;
  options: { value: string; label: string }[];
  label: string;
  defaultValue?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === defaultValue) params.delete(param);
    else params.set(param, next);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer rounded-full border bg-surface px-4 text-sm font-medium outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
