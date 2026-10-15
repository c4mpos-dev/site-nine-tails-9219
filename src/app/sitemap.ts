import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { seasons } from "@/content/seasons";
import { robots } from "@/content/robots";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/temporadas", "/robos", "/conquistas", "/impacto", "/equipe", "/patrocine", "/creditos", "/arquivo", "/pioneiros", "/embarque", "/recordes", "/glossario"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...seasons.map((s) => ({ url: `${site.url}/temporadas/${s.slug}`, priority: 0.7 })),
    ...robots.map((r) => ({ url: `${site.url}/robos/${r.slug}`, priority: 0.6 })),
  ];
}
