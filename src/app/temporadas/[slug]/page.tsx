import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Term } from "@/components/ui/Term";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Photo } from "@/components/ui/Photo";
import { EventTable } from "@/components/seasons/EventTable";
import { MatchLegend, MatchStrip } from "@/components/seasons/MatchStrip";
import { bySeason, namesFor } from "@/lib/matchStats";
import { Countdown } from "@/components/seasons/Countdown";
import { RobotCard } from "@/components/robots/RobotCard";
import { getSeason, seasons } from "@/content/seasons";
import { robotsBySeason } from "@/content/robots";
import { seasonLogos, seasonPhotos } from "@/content/credits";
import { site } from "@/content/site";
import { teamPhotos } from "@/content/gallery";


export function generateStaticParams() {
  return seasons.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/temporadas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const season = getSeason(slug);
  if (!season) return {};
  return { title: `${season.year}, ${season.game}`, description: season.summary };
}

/** Temporada contada como artigo: leitura corrida, com fotos e o placar no meio do texto. */
export default async function SeasonPage({ params }: PageProps<"/temporadas/[slug]">) {
  const { slug } = await params;
  const season = getSeason(slug);
  if (!season) notFound();

  const idx = seasons.indexOf(season);
  const prev = seasons[idx - 1];
  const next = seasons[idx + 1];
  const seasonRobots = robotsBySeason(season.slug);
  const photos = season.photos.map((k) => seasonPhotos[k]);
  const team = teamPhotos[season.slug] ?? [];
  const stockCover = photos.at(-1) ?? photos[0];
  const hero = team[0]
    ? { src: team[0].src, alt: team[0].caption, position: team[0].position }
    : stockCover
      ? { src: stockCover.src, alt: stockCover.caption, credit: `${stockCover.author}, ${stockCover.license}` }
      : undefined;
  const inline = photos[0];
  const logo = seasonLogos[season.motif];
  const upcoming = season.status === "upcoming";
  const seasonMatches = bySeason(season.slug);
  const seasonMax = Math.max(1, ...seasonMatches.flatMap((e) => e.matches.map((m) => m[5])));

  return (
    <article>
      <PageHero
        crumbs={[
          { href: "/temporadas", label: "Temporadas" },
          { href: `/temporadas/${season.slug}`, label: String(season.year) },
        ]}
        kicker={`Temporada ${season.year} · ${season.firstTheme}`}
        title={season.game}
        lead={season.headline}
        image={hero}
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose-nt max-w-[68ch]">
          <p className="text-xl !text-fg">{season.summary}</p>
          {season.slug === "2023-charged-up" && (
            <Link
              href="/pioneiros"
              className="not-prose group flex items-center justify-between gap-4 rounded-lg border border-accent/50 p-4 no-underline transition-colors hover:bg-surface"
            >
              <span>
                <span className="kicker block">Os pioneiros</span>
                <span className="font-bold text-fg">Leia o diário dos pioneiros, capítulo por capítulo</span>
              </span>
              <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}

          {upcoming && (
            <div className="not-prose !mt-8 rounded-lg border border-accent/50 p-5">
              <p className="kicker">Contagem para o kickoff · 09/01/2027</p>
              <Countdown className="mt-3 flex-wrap" />
            </div>
          )}

          <h2>O jogo</h2>
          <p>{season.gameDescription}</p>
          {season.gamePieces.length > 0 && (
            <p>
              Elementos de jogo: <strong>{season.gamePieces.join(", ")}</strong>.
            </p>
          )}

          {inline && (
            <Photo
              src={inline.src}
              alt={inline.caption}
              caption={inline.caption}
              credit={`${inline.author}, ${inline.license}`}
              aspect="aspect-[16/10]"
              className="!mt-8"
            />
          )}

          {season.events.length > 0 && (
            <>
              <h2>Como fomos</h2>
              <p>
                Resultados oficiais da equipe na temporada. As partidas completas estão no{" "}
                <a href={`${site.links.tba}/${season.year}`} target="_blank" rel="noreferrer" className="text-link">
                  The Blue Alliance
                </a>{" "}
                (<Term id="tba">o que é isso?</Term>)
                .
              </p>
              <div className="not-prose !mt-6">
                <EventTable events={season.events} />
              </div>
              {seasonMatches.length > 0 && (
                <>
                  <h2>Partida a partida</h2>
                  <p>
                    Todas as {seasonMatches.reduce((a, e) => a + e.matches.length, 0)} partidas da temporada, das{" "}
                    <Term id="qualificacoes">qualificações</Term> aos <Term id="playoffs">playoffs</Term>, na ordem em que
                    aconteceram. Cada partida tem uma <Term id="alianca">aliança</Term> diferente.
                  </p>
                  <div className="not-prose !mt-6 space-y-8 rounded-lg border border-line p-5">
                    {seasonMatches.map((e) => (
                      <MatchStrip key={e.key} title={e.short} matches={e.matches} max={seasonMax} names={namesFor(e.matches)} />
                    ))}
                    <MatchLegend />
                  </div>
                </>
              )}
            </>
          )}

          {!upcoming && (
            <>
              <h2>{seasonRobots.length > 1 ? "Os robôs" : "O robô"}</h2>
              {seasonRobots.length > 0 ? (
                <div className="!mt-6 grid gap-6 sm:grid-cols-2">
                  {seasonRobots.map((r) => (
                    <RobotCard key={r.slug} robot={r} />
                  ))}
                </div>
              ) : (
                <p>O robô desta temporada ainda vai ganhar sua página.</p>
              )}
            </>
          )}

          <h2>Fotos da equipe</h2>
          {team.length > 0 ? (
            <div className="not-prose !mt-6 grid grid-flow-dense auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px]">
              {team.map((t, i) => (
                <figure
                  key={t.src}
                  className={"group relative overflow-hidden rounded-lg bg-surface-2 " + (i === 0 ? "col-span-2 row-span-2" : "")}
                >
                  <Image
                    src={t.src}
                    alt={t.caption}
                    fill
                    sizes="(min-width:1024px) 40vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: t.position }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-xs text-white">
                    {t.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="!mt-6 grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Photo key={i} alt={`Equipe na temporada ${season.year}`} aspect="aspect-square" placeholder="Foto da equipe em breve" />
              ))}
            </div>
          )}
        </div>

        {/* Lateral: ficha da temporada */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-line p-5">
            {logo && (
              <div className="mb-5 rounded-md bg-white p-3">
                <Image src={logo} alt={`Logo ${season.game}`} width={220} height={110} className="mx-auto h-16 w-auto" />
              </div>
            )}
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted">Temporada</dt>
                <dd className="font-bold">
                  {season.year} · {season.firstTheme}
                </dd>
              </div>
              {season.events.length > 0 && (
                <div>
                  <dt className="text-muted">Eventos</dt>
                  <dd className="font-bold">{season.events.map((e) => e.shortName).join(", ")}</dd>
                </div>
              )}
            </dl>
            {season.highlights.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                {season.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </Container>

      <Container className="flex flex-wrap justify-between gap-4 border-t border-line pt-8">
        {prev ? (
          <Link href={`/temporadas/${prev.slug}`} className="group">
            <span className="text-xs text-muted">← Anterior</span>
            <span className="heading block text-2xl group-hover:text-accent">
              {prev.year} · {prev.game}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/temporadas/${next.slug}`} className="group text-right">
            <span className="text-xs text-muted">Próxima →</span>
            <span className="heading block text-2xl group-hover:text-accent">
              {next.year} · {next.game}
            </span>
          </Link>
        )}
      </Container>
    </article>
  );
}
