import Image from "next/image";
import Link from "next/link";
import { Term } from "@/components/ui/Term";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Photo } from "@/components/ui/Photo";
import { TrophyShelf } from "@/components/graphics/TrophyShelf";
import { awards } from "@/content/awards";
import { SeasonExplorer, type ExplorerSeason } from "@/components/home/SeasonExplorer";
import { RobotCard } from "@/components/robots/RobotCard";
import { seasons } from "@/content/seasons";
import { getRobot, robots } from "@/content/robots";
import { seasonLogos, seasonPhotos } from "@/content/credits";
import { heroTeamPhotos, teamPhotos } from "@/content/gallery";
import { HeroTeam } from "@/components/home/HeroTeam";
import { projects } from "@/content/impact";
import { SponsorWall } from "@/components/ui/SponsorWall";
import { OnThisDay, type Memory } from "@/components/home/OnThisDay";
import { competitions } from "@/lib/events";
import { site, stats } from "@/content/site";
import { zoom } from "@/lib/zoom";


const mosaic = [
  teamPhotos["2023-charged-up"][3],
  teamPhotos["2024-crescendo"][1],
  teamPhotos["2025-reefscape"][1],
  teamPhotos["2024-crescendo"][0],
  teamPhotos["2023-charged-up"][4],
  teamPhotos["2025-reefscape"][2],
  teamPhotos["2026-rebuilt"][1],
  teamPhotos["2024-crescendo"][3],
];

/** Lembranças para o "Neste dia": cada competição com a data de início e uma foto (do museu, senão o robô). */
const memories: Memory[] = competitions.map((c) => {
  const p = c.photos.find((x) => x.r >= 1) ?? c.photos[0];
  return {
    key: c.key,
    title: `${c.event.shortName} ${c.season.year}`,
    where: c.event.location.split(",")[0],
    dates: c.event.dates,
    result: [c.event.result, ...(c.event.awards ?? []).filter((a) => !a.startsWith("Wildcard"))].join(" · "),
    y: c.start.getUTCFullYear(),
    m: c.start.getUTCMonth(),
    d: c.start.getUTCDate(),
    photo: p
      ? { src: p.src, title: p.title, position: p.position }
      : c.robot?.photo
        ? { src: c.robot.photo, title: c.robot.name, position: c.robot.photoPosition }
        : undefined,
  };
});

