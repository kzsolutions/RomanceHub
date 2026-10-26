import type { ReactNode } from "react";

export function StaticPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      {updated && <p className="mt-3 text-xs text-muted">Última atualização: {updated}</p>}
      {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 [&_a]:font-semibold [&_a]:text-brand-600 [&_a:hover]:underline dark:[&_a]:text-brand-400 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
