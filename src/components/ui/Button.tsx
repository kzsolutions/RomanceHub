import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-card",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-2",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
  gold: "bg-gold-400 text-brand-950 hover:bg-gold-500 shadow-soft",
  danger: "bg-red-600 text-white hover:bg-red-700",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10 p-0",
} as const;

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