export default function Home() {
  const explorer: ExplorerSeason[] = seasons.map((s) => {
    const team = teamPhotos[s.slug] ?? [];
    const stock = s.photos[0] ? seasonPhotos[s.photos[0]] : undefined;
    return {
    ...s,
    cover: team[0] ?? (stock ? { src: stock.src, caption: stock.caption, credit: stock.author } : undefined),
    thumbs: team.slice(1),
    logo: seasonLogos[s.motif],
    robotNames: s.robots.map((r) => getRobot(r)?.name).filter((n): n is string => Boolean(n)),
    };
  });
  const lastCompleted = seasons.findLastIndex((s) => s.status === "completed");

  return (
    <>
      {/* Topo: a equipe inteira, uma foto por temporada */}
      <HeroTeam photos={heroTeamPhotos}>
        <Container className="flex min-h-[72svh] flex-col justify-end pb-24 pt-24 sm:min-h-[85vh] sm:pb-32">
          <p className="kicker !text-[#f0a6e8] [text-shadow:0_1px_8px_rgb(0_0_0/0.7)]">FRC 9219 · Resende, RJ · desde 2022</p>
          <h1 className="heading mt-2 text-[2.6rem] [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] sm:text-6xl">
            Nine Tails <span className="text-[#f0a6e8]">#9219</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            <Button href="/team">Conheça a equipe</Button>
            <Button href="/seasons" variant="outline" className="text-white">
              <span className="sm:hidden">Temporadas</span>
              <span className="hidden sm:inline">Nossas temporadas</span>
            </Button>
          </div>
        </Container>
      </HeroTeam>

      {/* Quem somos */}
      <section>
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="kicker">Quem somos</p>
            <h2 className="heading mt-3 text-4xl sm:text-5xl">Da escola técnica para o Mundial</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                A Nine Tails nasceu em novembro de 2022, na parceria entre SESI e SENAI em Resende. Com três meses de equipe,
                fomos para a primeira <Term id="regional">regional</Term> e voltamos com o{" "}
                <strong className="text-fg"><Term id="rookie-all-star">Rookie All Star</Term></strong> e uma
                vaga para o Mundial de Houston, onde ganhamos o{" "}
                <strong className="text-fg"><Term id="rookie-inspiration">Rookie Inspiration Award</Term></strong>.
              </p>
              <p>
                Hoje somos estudantes de mecânica, elétrica, programação e marketing, junto com mentores e alumni que continuam
                por perto.
              </p>
            </div>
            <Link href="/team" className="text-link mt-6 inline-block">
              Nossa história →
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src="/team/2023-houston-abraco.webp"
              alt="Integrantes da Nine Tails se abraçando no Mundial de Houston"
              caption="Mundial de Houston, 2023."
              aspect="aspect-[3/2]"
            />
          </Reveal>
        </Container>
      </section>

      {/* Neste dia: só aparece quando uma competição faz aniversário nestes dias */}
      <section>
        <Container>
          <OnThisDay memories={memories} />
        </Container>
      </section>

      {/* Temporadas */}
      <section className="border-y border-line bg-surface">
        <Container className="py-20">
          <SectionHeading
            kicker="Temporadas"
            title="Cada ano, um jogo novo"
            lead="Todo janeiro a FIRST revela um jogo diferente, e cada equipe tem poucas semanas para construir um robô do zero. Escolha uma temporada:"
          />
          <div className="mt-10">
            <SeasonExplorer seasons={explorer} initial={0} />
          </div>
          <p className="mt-10 text-sm text-muted">
            Última temporada disputada: {seasons[lastCompleted].game} ({seasons[lastCompleted].year}).{" "}
            <Link href="/seasons" className="text-link">
              Ver todas
            </Link>
          </p>
        </Container>
      </section>

      {/* Mosaico */}
      <section>
        <Container className="pt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading kicker="Bastidores" title="Por dentro da equipe" />
            <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="text-link shrink-0">
              Mais no Instagram →
            </a>
          </div>
          <div className="mt-10 grid grid-flow-dense auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
            {mosaic.map((m, i) => (
              <figure
                key={m.src}
                {...zoom(m.src, m.caption)}
                className={
                  "zoomable group relative overflow-hidden rounded-lg bg-surface-2 " +
                  (i === 0 ? "col-span-2 row-span-2" : i === 3 ? "row-span-2" : "")
                }
              >
                <Image
                  quality={90}
                  src={m.src}
                  alt={m.caption}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: m.position }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Prêmios */}
      <section>
        <Container className="py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading kicker="Conquistas" title="Prêmios da equipe" />
            <Link href="/awards" className="text-link shrink-0">
              Ver todas →
            </Link>
          </div>
          <Reveal className="mt-12">
            <TrophyShelf awards={awards} />
          </Reveal>
        </Container>
      </section>

      {/* Impacto */}
      <section className="bg-brand text-brand-ink">
        <Container className="py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <Reveal>
              <p className="kicker !text-white/80">Impacto</p>
              <h2 className="heading mt-3 text-4xl sm:text-5xl">Robótica para quem nunca viu um robô</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                Levamos STEAM para a rede pública de Resende, formamos professores, ajudamos a fundar times e compartilhamos
                nossos projetos com equipes do mundo inteiro.
              </p>
            </Reveal>
            <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-8">
              {stats.map((s) => (
                <RevealItem key={s.label} className="border-t border-white/30 pt-4">
                  <p className="heading text-4xl sm:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} decimals={"decimals" in s ? s.decimals : 0} />
                  </p>
                  <p className="mt-1 text-sm text-white/80">{s.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link key={p.name} href="/impact" className="group rounded-lg bg-black/15 p-6 transition-colors hover:bg-black/25">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">{p.tag}</p>
                <p className="heading mt-2 text-2xl">{p.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{p.description}</p>
              </Link>
            ))}
          </div>
          <Link href="/impact" className="mt-8 inline-block font-bold underline decoration-white/50 underline-offset-4 hover:decoration-white">
            Todos os projetos →
          </Link>
        </Container>
      </section>

      {/* Robôs */}
      <section>
        <Container className="py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading kicker="Robôs" title="Feitos na nossa oficina" lead="Do tank drive ao swerve: cada robô leva o que aprendemos com o anterior." />
            <Link href="/robots" className="text-link shrink-0">
              Todos os robôs →
            </Link>
          </div>
          <RevealGroup className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...robots]
              .reverse()
              .slice(0, 3)
              .map((r) => (
                <RevealItem key={r.slug}>
                  <RobotCard robot={r} />
                </RevealItem>
              ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Patrocinadores */}
      <section className="border-t border-line bg-surface">
        <Container className="py-16">
          <SectionHeading
            kicker="Patrocinadores"
            title="Quem acredita na gente"
            lead="Empresas e instituições que tornam cada temporada possível."
          />
          <SponsorWall className="mt-8" />
          <div className="mt-8">
            <Button href="/sponsor">Seja um patrocinador</Button>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: site.fullName,
            sport: "Robotics — FIRST Robotics Competition",
            url: site.url,
            email: site.email,
            foundingDate: site.founded,
            location: {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "RJ", addressCountry: "BR" },
            },
            sameAs: Object.values(site.socials),
          }),
        }}
      />
    </>
  );
}
