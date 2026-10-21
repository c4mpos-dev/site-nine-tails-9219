import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { completedSeasons, seasons } from "@/content/seasons";
import { getRobot } from "@/content/robots";
import { seasonLogos, seasonPhotos } from "@/content/credits";
import { SeasonLogo } from "@/components/seasons/SeasonLogo";
import { teamPhotos } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Temporadas",
  description:
    "Charged Up, Crescendo, Reefscape, REBUILT e BIOCORE: a trajetória da Nine Tails #9219 na FIRST Robotics Competition, temporada a temporada.",
};

export default function SeasonsPage() {
  const events = completedSeasons.flatMap((s) => s.events);
  return (
    <>
      <PageHero
        kicker="Temporadas"
        title="Nossa trajetória na FRC"
        lead={`${completedSeasons.length} temporadas e ${events.length} eventos desde 2023. Cada ano tem um jogo novo e um robô construído do zero.`}
        image={{ src: "/seasons/2024-crescendo-wide.webp", alt: "Partida da temporada Crescendo", credit: "Dmhll, CC BY 4.0" }}
      />
      <Container className="py-14">
        <RevealGroup className="divide-y divide-line">
          {[...seasons].reverse().map((s) => {
            const team = teamPhotos[s.slug]?.[0];
            const stock = s.photos[0] ? seasonPhotos[s.photos[0]] : undefined;
            const cover = team ?? (stock ? { src: stock.src, caption: stock.caption, position: undefined } : undefined);
            const awards = s.events.flatMap((e) => e.awards ?? []).filter((a) => !a.startsWith("Wildcard"));
            const robotNames = s.robots.map((r) => getRobot(r)?.name).filter(Boolean);
            const logo = seasonLogos[s.motif];
            return (
              <RevealItem key={s.slug}>
                <Link href={`/temporadas/${s.slug}`} className="group grid gap-6 py-8 sm:grid-cols-[300px_1fr] sm:items-center lg:grid-cols-[300px_1fr_auto]">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-surface-2">
                    {cover ? (
                      <Image src={cover.src} alt={cover.caption} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: cover.position }} />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-sm text-muted">Kickoff em 09/01/2027</div>
                    )}
                  </div>
                  <div>
                    <p className="kicker">
                      {s.year} · {s.status === "upcoming" ? "Em preparação" : `${s.events.length} eventos`}
                    </p>
                    <h2 className="heading mt-2 text-3xl transition-colors group-hover:text-accent sm:text-4xl">{s.game}</h2>
                    <p className="mt-2 max-w-2xl text-muted">{s.headline}</p>
                    <p className="mt-3 text-sm">
                      {robotNames.length > 0 && <span className="text-muted">Robôs: {robotNames.join(", ")}</span>}
                      {awards.length > 0 && <span className="ml-3 font-bold text-accent">{awards.join(" · ")}</span>}
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    {logo && <SeasonLogo src={logo} game={s.game} />}
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </>
  );
}
