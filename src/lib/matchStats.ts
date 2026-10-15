import { matches, type Match } from "@/content/matches";
import { isDemoTeam, matchEvents, teamInfo } from "@/content/allies";

export const byEvent = (key: string) => matches.filter((m) => m[0] === key);
export const bySeason = (season: string) =>
  Object.entries(matchEvents)
    .filter(([, e]) => e.season === season)
    .map(([key, e]) => ({ key, ...e, matches: byEvent(key) }))
    .filter((e) => e.matches.length > 0);

export function record(ms: Match[]) {
  const w = ms.filter((m) => m[7] === "W").length;
  const l = ms.filter((m) => m[7] === "L").length;
  const t = ms.filter((m) => m[7] === "T").length;
  return { w, l, t, total: ms.length, label: `${w}-${l}-${t}` };
}

const fmt = (m: Match) => `${matchEvents[m[0]]?.short ?? m[0]} · ${m[1]}`;
/** Vídeo da partida, pronto para o player (ou null se o TBA não tem). */
export const videoOf = (m: Match) => (m[8] ? { id: m[8], title: `${fmt(m)}: ${m[5]} x ${m[6]}` } : null);

/** Apelidos das equipes que aparecem nas partidas, para os tooltips. */
export function namesFor(ms: Match[]) {
  const out: Record<number, string> = {};
  for (const n of ms.flatMap((m) => [...m[3], ...m[4]])) {
    const name = teamInfo(n)?.name;
    if (name) out[n] = name;
  }
  return out;
}

/** Recordes da raposa calculados direto das partidas. */
export function records() {
  const all = matches;
  const best = all.reduce((a, b) => (b[5] > a[5] ? b : a));
  const wins = all.filter((m) => m[7] === "W");
  const biggest = wins.reduce((a, b) => (b[5] - b[6] > a[5] - a[6] ? b : a));
  const closest = wins.reduce((a, b) => (b[5] - b[6] < a[5] - a[6] ? b : a));

  let streak = 0;
  let bestStreak = 0;
  let streakEnd: Match = all[0];
  for (const m of all) {
    streak = m[7] === "W" ? streak + 1 : 0;
    if (streak > bestStreak) {
      bestStreak = streak;
      streakEnd = m;
    }
  }

  const events = Object.keys(matchEvents).map((key) => ({ key, ...record(byEvent(key)) })).filter((e) => e.total > 0);
  const bestEvent = events.reduce((a, b) => (b.w / b.total > a.w / a.total ? b : a));

  return {
    total: record(all),
    best: { score: best[5], against: best[6], where: fmt(best), video: videoOf(best) },
    biggest: { margin: biggest[5] - biggest[6], score: `${biggest[5]} x ${biggest[6]}`, where: fmt(biggest), video: videoOf(biggest) },
    closest: { margin: closest[5] - closest[6], score: `${closest[5]} x ${closest[6]}`, where: fmt(closest), video: videoOf(closest) },
    streak: { count: bestStreak, where: matchEvents[streakEnd[0]]?.short ?? streakEnd[0] },
    bestEvent: { ...bestEvent, name: matchEvents[bestEvent.key]?.short ?? bestEvent.key, pct: Math.round((bestEvent.w / bestEvent.total) * 100) },
  };
}

/** Equipes que mais jogaram do nosso lado, com o retrospecto juntas. */
export function topAllies(limit = 10) {
  const map = new Map<number, Match[]>();
  for (const m of matches) {
    for (const t of m[3]) {
      if (isDemoTeam(t)) continue;
      map.set(t, [...(map.get(t) ?? []), m]);
    }
  }
  return [...map.entries()]
    .map(([team, ms]) => ({ team, ...record(ms), events: [...new Set(ms.map((m) => matchEvents[m[0]]?.short ?? m[0]))] }))
    .sort((a, b) => b.total - a.total || b.w - a.w)
    .slice(0, limit);
}

/** Adversários mais frequentes. */
export function topRivals(limit = 6) {
  const map = new Map<number, Match[]>();
  for (const m of matches) {
    for (const t of m[4]) {
      if (isDemoTeam(t)) continue;
      map.set(t, [...(map.get(t) ?? []), m]);
    }
  }
  return [...map.entries()]
    .map(([team, ms]) => ({ team, ...record(ms) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
