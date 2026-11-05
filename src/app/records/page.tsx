import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WatchButton } from "@/components/seasons/VideoDialog";
import { MatchTrail, TrailLegend } from "@/components/records/MatchTrail";
import { bySeason, byEvent, reach, records, videoOf } from "@/lib/matchStats";
import { matches } from "@/content/matches";
import { matchEvents } from "@/content/allies";
import { completedSeasons } from "@/content/seasons";

export const metadata: Metadata = {
  title: "Recordes",
  description: "Os recordes da Nine Tails #9219 em partidas oficiais: maiores placares, sequências de vitórias e o aproveitamento de cada temporada.",
};

const score = (s: string) => s.split(" x ").map(Number);

/** Recordes da raposa, tirados das partidas oficiais registradas no The Blue Alliance. */
export default function RecordsPage() {
  const r = records();
  const total = r.total;
  const points = matches.reduce((a, m) => a + m[5], 0);

  // Melhor posição no ranking de qualificação, entre todas as competições
  const ranked = completedSeasons.flatMap((s) => s.events).filter((e) => typeof e.rank === "number");
  const bestRank = ranked.reduce((a, b) => (b.rank! < a.rank! ? b : a));

  const [bigOurs, bigTheirs] = score(r.biggest.score);
  const [closeOurs, closeTheirs] = score(r.closest.score);
  const scoreboards = [
    { k: "Maior placar", ours: r.best.score, theirs: r.best.against, where: r.best.where, video: r.best.video, note: `${r.best.score} pontos numa partida` },
    { k: "Maior vitória", ours: bigOurs, theirs: bigTheirs, where: r.biggest.where, video: r.biggest.video, note: `+${r.biggest.margin} de diferença` },
    { k: "Vitória mais apertada", ours: closeOurs, theirs: closeTheirs, where: r.closest.where, video: r.closest.video, note: `por ${r.closest.margin} ponto${r.closest.margin === 1 ? "" : "s"}` },
  ];

  const marks = [
    { k: "Maior sequência", v: r.streak.count, unit: "vitórias seguidas", d: r.streak.where },
    { k: "Melhor campanha", v: r.bestEvent.pct, unit: "% de vitórias", d: `${r.bestEvent.name} · ${r.bestEvent.w}-${r.bestEvent.l}-${r.bestEvent.t}` },
    { k: "Melhor ranking", v: bestRank.rank!, unit: "º nas qualificações", d: `${bestRank.shortName} · ${bestRank.dates.split(" ").slice(-1)[0]}` },
  ];

  const events = completedSeasons.flatMap((s) => s.events);
  const playoffs = events.filter((e) => reach(e.result) > 0).length;

  // Temporada a temporada: o melhor de cada jogo (resultado, ranking, prêmios e o maior placar)
  const perSeason = completedSeasons.map((s) => {
    const ms = bySeason(s.slug).flatMap((e) => e.matches);
    const top = ms.reduce((a, b) => (b[5] > a[5] ? b : a));
    const best = s.events.reduce((a, b) => (reach(b.result) > reach(a.result) ? b : a));
    const ranks = s.events.filter((e) => typeof e.rank === "number");
    const rank = ranks.length ? ranks.reduce((a, b) => (b.rank! < a.rank! ? b : a)) : undefined;
    const awards = s.events.flatMap((e) => e.awards ?? []).filter((a) => !a.startsWith("Wildcard"));
    return { s, best, rank, awards, top, video: videoOf(top) };
  });

  const groups = Object.entries(matchEvents)
    .map(([key, e]) => ({ key, name: e.short, matches: byEvent(key) }))
    .filter((g) => g.matches.length > 0);

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/archive", label: "Mais" },
          { href: "/records", label: "Recordes" },
        ]}
        kicker="Em quadra"
        title="Recordes da raposa"
        lead={`${total.total} partidas oficiais desde 2023. Os maiores placares, as sequências e o melhor de cada temporada da Nine Tails.`}
        image={{ src: "/team/2023-the-answer-partida.webp", alt: "O The Answer, robô 9219, em partida no Off-Season do Rio de Janeiro 2023", position: "50% 78%" }}
      >
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { v: total.total, k: "partidas oficiais" },
            { v: total.w, k: "vitórias" },
            { v: playoffs, k: "vezes nos playoffs" },
            { v: points, k: "pontos marcados" },
          ].map((x) => (
            <div key={x.k} className="border-t border-white/30 pt-3">
              <dd className="heading text-4xl">
                <Counter value={x.v} />
              </dd>
              <dt className="text-sm text-white/75">{x.k}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Placares recordes, no estilo do telão da arena */}
      <Container className="py-16">
        <SectionHeading kicker="No telão" title="Os placares que ficaram" />
        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-3">
          {scoreboards.map((b) => (
            <RevealItem key={b.k} className="h-full">
              <div className="flex h-full flex-col rounded-xl bg-[#160b20] p-6 text-white ring-1 ring-white/10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f0a6e8]">{b.k}</p>
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3 text-center">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Nine Tails</p>
                    <p className="heading text-6xl tabular-nums text-[#f0a6e8]">{b.ours}</p>
                  </div>
                  <span className="heading pb-3 text-3xl text-white/40">x</span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Adversários</p>
                    <p className="heading text-6xl tabular-nums text-white/70">{b.theirs}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="text-sm text-white/70">
                    <span className="block font-bold text-white">{b.note}</span>
                    {b.where}
                  </p>
                  {b.video && <WatchButton video={b.video} className="shrink-0 !text-[#f0a6e8]" />}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-4 grid gap-4 md:grid-cols-3">
          {marks.map((m) => (
            <RevealItem key={m.k} className="rounded-xl border border-line p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{m.k}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="heading text-5xl">
                  <Counter value={m.v} />
                </span>
                <span className="text-muted">{m.unit}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{m.d}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>

      {/* Todas as partidas */}
      <section className="border-y border-line bg-surface">
        <Container className="py-16">
          <SectionHeading
            kicker="Partida a partida"
            title={`As ${total.total} partidas, em ordem`}
            lead="Cada quadrado é uma partida oficial. Nas qualificações, os parceiros de aliança são sorteados a cada partida, então o resultado é de três equipes, não de uma. Passe o mouse para ver o placar e clique para assistir."
          />
          <div className="mt-6">
            <TrailLegend />
          </div>
          <div className="mt-10">
            <MatchTrail groups={groups} streak={r.streak.ids} />
          </div>
        </Container>
      </section>

      {/* Temporada a temporada */}
      <Container className="py-16">
        <SectionHeading kicker="Ano a ano" title="O melhor de cada temporada" lead="Cada jogo tem regras e pontuação próprias, então cada temporada conta a sua história." />
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {perSeason.map(({ s, best, rank, awards, top, video }) => (
            <li key={s.slug} className="grid gap-x-8 gap-y-4 py-6 sm:grid-cols-2 lg:grid-cols-[10rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)_11rem] lg:items-start">
              <Link href={`/seasons/${s.slug}`} className="group sm:col-span-2 lg:col-span-1">
                <span className="font-mono text-xs text-muted">{s.year}</span>
                <span className="heading block text-2xl transition-colors group-hover:text-accent">{s.game}</span>
              </Link>
              <div className="text-sm">
                <p className="text-muted">Melhor resultado</p>
                <p className="mt-0.5 font-bold">{best.result}</p>
                <Link href={`/competitions/${best.key}`} className="text-muted hover:text-accent">
                  {best.shortName}
                </Link>
              </div>
              {/* Ranking quando a raposa ficou no top 10; senão, a aliança dos playoffs */}
              <div className="text-sm">
                {rank && rank.rank! <= 10 ? (
                  <>
                    <p className="text-muted">Melhor ranking</p>
                    <p className="heading text-3xl">{rank.rank}º</p>
                    <p className="text-muted">{rank.shortName}</p>
                  </>
                ) : (
                  <>
                    <p className="text-muted">Nos playoffs</p>
                    <p className="mt-0.5 font-bold">{best.alliance ?? "—"}</p>
                  </>
                )}
              </div>
              {/* Prêmios; sem prêmio, o destaque da temporada */}
              <div className="text-sm">
                <p className="text-muted">{awards.length ? "Prêmios" : "Destaque"}</p>
                {awards.length ? (
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {awards.map((a) => (
                      <li key={a} className="rounded bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-0.5 font-bold">{s.highlights[0]}</p>
                )}
              </div>
              <div className="text-sm">
                <p className="text-muted">Maior placar</p>
                <p className="font-bold tabular-nums">
                  {top[5]} x {top[6]} <span className="font-normal text-muted">· {matchEvents[top[0]]?.short}</span>
                </p>
                {video && <WatchButton video={video} className="mt-1" />}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-muted">
          Fonte: todas as partidas registradas no{" "}
          <a href="https://www.thebluealliance.com/team/9219" target="_blank" rel="noreferrer" className="text-link">
            The Blue Alliance
          </a>
          , incluindo off-seasons.{" "}
          <Link href="/archive" className="text-link">
            Mais páginas
          </Link>
        </p>
      </Container>
    </>
  );
}
