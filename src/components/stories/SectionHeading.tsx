import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  href,
  cta = "Ver tudo",
  eyebrow,
}: {
  title: string;
  href?: string;
  cta?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
