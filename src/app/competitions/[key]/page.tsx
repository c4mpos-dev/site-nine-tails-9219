import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Plane } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { MatchLegend, MatchStrip } from "@/components/seasons/MatchStrip";
import { WatchButton } from "@/components/seasons/VideoDialog";
import { Trophy } from "@/components/graphics/Trophies";
import { awards } from "@/content/awards";
import { teamInfo } from "@/content/allies";
import { seasonTeamCover } from "@/content/gallery";
import { competitionMatches, competitions, getCompetition } from "@/lib/events";
import { namesFor, record, videoOf } from "@/lib/matchStats";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

const kindLabel = { regional: "Regional", championship: "Mundial", offseason: "Off-season" };

export function generateStaticParams() {
  return competitions.map((c) => ({ key: c.key }));
}

export async function generateMetadata({ params }: PageProps<"/competitions/[key]">): Promise<Metadata> {
  const { key } = await params;
  const c = getCompetition(key);
  if (!c) return {};
  return {
    title: `${c.event.shortName} ${c.season.year}`,
    description: `${c.event.name} (${c.event.location}, ${c.event.dates}): resultado, partidas com vídeo, fotos e prêmios da Nine Tails #9219.`,
  };
}

const team = (n: number) => {
  const t = teamInfo(n);
  // Equipes demo do off-season já trazem o número no nome
  return !t ? String(n) : t.name.includes(String(n)) ? t.name : `${n} ${t.name}`;
};

