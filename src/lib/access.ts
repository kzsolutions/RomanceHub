/**
 * Janela de acesso livre temporário.
 *
 * Nesta fase queremos que TODAS as histórias fiquem legíveis gratuitamente por
 * membros com sessão, sem apagar nada nem desactivar a lógica de compra
 * existente. A lógica permanece intacta: apenas se força o acesso enquanto a
 * janela estiver activa. Visitantes continuam limitados ao primeiro capítulo.
 *
 * Quando `FREE_ACCESS_UNTIL` passar, tudo volta ao comportamento normal
 * automaticamente (histórias premium voltam a exigir compra/prévia).
 *
 * Mantém esta data em sincronia com a função SQL `public.free_access_until()`
 * (migração 0012), que é a fonte de verdade para a segurança (RLS).
 */
export const FREE_ACCESS_UNTIL = "2026-12-26T23:59:59Z";

export function isFreeAccessActive(now: Date = new Date()): boolean {
  return now.getTime() < new Date(FREE_ACCESS_UNTIL).getTime();
}

/**
 * Quantos capítulos um visitante (sem sessão) pode ler antes de criar conta.
 * O primeiro capítulo é livre em todas as histórias; do segundo em diante é
 * obrigatório ter conta.
 */
export const GUEST_FREE_CHAPTERS = 1;

export function guestCanRead(chapterNumber: number): boolean {
  return chapterNumber <= GUEST_FREE_CHAPTERS;
}

/** Página para onde o visitante deve voltar depois de entrar/criar conta. */
export function readerPath(slug: string, chapterNumber: number): string {
  return `/ler/${slug}/${chapterNumber}`;
}
