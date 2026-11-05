import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ClipReveal } from "@/components/ui/ClipReveal";
import { Counter } from "@/components/ui/Counter";
import { completedSeasons, seasons } from "@/content/seasons";
import { getRobot, robots } from "@/content/robots";
import { seasonLogos, seasonPhotos } from "@/content/credits";
import { SeasonLogo } from "@/components/seasons/SeasonLogo";
import { Countdown } from "@/components/seasons/Countdown";
import { teamPhotos } from "@/content/gallery";
import { bySeason, reach, record } from "@/lib/matchStats";
import { matches } from "@/content/matches";

export const metadata: Metadata = {
  title: "Temporadas",
  description:
    "Charged Up, Crescendo, Reefscape, REBUILT e BIOCORE: a trajetória da Nine Tails #9219 na FIRST Robotics Competition, temporada a temporada.",
};

const awardsOf = (s: (typeof seasons)[number]) => s.events.flatMap((e) => e.awards ?? []).filter((a) => !a.startsWith("Wildcard"));
const topScore = (slug: string) => Math.max(0, ...bySeason(slug).flatMap((e) => e.matches.map((m) => m[5])));
// "Playoffs — Round 5" vira "Round 5"; finalista fica como está
const short = (result: string) => result.replace(/^Playoffs — /, "");