/** Ficha de uma competição: tudo o que a equipe viveu naquele evento. */
export default async function CompetitionPage({ params }: PageProps<"/competitions/[key]">) {
  const { key } = await params;
  const c = getCompetition(key);
  if (!c) notFound();
  const { event, season, robot, photos, km } = c;

  const ms = competitionMatches(key);
  const rec = record(ms);
  const max = Math.max(1, ...ms.map((m) => m[5]));
  const prizes = (event.awards ?? []).map((t) => awards.find((a) => a.title === t)).filter((a) => a !== undefined);
  const best = ms.length ? ms.reduce((a, b) => (b[5] > a[5] ? b : a)) : undefined;

  // Topo: a foto larga do museu desse evento, senão o robô, senão a capa da temporada
  const wide = photos.find((p) => p.r >= 1.3);
  const teamCover = seasonTeamCover(season.slug);
  const cover = wide
    ? { src: wide.src, alt: wide.title, position: wide.position }
    : robot?.photo
      ? { src: robot.photo, alt: `Robô ${robot.name}`, position: robot.photoPosition }
      : teamCover && { src: teamCover.src, alt: teamCover.caption, position: teamCover.position };

  const i = competitions.findIndex((x) => x.key === key);
  const prev = competitions[i - 1];
  const next = competitions[i + 1];

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/seasons", label: "Temporadas" },
          { href: `/seasons/${season.slug}`, label: String(season.year) },
          { href: `/competitions/${key}`, label: event.shortName },
        ]}
        kicker={`${kindLabel[event.kind]} · ${season.game} ${season.year}`}
        title={event.name}
        lead={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {event.location}
            </span>
            <span>{event.dates}</span>
            {km && (
              <span className="inline-flex items-center gap-1.5">
                <Plane className="size-4" /> {km.toLocaleString("pt-BR")} km ida e volta
              </span>
            )}
          </span>
        }
        image={cover}
      />

      <Container className="py-14">
        {/* Placar geral */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
          {[
            { k: "Ranking", v: event.rank ? `${event.rank}º` : "—" },
            { k: "Campanha", v: event.record ?? (rec.total ? rec.label : "—"), note: "V-D-E" },
            { k: "Resultado", v: event.result, small: true },
            { k: "Maior placar", v: best ? String(best[5]) : "—", note: best ? `${best[1]} · ${best[5]} x ${best[6]}` : undefined },
          ].map((s) => (
            <div key={s.k} className="bg-bg p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">{s.k}</dt>
              <dd className={cn("heading mt-1", s.small ? "text-xl leading-tight" : "text-4xl")}>{s.v}</dd>
              {s.note && <dd className="mt-1 text-xs text-muted">{s.note}</dd>}
            </div>
          ))}
        </dl>
        {event.alliance && <p className="mt-3 text-sm text-muted">Nos playoffs: {event.alliance}.</p>}

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {ms.length > 0 ? (
              <>
                <h2 className="heading text-3xl">Partidas</h2>
                <p className="mt-2 text-muted">Todas as {ms.length} partidas, na ordem. Clique em uma barra ou em “Assistir” para ver o vídeo.</p>
                <div className="mt-6">
                  <MatchStrip title={event.shortName} matches={ms} max={max} names={namesFor(ms)} />
                  <MatchLegend />
                </div>
                <div className="mt-8 overflow-x-auto rounded-lg border border-line">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
                      <tr>
                        <th className="px-4 py-3 font-bold">Partida</th>
                        <th className="px-4 py-3 font-bold">Com a gente</th>
                        <th className="px-4 py-3 font-bold">Placar</th>
                        <th className="px-4 py-3 font-bold">
                          <span className="sr-only">Vídeo</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {ms.map((m) => {
                        const v = videoOf(m);
                        return (
                          <tr key={m[1]}>
                            <td className="px-4 py-3 font-mono font-bold">{m[1]}</td>
                            <td className="px-4 py-3 text-muted">{m[3].map(team).join(" · ")}</td>
                            <td className="px-4 py-3 tabular-nums">
                              <span className={cn("font-bold", m[7] === "W" ? "text-win" : "text-fg")}>{m[5]}</span> x {m[6]}{" "}
                              <span className="text-xs text-muted">{m[7] === "W" ? "vitória" : m[7] === "L" ? "derrota" : "empate"}</span>
                            </td>
                            <td className="px-4 py-3 text-right">{v && <WatchButton video={v} />}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-line p-6 text-muted">O The Blue Alliance não tem as partidas deste evento.</p>
            )}

            {photos.length > 0 && (
              <>
                <h2 className="heading mt-14 text-3xl">Fotos</h2>
                <p className="mt-2 text-muted">
                  Do acervo do{" "}
                  <Link href={`/museum#${museumRoom(season.slug)}`} className="text-link">
                    Museu da Raposa
                  </Link>
                  .
                </p>
                <ul className="mt-6 columns-2 gap-3 sm:columns-3 [&>li]:mb-3">
                  {photos.map((p) => (
                    <li key={p.src} className="break-inside-avoid">
                      <figure>
                        <div
                          {...zoom(p.src, p.note ? `${p.title}. ${p.note}` : p.title)}
                          className="zoomable relative overflow-hidden rounded-md bg-surface-2"
                          style={{ aspectRatio: p.r }}
                        >
                          <Image
                            src={p.src}
                            alt={p.title}
                            fill
                            sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 45vw"
                            className="object-cover"
                            style={{ objectPosition: p.position }}
                          />
                        </div>
                        <figcaption className="mt-1 text-xs text-muted">{p.title}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-6">
            {robot && (
              <Link href={`/robots/${robot.slug}`} className="card group block overflow-hidden rounded-lg border border-line">
                {robot.photo && (
                  <div className="card-media relative aspect-[4/3] overflow-hidden bg-surface-2">
                    <Image
                      src={robot.photo}
                      alt={`Robô ${robot.name}`}
                      fill
                      sizes="300px"
                      className="object-cover"
                      style={{ objectPosition: robot.photoPosition }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="kicker">Em quadra</p>
                  <p className="heading mt-1 text-2xl group-hover:text-accent">
                    {robot.name} <span aria-hidden className="card-arrow">→</span>
                  </p>
                  <p className="text-sm text-muted">
                    {robot.order} · {robot.drivetrain}
                  </p>
                </div>
              </Link>
            )}

            {(prizes.length > 0 || (event.awards?.length ?? 0) > 0) && (
              <div className="rounded-lg border border-line p-4">
                <p className="kicker">Prêmios</p>
                {prizes.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-end justify-center gap-4 border-b-8 border-brand pb-1">
                    {prizes.map((a) => (
                      <Link key={a.id} href={`/awards#${a.id}`} title={a.title} className="transition-transform hover:-translate-y-1">
                        <Trophy art={a.art} className="h-28 w-auto drop-shadow-lg" />
                      </Link>
                    ))}
                  </div>
                )}
                <ul className="mt-3 space-y-1 text-sm font-bold">
                  {event.awards!.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link href={`/seasons/${season.slug}`} className="card group block rounded-lg border border-line p-4">
              <p className="kicker">Temporada {season.year}</p>
              <p className="heading mt-1 text-2xl group-hover:text-accent">
                {season.game} <span aria-hidden className="card-arrow">→</span>
              </p>
              <p className="text-sm text-muted">{season.headline}</p>
            </Link>
          </aside>
        </div>

        {/* Navegação entre competições, em ordem cronológica */}
        <nav aria-label="Outras competições" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/competitions/${prev.key}`} className="card group rounded-lg border border-line p-4">
              <span className="flex items-center gap-1 text-xs text-muted">
                <ArrowLeft className="size-3" /> Anterior
              </span>
              <span className="font-bold group-hover:text-accent">
                {prev.event.shortName} {prev.season.year}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/competitions/${next.key}`} className="card group rounded-lg border border-line p-4 text-right">
              <span className="flex items-center justify-end gap-1 text-xs text-muted">
                Próxima <ArrowRight className="size-3" />
              </span>
              <span className="font-bold group-hover:text-accent">
                {next.event.shortName} {next.season.year}
              </span>
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}

/** Sala do museu de cada temporada. */
function museumRoom(seasonSlug: string) {
  return seasonSlug.replace(/^\d{4}-/, "");
}
