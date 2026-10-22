import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Fotos grandes (topos, galerias) usam 90; o resto fica no padrão 75.
  images: { qualities: [75, 90] },
  // As rotas passaram para inglês; os links antigos, em português, continuam funcionando.
  // /museu só na raiz: /museu/* são as fotos em public/museu.
  async redirects() {
    return [
      { source: "/arquivo", destination: "/archive", permanent: true },
      { source: "/arquivo/:path+", destination: "/archive/:path+", permanent: true },
      { source: "/competicoes", destination: "/competitions", permanent: true },
      { source: "/competicoes/:path+", destination: "/competitions/:path+", permanent: true },
      { source: "/conquistas", destination: "/awards", permanent: true },
      { source: "/conquistas/:path+", destination: "/awards/:path+", permanent: true },
      { source: "/creditos", destination: "/credits", permanent: true },
      { source: "/creditos/:path+", destination: "/credits/:path+", permanent: true },
      { source: "/embarque", destination: "/travel", permanent: true },
      { source: "/embarque/:path+", destination: "/travel/:path+", permanent: true },
      { source: "/equipe", destination: "/team", permanent: true },
      { source: "/equipe/:path+", destination: "/team/:path+", permanent: true },
      { source: "/glossario", destination: "/glossary", permanent: true },
      { source: "/glossario/:path+", destination: "/glossary/:path+", permanent: true },
      { source: "/impacto", destination: "/impact", permanent: true },
      { source: "/impacto/:path+", destination: "/impact/:path+", permanent: true },
      { source: "/museu", destination: "/museum", permanent: true },
      { source: "/patrocine", destination: "/sponsor", permanent: true },
      { source: "/patrocine/:path+", destination: "/sponsor/:path+", permanent: true },
      { source: "/pioneiros", destination: "/pioneers", permanent: true },
      { source: "/pioneiros/:path+", destination: "/pioneers/:path+", permanent: true },
      { source: "/recordes", destination: "/records", permanent: true },
      { source: "/recordes/:path+", destination: "/records/:path+", permanent: true },
      { source: "/robos", destination: "/robots", permanent: true },
      { source: "/robos/:path+", destination: "/robots/:path+", permanent: true },
      { source: "/temporadas", destination: "/seasons", permanent: true },
      { source: "/temporadas/:path+", destination: "/seasons/:path+", permanent: true },
      { source: "/toca", destination: "/brand", permanent: true },
      { source: "/toca/:path+", destination: "/brand/:path+", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
