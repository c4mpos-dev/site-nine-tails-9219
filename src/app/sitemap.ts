import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { seasons } from "@/content/seasons";
import { robots } from "@/content/robots";
import { competitions } from "@/lib/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/seasons", "/robots", "/awards", "/impact", "/team", "/sponsor", "/credits", "/archive", "/pioneers", "/travel", "/records", "/glossary", "/brand", "/museum", "/alumni"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...seasons.map((s) => ({ url: `${site.url}/seasons/${s.slug}`, priority: 0.7 })),
    ...robots.map((r) => ({ url: `${site.url}/robots/${r.slug}`, priority: 0.6 })),
    ...competitions.map((c) => ({ url: `${site.url}/competitions/${c.key}`, priority: 0.5 })),
  ];
}
