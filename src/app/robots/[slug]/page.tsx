import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Term } from "@/components/ui/Term";
import { Container } from "@/components/ui/Container";
import { Loop } from "@/components/ui/Loop";
import { RobotBlueprint } from "@/components/robots/RobotBlueprint";
import { BeforeAfter } from "@/components/robots/BeforeAfter";
import { MatchLegend, MatchStrip } from "@/components/seasons/MatchStrip";
import { Trophy } from "@/components/graphics/Trophies";
import { getRobot, robots, type Robot } from "@/content/robots";
import { getSeason } from "@/content/seasons";
import { awards } from "@/content/awards";
import { matchEvents } from "@/content/allies";
import { byEvent, namesFor } from "@/lib/matchStats";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

const driveTerm = (d: string) => (/swerve/i.test(d) ? "swerve" : /omni/i.test(d) ? "omni" : "tank");

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/robos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) return {};
  return { title: `${robot.name} (${robot.year})`, description: robot.description };
}

/** Moldura de "visor" nos cantos da foto, como num desenho técnico. */
function Corners() {
  const c = "absolute size-5 border-[#f0a6e8]";
  return (
    <>
      <span aria-hidden className={`${c} -left-2 -top-2 border-l-2 border-t-2`} />
      <span aria-hidden className={`${c} -right-2 -top-2 border-r-2 border-t-2`} />
      <span aria-hidden className={`${c} -bottom-2 -left-2 border-b-2 border-l-2`} />
      <span aria-hidden className={`${c} -bottom-2 -right-2 border-b-2 border-r-2`} />
    </>
  );
}

function NavCard({ robot, dir }: { robot: Robot; dir: "prev" | "next" }) {
  return (
    <Link
      href={`/robos/${robot.slug}`}
      className={`group flex items-center gap-4 rounded-lg border border-line p-3 transition-colors hover:border-accent ${dir === "next" ? "flex-row-reverse text-right" : ""}`}
    >
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-surface-2">
        {robot.photo ? (
          <Image src={robot.photo} alt="" fill sizes="96px" className="object-cover" style={robot.photoPosition ? { objectPosition: robot.photoPosition } : undefined} />
        ) : (
          <RobotBlueprint drivetrain={robot.drivetrain} className="absolute inset-0 m-auto h-[75%] w-[75%] text-brand" />
        )}
      </div>
      <div>
        <span className="flex items-center gap-1 text-xs text-muted">
          {dir === "prev" ? (
            <>
              <ArrowLeft className="size-3.5" /> Anterior
            </>
          ) : (
            <>
              Próximo <ArrowRight className="size-3.5" />
            </>
          )}
        </span>
        <span className="heading block text-2xl group-hover:text-accent">{robot.name}</span>
        <span className="text-xs text-muted">
          {robot.year} · {robot.drivetrain}
        </span>
      </div>
    </Link>
  );
}

