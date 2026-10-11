import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const variants = {
  default: "bg-surface-2 text-muted border border-border",
  brand: "bg-brand-50 text-brand-700 border border-brand-200",
  free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  premium:
    "bg-gold-300/30 text-gold-600 border border-gold-400/50 dark:bg-gold-400/15 dark:text-gold-300 dark:border-gold-400/40",
  complete:
    "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-400/30",
  ongoing:
    "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/30",
} as const;

type BadgeProps = {
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant = "default", icon: Icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}
