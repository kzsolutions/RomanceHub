import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/autor",
          "/api/",
          "/auth/",
          "/entrar",
          "/criar-conta",
          "/recuperar-palavra-passe",
          "/perfil",
          "/biblioteca",
          "/favoritos",
          "/compras",
          "/notificacoes",
          "/pagamento/",
          "/comprar/",
          "/pesquisa",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
