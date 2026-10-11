import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label="RomanceHub — início"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-soft transition-transform duration-200 group-hover:scale-105">
        <Heart className="h-4.5 w-4.5 fill-white text-white" strokeWidth={2} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Romance
        <span className="text-brand-600 dark:text-brand-400">Hub</span>
      </span>
    </Link>
  );
}