export default async function RobotPage({ params }: PageProps<"/robos/[slug]">) {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) notFound();
  const season = getSeason(robot.seasonSlug);
  const idx = robots.indexOf(robot);
  const prev = robots[idx - 1];
  const next = robots[idx + 1];
  const number = robot.order.replace(/\D/g, "");

  const robotAwards = awards.filter((a) => robot.awards?.includes(a.id));
  const events = (robot.matchEvents ?? [])
    .map((key) => ({ key, ...matchEvents[key], matches: byEvent(key) }))
    .filter((e) => e.matches.length > 0);
  const all = events.flatMap((e) => e.matches);
  const best = all.reduce((m, x) => Math.max(m, x[5]), 0);
  const max = Math.max(1, best);

  return (
    <>
      {/* Topo: ficha do robô */}
      <section className="relative isolate overflow-hidden bg-[#160b20] text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative">
            <span aria-hidden className="heading pointer-events-none absolute -left-2 -top-16 -z-10 text-[11rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(240_166_232/0.25)] sm:text-[14rem]">
              #{number}
            </span>
            <nav aria-label="Trilha" className="mb-6 flex flex-wrap gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Início
              </Link>
              <span aria-hidden>/</span>
              <Link href="/robos" className="hover:text-white">
                Robôs
              </Link>
            </nav>
            <p className="kicker !text-[#f0a6e8]">
              {robot.order} · {season?.game} {robot.year}
            </p>
            <h1 className="heading mt-3 text-6xl sm:text-8xl">{robot.name}</h1>
            <p className="mt-4 max-w-md text-xl leading-relaxed text-white/80">{robot.tagline}</p>
            {robotAwards.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {robotAwards.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/conquistas#${a.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-bold hover:border-[#f0a6e8]"
                    >
                      <span className="size-1.5 rotate-45 bg-[#f0a6e8]" /> {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <Corners />
            <div
              className={cn("relative aspect-[4/3] overflow-hidden rounded-md bg-white/5", robot.photo && "zoomable")}
              {...(robot.photo ? zoom(robot.photo, `Robô ${robot.name}`) : {})}
            >
              {robot.photo ? (
                <Image
                  quality={90}
                  src={robot.photo}
                  alt={`Robô ${robot.name}`}
                  fill
                  sizes="(min-width:1024px) 55vw, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                  style={robot.photoPosition ? { objectPosition: robot.photoPosition } : undefined}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <RobotBlueprint drivetrain={robot.drivetrain} className="h-[70%] w-[70%] text-[#f0a6e8]" />
                  <p className="absolute bottom-3 text-xs text-white/50">Planta ilustrativa da base. A foto entra em breve.</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Ficha técnica */}
      <section className="border-b border-line bg-surface">
        <Container>
          <dl className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-6 divide-line lg:gap-x-0 lg:grid-cols-4 lg:divide-x">
            <div className="py-6 lg:pr-6">
              <dt className="kicker">Temporada</dt>
              <dd className="heading mt-2 break-words text-xl sm:text-2xl">
                {season ? (
                  <Link href={`/temporadas/${season.slug}`} className="hover:text-accent">
                    {season.game} {robot.year}
                  </Link>
                ) : (
                  robot.year
                )}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 py-6 lg:px-6">
              <div>
                <dt className="kicker">Tração</dt>
                <dd className="heading mt-2 break-words text-xl sm:text-2xl">
                  <Term id={driveTerm(robot.drivetrain)}>{robot.drivetrain}</Term>
                </dd>
              </div>
              <RobotBlueprint drivetrain={robot.drivetrain} className="hidden h-12 w-14 shrink-0 text-brand sm:block" />
            </div>
            <div className="py-6 lg:px-6">
              <dt className="kicker">Partidas oficiais</dt>
              <dd className="heading mt-2 break-words text-xl sm:text-2xl">{all.length || "—"}</dd>
            </div>
            <div className="py-6 lg:pl-6">
              <dt className="kicker">Maior placar</dt>
              <dd className="heading mt-2 break-words text-xl sm:text-2xl">{best ? `${best} pontos` : "—"}</dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* A história */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <p className="kicker">A história</p>
          <p className="mt-4 text-lg leading-relaxed text-muted">{robot.description}</p>
          <h2 className="heading mt-10 text-3xl">Destaques</h2>
          <ol className="mt-5 space-y-4">
            {robot.features.map((f, i) => (
              <li key={f} className="flex gap-4">
                <span className="heading text-2xl leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="pt-0.5 text-lg">{f}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="space-y-8">
          <div>
            <p className="kicker">Competiu em</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {robot.events.map((e) => (
                <li key={e} className="py-3 font-bold">
                  {e}
                </li>
              ))}
            </ul>
          </div>
          {robotAwards.length > 0 && (
            <div>
              <p className="kicker">Na estante</p>
              <ul className="mt-4 grid grid-cols-2 gap-4">
                {robotAwards.map((a) => (
                  <li key={a.id}>
                    <Link href={`/conquistas#${a.id}`} className="group block rounded-lg border border-line p-4 text-center hover:border-accent">
                      <Trophy art={a.art} className="mx-auto h-28 w-auto transition-transform group-hover:-translate-y-1" />
                      <span className="mt-3 block text-sm font-bold group-hover:text-accent">{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      {/* Em movimento */}
      {robot.clip && (
        <section className="relative isolate overflow-hidden bg-[#160b20] text-white">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"
          />
          <Container
            className={`grid items-center gap-10 py-16 ${robot.clip.aspect ? "lg:grid-cols-[minmax(0,380px)_1fr]" : "lg:grid-cols-[minmax(0,1.6fr)_1fr]"}`}
          >
            <div className="relative">
              <Corners />
              <Loop
                src={robot.clip.src}
                label={`${robot.name} em movimento. ${robot.clip.caption}`}
                aspect={robot.clip.aspect}
                className="rounded-md !bg-white/5"
              />
            </div>
            <div>
              <p className="kicker !text-[#f0a6e8]">Em movimento</p>
              <h2 className="heading mt-3 text-4xl sm:text-5xl">O {robot.name} em ação</h2>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-white/75">{robot.clip.caption}</p>
              <p className="mt-6 text-sm text-white/50">Trecho do acervo da equipe, sem som, em loop.</p>
            </div>
          </Container>
        </section>
      )}

      {/* Da oficina à arena */}
      {robot.beforeAfter && (
        <section className="border-y border-line bg-surface">
          <Container className="py-16">
            <p className="kicker">Da oficina à arena</p>
            <h2 className="heading mt-3 text-4xl">Arraste para ver o antes e o depois</h2>
            <div className="mt-8 max-w-4xl">
              <BeforeAfter {...robot.beforeAfter} />
            </div>
          </Container>
        </section>
      )}

      {/* Partida a partida */}
      {events.length > 0 && (
        <Container className="py-16">
          <p className="kicker">Partida a partida</p>
          <h2 className="heading mt-3 text-4xl">
            {all.length} partidas com o {robot.name}
          </h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {events.map((e) => (
              <div key={e.key}>
                <MatchStrip title={e.short} matches={e.matches} max={max} names={namesFor(e.matches)} />
                <Link href={`/competicoes/${e.key}`} className="mt-5 inline-block text-sm font-bold text-accent hover:underline">
                  Ficha da competição →
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <MatchLegend />
          </div>
        </Container>
      )}

      {/* Navegação entre robôs */}
      <Container className="grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
        {prev ? <NavCard robot={prev} dir="prev" /> : <span />}
        {next && <NavCard robot={next} dir="next" />}
      </Container>
    </>
  );
}
