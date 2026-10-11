"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { removeFromLibrary } from "@/lib/actions/library";

export function RemoveFromLibraryButton({
  storyId,
  label = "Remover da biblioteca",
}: {
  storyId: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await removeFromLibrary(storyId);
          router.refresh();
        })
      }
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-surface text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <X className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
