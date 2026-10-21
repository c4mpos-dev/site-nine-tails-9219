import { seasons, type EventResult, type Season } from "@/content/seasons";
import { robots } from "@/content/robots";
import { rooms, type Piece } from "@/content/museum";
import { roundTripKm, trips } from "@/content/trips";
import { byEvent } from "@/lib/matchStats";

/** Ala do museu com as fotos de cada competição (sala = temporada). */
const museumWing: Record<string, [room: string, wing: string]> = {
  "2023-brasilia": ["charged-up", "Ala Brasília"],
  "2023-houston": ["charged-up", "Ala Houston"],
  "2023-rio": ["charged-up", "Ala Rio de Janeiro"],
  "2024-brasilia": ["crescendo", "Ala Brasília"],
  "2024-cuiaba": ["crescendo", "Ala Cuiabá"],
  "2025-brasilia": ["reefscape", "Ala Brasília"],
  "2025-sao-paulo": ["reefscape", "Ala São Paulo"],
  "2026-sao-paulo": ["rebuilt", "Ala São Paulo"],
};

/** Cidade da viagem (painel de embarque) de cada competição. */
const tripCode: Record<string, string> = {
  "2023-brasilia": "BSB",
  "2023-houston": "HOU",
  "2023-rio": "RIO",
  "2024-brasilia": "BSB",
  "2024-cuiaba": "CGB",
  "2025-brasilia": "BSB",
  "2025-sao-paulo": "SAO",
  "2025-porto-alegre": "POA",
  "2026-sao-paulo": "SAO",
  "2026-osasco": "OSA",
};

const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Primeiro dia do evento a partir de "16–18 mar 2023" ou "28 fev – 2 mar 2024". */
export function startDate(dates: string): Date {
  const year = Number(dates.match(/\d{4}/)![0]);
  const m = dates.match(/^(\d{1,2})\s*(?:([a-z]{3})\s*)?[–-]/i) ?? dates.match(/^(\d{1,2})\s*([a-z]{3})/i);
  const day = Number(m?.[1] ?? 1);
  const mon = m?.[2] ?? dates.match(/([a-z]{3})\s+\d{4}/i)![1];
  return new Date(Date.UTC(year, months.indexOf(mon.toLowerCase()), day));
}

export type Competition = {
  key: string;
  event: EventResult;
  season: Season;
  robot?: (typeof robots)[number];
  photos: Piece[];
  km?: number;
  start: Date;
};

export const competitions: Competition[] = seasons.flatMap((season) =>
  season.events.map((event) => {
    const w = museumWing[event.key];
    const photos = w ? (rooms.find((r) => r.id === w[0])?.wings.find((x) => x.name === w[1])?.pieces ?? []) : [];
    const trip = trips.find((t) => t.code === tripCode[event.key] && t.date.endsWith(String(season.year)));
    return {
      key: event.key,
      event,
      season,
      robot: robots.find((r) => r.matchEvents?.includes(event.key)),
      photos,
      km: trip ? roundTripKm(trip) : undefined,
      start: startDate(event.dates),
    };
  }),
);

export const getCompetition = (key: string) => competitions.find((c) => c.key === key);
export const competitionMatches = (key: string) => byEvent(key);
