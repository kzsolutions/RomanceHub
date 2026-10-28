/**
 * URL pública do site, sem barra final.
 *
 * Em produção usa `NEXT_PUBLIC_SITE_URL` (domínio próprio) ou, quando essa
 * variável aponta para localhost, o domínio fornecido pelo Vercel.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const configured = raw ? raw.replace(/\/+$/, "") : "";
  const configuredWithProtocol = configured
    ? /^https?:\/\//i.test(configured)
      ? configured
      : `https://${configured}`
    : "";

  const isLocal =
    !configuredWithProtocol ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredWithProtocol);

  if (configuredWithProtocol && !isLocal) return configuredWithProtocol;

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    const withProtocol = /^https?:\/\//i.test(vercelUrl)
      ? vercelUrl
      : `https://${vercelUrl}`;
    return withProtocol.replace(/\/+$/, "");
  }

  return configuredWithProtocol || "http://localhost:3000";
}
