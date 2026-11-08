import type { Metadata } from "next";
import { site } from "@/content/site";

/** Descrição de busca e de prévia: o Google corta em ~160 caracteres, então cortamos antes, numa palavra. */
export const shortDescription = (s: string, n = 158) =>
  s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:.\s]+$/, "")}…`;

/**
 * Metadados de uma página: título, descrição curta, endereço canônico e a prévia de link
 * (a thumb vem do opengraph-image.tsx da própria rota).
 */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const d = shortDescription(description);
  return {
    ...(title && { title }),
    description: d,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.fullName,
      url: path,
      ...(title && { title: `${title} · ${site.fullName}` }),
      description: d,
    },
    twitter: { card: "summary_large_image", ...(title && { title: `${title} · ${site.fullName}` }), description: d },
  };
}
