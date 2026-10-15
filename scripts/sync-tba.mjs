/**
 * Sincroniza as partidas da Nine Tails com a API do The Blue Alliance.
 *
 *   npm run sync:tba
 *
 * Gera src/content/matches.ts (partidas + vídeo) e src/content/teams.ts (nome e cidade
 * de todas as equipes que cruzaram com a raposa). Roda sozinho antes de cada build;
 * sem a chave TBA_API_KEY (ou sem internet) ele avisa e mantém os arquivos atuais.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const TEAM = "frc9219";
const FIRST_YEAR = 2023;

/** Chave do evento no TBA -> slug usado no site (ver matchEvents em src/content/allies.ts). */
const EVENT_SLUGS = {
  "2023brbr": "2023-brasilia",
  "2023cur": "2023-houston",
  "2023xxrio": "2023-rio",
  "2024brbr": "2024-brasilia",
  "2024xxcui": "2024-cuiaba",
  "2025brba": "2025-brasilia",
  "2025brsp": "2025-sao-paulo",
  "2025rspor": "2025-porto-alegre",
  "2026brba": "2026-sao-paulo",
  "2026brsp": "2026-osasco",
};

function readKey() {
  if (process.env.TBA_API_KEY) return process.env.TBA_API_KEY;
  const file = `${root}.env.local`;
  if (!existsSync(file)) return null;
  const line = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("TBA_API_KEY="));
  return line ? line.slice("TBA_API_KEY=".length).trim() : null;
}

const key = readKey();
if (!key) {
  console.warn("[tba] Sem TBA_API_KEY: mantendo os dados atuais.");
  process.exit(0);
}

async function tba(path) {
  const res = await fetch(`https://www.thebluealliance.com/api/v3${path}`, { headers: { "X-TBA-Auth-Key": key } });
  if (!res.ok) throw new Error(`${res.status} em ${path}`);
  return res.json();
}

const levelOrder = { qm: 0, ef: 1, qf: 2, sf: 3, f: 4 };
const label = (m) => (m.comp_level === "qm" ? `Q${m.match_number}` : m.comp_level === "f" ? `F${m.match_number}` : `P${m.set_number}`);
const num = (k) => Number(k.slice(3));

try {
  const currentYear = new Date().getFullYear();
  const events = [];
  for (let y = FIRST_YEAR; y <= currentYear + 1; y++) {
    const list = await tba(`/team/${TEAM}/events/${y}/simple`);
    events.push(...list.sort((a, b) => a.start_date.localeCompare(b.start_date)));
  }

  const rows = [];
  const teams = new Map();
  for (const ev of events) {
    const slug = EVENT_SLUGS[ev.key];
    if (!slug) console.warn(`[tba] Evento novo: ${ev.key} (${ev.name}). Adicione em EVENT_SLUGS e em matchEvents.`);
    const [ms, evTeams] = await Promise.all([tba(`/team/${TEAM}/event/${ev.key}/matches`), tba(`/event/${ev.key}/teams/simple`)]);
    for (const t of evTeams) teams.set(t.team_number, t);

    ms.sort((a, b) => levelOrder[a.comp_level] - levelOrder[b.comp_level] || a.set_number - b.set_number || a.match_number - b.match_number);
    for (const m of ms) {
      const red = m.alliances.red.team_keys.includes(TEAM);
      const us = red ? m.alliances.red : m.alliances.blue;
      const them = red ? m.alliances.blue : m.alliances.red;
      if (us.score < 0) continue; // ainda não jogada
      const res = us.score > them.score ? "W" : us.score < them.score ? "L" : "T";
      const video = m.videos?.find((v) => v.type === "youtube")?.key ?? null;
      rows.push([
        slug ?? ev.key,
        label(m),
        red ? "R" : "B",
        us.team_keys.filter((t) => t !== TEAM).map(num),
        them.team_keys.map(num),
        us.score,
        them.score,
        res,
        video,
      ]);
    }
  }

  const matchesTs =
    "/* Gerado por scripts/sync-tba.mjs a partir da API do The Blue Alliance. Não editar à mão. */\n" +
    'export type Match = [event: string, label: string, side: "R" | "B", allies: number[], opponents: number[], ours: number, theirs: number, result: "W" | "L" | "T", video: string | null];\n\n' +
    "export const matches: Match[] = [\n" +
    rows.map((r) => `  ${JSON.stringify(r)},\n`).join("") +
    "];\n";
  writeFileSync(`${root}src/content/matches.ts`, matchesTs);

  const teamsTs =
    "/* Gerado por scripts/sync-tba.mjs: equipes que já cruzaram com a Nine Tails. Não editar à mão. */\n" +
    "export const teams: Record<number, { name: string; city: string }> = {\n" +
    [...teams.values()]
      .sort((a, b) => a.team_number - b.team_number)
      .map((t) => {
        const city = [t.city, t.state_prov].filter(Boolean).join(", ");
        return `  ${t.team_number}: ${JSON.stringify({ name: t.nickname ?? "", city })},\n`;
      })
      .join("") +
    "};\n";
  writeFileSync(`${root}src/content/teams.ts`, teamsTs);

  const withVideo = rows.filter((r) => r[8]).length;
  console.log(`[tba] ${rows.length} partidas em ${events.length} eventos (${withVideo} com vídeo), ${teams.size} equipes.`);
} catch (err) {
  console.warn(`[tba] Falha ao sincronizar (${err.message}): mantendo os dados atuais.`);
}
