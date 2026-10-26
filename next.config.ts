import type { NextConfig } from "next";

const staticAssetCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=604800",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
    // Reaproveita páginas pré-carregadas durante navegação/voltar-atrás.
    // Mantém-se baixo para não mostrar dados de conta desatualizados.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  async headers() {
    return [
      { source: "/covers/:path*", headers: staticAssetCache },
      { source: "/banners/:path*", headers: staticAssetCache },
    ];
  },
};

export default nextConfig;
