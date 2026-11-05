import { nav, navMore } from "@/content/site";
import { seasons } from "@/content/seasons";
import { robots } from "@/content/robots";
import { awards } from "@/content/awards";
import { areas, mentors } from "@/content/people";
import { alumni } from "@/content/alumni";
import { glossary } from "@/content/glossary";
import { rooms } from "@/content/museum";
import { chapters } from "@/content/pioneers";
import { teamNames } from "@/content/allies";
import { sponsors } from "@/content/sponsors";
import { competitions } from "@/lib/events";

/**
 * Índice da busca do site (Ctrl+K). Carregado só quando a busca abre, com import(),
 * para não pesar nas páginas.
 */
export type SearchItem = {
  /** Título do resultado. */
  t: string;
  /** Linha de apoio. */
  s: string;
  /** Link. */
  h: string;
  /** Tipo, para o rótulo e o ícone. */
  k: "página" | "temporada" | "competição" | "robô" | "prêmio" | "pessoa" | "termo" | "museu" | "diário" | "equipe" | "patrocinador";
  /** Texto extra só para casar a busca. */
  x?: string;
};

export const searchIndex: SearchItem[] = [
  ...[
    { href: "/", label: "Início" },
    ...nav,
    ...navMore,
    { href: "/sponsor", label: "Apoie a equipe" },
    { href: "/credits", label: "Créditos das fotos" },
  ].map((p): SearchItem => ({ t: p.label, s: "note" in p ? p.note : "Página do site", h: p.href, k: "página" })),
  ...seasons.map((s): SearchItem => ({
    t: `${s.game} · ${s.year}`,
    s: s.headline,
    h: `/seasons/${s.slug}`,
    k: "temporada",
    x: [s.firstTheme, s.summary, ...s.highlights, ...s.gamePieces].join(" "),
  })),
  ...competitions.map((c): SearchItem => ({
    t: `${c.event.shortName} ${c.season.year}`,
    s: `${c.event.location} · ${c.event.dates} · ${c.event.result}`,
    h: `/competitions/${c.key}`,
    k: "competição",
    x: [c.event.name, c.robot?.name, c.season.game, ...(c.event.awards ?? [])].join(" "),
  })),
  ...robots.map((r): SearchItem => ({
    t: r.name,
    s: `${r.order} · ${r.year} · ${r.drivetrain}`,
    h: `/robots/${r.slug}`,
    k: "robô",
    x: [r.tagline, r.description, ...r.features, ...r.events].join(" "),
  })),
  ...awards.map((a): SearchItem => ({ t: a.title, s: `${a.event} · ${a.date}`, h: `/awards#${a.id}`, k: "prêmio", x: a.description })),
  ...mentors.map((p): SearchItem => ({ t: p.name, s: `Mentor · ${p.role}`, h: "/team#mentores", k: "pessoa", x: p.area })),
  ...alumni.map((p): SearchItem => ({ t: p.name, s: `Alumni · ${p.now ?? "Nine Tails"}`, h: "/alumni", k: "pessoa", x: [p.area, p.did, p.vibe, p.instagram].join(" ") })),
  ...areas.map((a): SearchItem => ({ t: a.name, s: "Área da equipe", h: `/team#area-${a.slug}`, k: "página", x: [a.description, ...a.tasks].join(" ") })),
  ...glossary.map((g): SearchItem => ({ t: g.term, s: g.def, h: `/glossary#${g.id}`, k: "termo" })),
  ...chapters.map((c): SearchItem => ({ t: c.title, s: `Os pioneiros · ${c.when}`, h: "/pioneers", k: "diário", x: c.text })),
  ...rooms.flatMap((r) =>
    r.wings.flatMap((w) =>
      w.pieces.map((p): SearchItem => ({
        t: p.title,
        s: `Museu · Sala ${r.number} · ${w.name}${p.when ? ` · ${p.when}` : ""}`,
        h: `/museum#${r.id}`,
        k: "museu",
        x: [p.note, r.title].join(" "),
      })),
    ),
  ),
  ...Object.entries(teamNames).map(([n, t]): SearchItem => ({
    t: `${n} ${t.name}`,
    s: `Equipe que jogou com ou contra a gente · ${t.city}`,
    h: "/records",
    k: "equipe",
  })),
  ...sponsors.map((s): SearchItem => ({ t: s.name, s: "Patrocinador", h: "/sponsor", k: "patrocinador" })),
];