export default function SeasonsPage() {
  const events = completedSeasons.flatMap((s) => s.events);
  const total = record(matches);
  const awardCount = completedSeasons.reduce((n, s) => n + awardsOf(s).length, 0);
  const numbers = [
    { v: completedSeasons.length, k: "temporadas" },
    { v: events.length, k: "eventos" },
    { v: total.total, k: "partidas oficiais" },
    { v: total.w, k: "vitórias" },
    { v: awardCount, k: "prêmios" },
    { v: robots.length, k: "robôs" },
  ];

  return (
    <>
      <PageHero
        kicker="Temporadas"
        title="Nossa trajetória na FRC"
        lead={`${completedSeasons.length} temporadas e ${events.length} eventos desde 2023. Cada ano tem um jogo novo e um robô construído do zero.`}
        image={{
          src: "/team/2024-brasilia-estacao-pilotos.webp",
          alt: "A drive team da Nine Tails na estação de pilotagem da Regional de Brasília 2024, com o número 9219 no placar e o speaker da Crescendo",
          position: "50% 40%",
        }}
      >
        <dl className="mt-10 grid max-w-4xl grid-cols-3 gap-6 sm:grid-cols-6">
          {numbers.map((x) => (
            <div key={x.k} className="border-t border-white/30 pt-3">
              <dd className="heading text-4xl">
                <Counter value={x.v} />
              </dd>
              <dt className="text-sm text-white/75">{x.k}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Os capítulos, do mais novo ao primeiro */}
      <Container className="py-16">
        <SectionHeading kicker="Capítulo a capítulo" title="Todas as temporadas" />
        <div className="mt-12 space-y-16 lg:space-y-24">
          {[...seasons].reverse().map((s) => {
            const team = teamPhotos[s.slug]?.[0];
            const stock = s.photos[0] ? seasonPhotos[s.photos[0]] : undefined;
            const cover = team ?? (stock ? { src: stock.src, caption: stock.caption, position: undefined } : undefined);
            const awards = awardsOf(s);
            const best = s.events.length ? s.events.reduce((a, b) => (reach(b.result) > reach(a.result) ? b : a)) : undefined;
            const playoffs = s.events.filter((e) => reach(e.result) > 0).length;
            const bots = s.robots.map((r) => getRobot(r)).filter((r) => r !== undefined);
            const logo = seasonLogos[s.motif];
            const upcoming = s.status === "upcoming";
            return (
              <Reveal key={s.slug}>
                <article className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
                  {/* Foto com o ano gigante e a logo do jogo */}
                  <ClipReveal>
                    <Link href={`/seasons/${s.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-surface-2 ring-1 ring-line">
                      {cover ? (
                        <Image
                          quality={90}
                          src={cover.src}
                          alt={cover.caption}
                          fill
                          sizes="(min-width:1024px) 40vw, 95vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectPosition: cover.position }}
                        />
                      ) : (
                        // Temporada sem foto ainda: a raposa esperando, com a cauda da vez tracejada em volta
                        <div className="absolute inset-0 grid place-items-center bg-[#160b20]">
                          <div className="absolute size-[62%] animate-[spin_40s_linear_infinite] rounded-full border-2 border-dashed border-[#f0a6e8]/40 motion-reduce:animate-none" />
                          <Image src="/brand/emblem.webp" alt="" width={240} height={220} className="w-[38%] opacity-60" />
                          <span className="absolute right-4 top-4 rounded bg-white/10 px-2 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#f0a6e8]">
                            Em preparação
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <span className="heading absolute bottom-2 left-4 text-7xl text-white/90 sm:text-8xl">{s.year}</span>
                      {logo && <SeasonLogo src={logo} game={s.game} className="absolute right-3 top-3 shadow-md" />}
                    </Link>
                  </ClipReveal>

                  <div>
                    <p className="kicker">
                      {s.firstTheme} · Cauda {s.tail}
                    </p>
                    <h2 className="heading mt-2 text-4xl sm:text-5xl">
                      <Link href={`/seasons/${s.slug}`} className="transition-colors hover:text-accent">
                        {s.game}
                      </Link>
                    </h2>
                    <p className="mt-2 text-lg font-bold">{s.headline}</p>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{s.summary}</p>

                    {upcoming ? (
                      <div className="mt-6">
                        <p className="text-sm text-muted">Faltam para o kickoff:</p>
                        <Countdown className="mt-2" />
                      </div>
                    ) : (
                      <>
                        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-4 sm:grid-cols-4">
                          <div>
                            <dt className="text-xs text-muted">Eventos</dt>
                            <dd className="heading text-3xl">{s.events.length}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Nos playoffs</dt>
                            <dd className="heading text-3xl">
                              {playoffs} <span className="text-lg text-muted">de {s.events.length}</span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Melhor resultado</dt>
                            <dd className="heading text-3xl">{best ? short(best.result) : "—"}</dd>
                          </div>
                          {/* Sem prêmio no ano, o maior placar ocupa o lugar */}
                          {awards.length ? (
                            <div>
                              <dt className="text-xs text-muted">Prêmios</dt>
                              <dd className="heading text-3xl text-accent">{awards.length}</dd>
                            </div>
                          ) : (
                            <div>
                              <dt className="text-xs text-muted">Maior placar</dt>
                              <dd className="heading text-3xl">{topScore(s.slug)}</dd>
                            </div>
                          )}
                        </dl>

                        <ul className="mt-5 space-y-2 text-sm">
                          {s.events.map((e) => (
                            <li key={e.key}>
                              <Link href={`/competitions/${e.key}`} className="group flex flex-wrap items-baseline gap-x-2">
                                <span className="font-bold transition-colors group-hover:text-accent">{e.shortName}</span>
                                <span className="text-muted">
                                  {e.dates}
                                  {reach(e.result) > 0 && ` · ${e.result}`}
                                </span>
                                {e.awards
                                  ?.filter((a) => !a.startsWith("Wildcard"))
                                  .map((a) => (
                                    <span key={a} className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-bold text-accent">
                                      {a}
                                    </span>
                                  ))}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                      {bots.map((r) => (
                        <Link key={r.slug} href={`/robots/${r.slug}`} className="group flex items-center gap-3">
                          <span className="relative size-12 overflow-hidden rounded-full bg-surface-2 ring-2 ring-line transition-all group-hover:ring-accent">
                            {(r.thumb || r.photo) && (
                              <Image
                                src={r.thumb?.src ?? r.photo!}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                                style={{ objectPosition: r.thumb?.position ?? r.photoPosition ?? "center" }}
                              />
                            )}
                          </span>
                          <span className="leading-tight">
                            <span className="heading block text-lg transition-colors group-hover:text-accent">{r.name}</span>
                            <span className="text-xs text-muted">{r.drivetrain}</span>
                          </span>
                        </Link>
                      ))}
                      <Link href={`/seasons/${s.slug}`} className="text-link ml-auto inline-flex items-center gap-1 text-sm">
                        {upcoming ? "O que já sabemos" : "Ver a temporada completa"} <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </>
  );
}
