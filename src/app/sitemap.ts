import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { seasons } from "@/content/seasons";
import { robots } from "@/content/robots";
import { competitions } from "@/lib/events";

/** Data do build: o site é todo gerado de uma vez, então tudo muda junto. */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/seasons", "/robots", "/awards", "/impact", "/team", "/sponsor", "/credits", "/archive", "/pioneers", "/travel", "/records", "/glossary", "/museum", "/alumni"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...seasons.map((s) => ({ url: `${site.url}/seasons/${s.slug}`, lastModified, priority: 0.7 })),
    ...robots.map((r) => ({ url: `${site.url}/robots/${r.slug}`, lastModified, priority: 0.6 })),
    ...competitions.map((c) => ({ url: `${site.url}/competitions/${c.key}`, lastModified, priority: 0.5 })),
  ];
}
