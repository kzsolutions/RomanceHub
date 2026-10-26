"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, Type } from "lucide-react";
import { trackReading } from "@/lib/actions/reading";
import { cn } from "@/lib/utils";

const FONT_KEY = "rh-reader-font";
const MIN_FONT = 15;
const MAX_FONT = 24;

export function Reader({
  storyId,
  chapterId,
  chapterNumber,
  content,
  initiallyCompleted,
}: {
  storyId: string;
  chapterId: string;
  chapterNumber: number;
  content: string;
  initiallyCompleted: boolean;
}) {
  const [fontSize, setFontSize] = useState(18);
  const [wide, setWide] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const lastSent = useRef(-1);
  const completedRef = useRef(initiallyCompleted);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(FONT_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (parsed >= MIN_FONT && parsed <= MAX_FONT) setFontSize(parsed);
    }
  }, []);

  const changeFont = useCallback((delta: number) => {
    setFontSize((prev) => {
      const next = Math.max(MIN_FONT, Math.min(MAX_FONT, prev + delta));
      window.localStorage.setItem(FONT_KEY, String(next));
      return next;
    });
  }, []);

  const save = useCallback(
    (percent: number, completed: boolean) => {
      void trackReading({
        storyId,
        chapterId,
        chapterNumber,
        percent,
        completed,
      }).catch(() => {});
    },
    [storyId, chapterId, chapterNumber],
  );

  useEffect(() => {
    completedRef.current = initiallyCompleted;
  }, [initiallyCompleted]);

  // Registo inicial da leitura.
  useEffect(() => {
    save(Math.max(1, lastSent.current < 0 ? 1 : lastSent.current), completedRef.current);
    lastSent.current = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = articleRef.current;
        if (!el) return;
        const top = el.offsetTop;
        const total = el.scrollHeight - window.innerHeight * 0.4;
        const seen = window.scrollY - top + window.innerHeight * 0.6;
        const percent = Math.max(0, Math.min(100, Math.round((seen / total) * 100)));
        setScrollPercent((prev) => (Math.abs(prev - percent) >= 1 ? percent : prev));

        const completed = completedRef.current || percent >= 95;
        if (Math.abs(percent - lastSent.current) >= 5 || (completed && !completedRef.current)) {
          lastSent.current = percent;
          completedRef.current = completed;
          save(percent, completed);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [chapterId, save]);

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent">
        <div
          className="h-full bg-brand-500 transition-[width] duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-end gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
          <Type className="h-3.5 w-3.5" aria-hidden />
          Texto
        </span>
        <div className="flex items-center rounded-full border bg-surface">
          <button
            type="button"
            onClick={() => changeFont(-1)}
            aria-label="Diminuir tamanho do texto"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground disabled:opacity-40"
            disabled={fontSize <= MIN_FONT}
          >
            <Minus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <span className="w-8 text-center text-xs font-semibold tabular-nums">{fontSize}</span>
          <button
            type="button"
            onClick={() => changeFont(1)}
            aria-label="Aumentar tamanho do texto"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground disabled:opacity-40"
            disabled={fontSize >= MAX_FONT}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setWide((w) => !w)}
          className={cn(
            "hidden h-8 rounded-full border px-3 text-xs font-medium transition-colors sm:inline-flex sm:items-center",
            wide ? "border-brand-300 bg-brand-50 text-brand-700" : "bg-surface text-muted hover:text-foreground",
          )}
        >
          Largura
        </button>
      </div>

      <div ref={articleRef}>
        <article
          className={cn(
            "mx-auto break-words font-[425] [hyphens:auto]",
            wide ? "max-w-3xl" : "max-w-2xl",
          )}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "text-foreground/90",
                  i > 0 && "mt-6",
                  i === 0 &&
                    "first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.85] first-letter:text-brand-600",
                )}
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-muted italic">Este capítulo ainda não tem conteúdo.</p>
          )}
        </article>
      </div>
    </>
  );
}
