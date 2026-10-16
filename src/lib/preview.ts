/**
 * Regra da prévia gratuita das histórias premium.
 *
 * Espelha exactamente a função SQL `public.story_preview_limit(uuid)` (migração
 * 0007), que é a fonte de verdade para a segurança (RLS). Esta versão serve a
 * interface e deve manter-se em sincronia com a função SQL:
 *   - histórias gratuitas: toda a obra é legível;
 *   - caso contrário: floor(publishedCount * percent / 100), com o mínimo
 *     aplicado apenas quando a história tem pelo menos PREVIEW_MIN_THRESHOLD
 *     capítulos publicados; nunca superior ao número de publicados.
 */

export const PREVIEW_MIN_THRESHOLD = 6;
export const DEFAULT_PREVIEW_PERCENT = 50;
export const DEFAULT_PREVIEW_MIN = 3;

export function previewChapterLimit({
  publishedCount,
  isFree,
  previewPercent,
  previewMin,
}: {
  publishedCount: number;
  isFree: boolean;
  previewPercent?: number | null;
  previewMin?: number | null;
}): number {
  if (isFree) return publishedCount;

  const percent = previewPercent ?? DEFAULT_PREVIEW_PERCENT;
  const min = previewMin ?? DEFAULT_PREVIEW_MIN;

  if (publishedCount <= 0) return 0;

  const byPercent = Math.floor((publishedCount * percent) / 100);
  const base =
    publishedCount >= PREVIEW_MIN_THRESHOLD ? Math.max(min, byPercent) : byPercent;

  return Math.min(publishedCount, Math.max(0, base));
}
