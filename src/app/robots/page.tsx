import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RobotSheet } from "@/components/robots/RobotSheet";
import { RobotGallery } from "@/components/robots/RobotGallery";
import { RobotTable } from "@/components/robots/RobotTable";
import { HangarViews } from "@/components/robots/HangarViews";
import { RobotBlueprint } from "@/components/robots/RobotBlueprint";
import { robots } from "@/content/robots";
import { MosaicRobot, type MosaicSource } from "@/components/robots/MosaicRobot";
import { teamPhotos, heroTeamPhotos } from "@/content/gallery";
import { matches } from "@/content/matches";
import { record } from "@/lib/matchStats";

export const metadata: Metadata = {
  title: "Robôs",
  description: "Tank Tails, The Answer, Garuttinho, Predator, Arak e Pharaoh: todos os robôs da Nine Tails #9219, do tank drive ao swerve.",
};

// Peças do mosaico: os robôs (que também viram o bumper, nas cores das alianças), as fotos de cada temporada e a equipe
const mosaicPhotos: MosaicSource[] = [
  ...robots.filter((r) => r.photo).map((r) => ({ src: r.photo!, caption: `${r.name}, ${r.year}.`, robot: true })),
  ...Object.values(teamPhotos).flat().map((p) => ({ src: p.src, caption: p.caption })),
  ...heroTeamPhotos.map((p) => ({ src: p.src, caption: p.caption })),
];

export default function RobotsPage() {
  const newestFirst = [...robots].reverse();
  return (
    <>
      {/* Topo: o Tank Tails, o primeiro robô, montado com fotos da equipe e dos robôs */}
      <MosaicRobot
        photos={mosaicPhotos}
        kicker="Robôs"
        title="Feitos na nossa oficina"
        lead="Cada robô nasce do que o anterior ensinou. Este aqui é o Tank Tails, montado com fotos. De vez em quando ele mostra uma de perto; clique numa peça para abrir a sua."
        featured={{ href: "/robots/tank-tails", label: "O primeiro", name: "Tank Tails", note: "2023 · Charged Up · tank drive" }}
        stats={[
          { value: robots.length, label: "robôs construídos" },
          { value: matches.length, label: "partidas oficiais" },
          { value: record(matches).w, label: "vitórias" },
          { value: Math.max(...matches.map((m) => m[5])), label: "maior placar" },
        ]}
      />

      {/* O hangar, do mais novo ao primeiro: fichas, galeria ou tabela */}
      <Container className="py-16">
        <HangarViews
          title={<SectionHeading kicker="O hangar" title={`${robots.length} robôs da raposa`} />}
          views={{
            sheets: (
              <div className="mt-16 space-y-24 lg:space-y-32">
                {newestFirst.map((r, i) => (
                  <Reveal key={r.slug}>
                    <RobotSheet robot={r} flip={i % 2 === 1} />
                  </Reveal>
                ))}
              </div>
            ),
            grid: (
              <div className="mt-10">
                <RobotGallery robots={newestFirst} />
              </div>
            ),
            table: (
              <div className="mt-10">
                <RobotTable robots={newestFirst} />
              </div>
            ),
          }}
        />
      </Container>

      {/* Linhagem: do primeiro robô ao mais novo */}
      <section className="border-t border-line bg-surface">
        <Container className="py-14">
          <SectionHeading kicker="Linhagem" title={`Do ${robots[0].name} ao ${robots[robots.length - 1].name}`} />
          <div className="mt-10 overflow-x-auto [scrollbar-width:thin]">
            <ol className="relative flex min-w-[720px] justify-between gap-4">
              <span aria-hidden className="absolute left-[10%] right-[10%] top-[60px] h-0.5 bg-gradient-to-r from-line via-brand to-accent" />
              {robots.map((r) => (
                <li key={r.slug} className="relative w-full text-center">
                  <Link href={`/robots/${r.slug}`} className="group block">
                    <div className="relative mx-auto size-[120px] overflow-hidden rounded-full border-4 border-surface bg-surface-2 shadow-md ring-2 ring-line transition-[box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:ring-accent">
                      {r.thumb || r.photo ? (
                        <Image
                          src={r.thumb?.src ?? r.photo!}
                          alt={`Robô ${r.name}`}
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ objectPosition: r.thumb?.position ?? r.photoPosition ?? "center" }}
                        />
                      ) : (
                        <RobotBlueprint drivetrain={r.drivetrain} className="absolute inset-0 m-auto h-16 w-20 text-brand" />
                      )}
                    </div>
                    <p className="heading mt-4 text-xl group-hover:text-accent">{r.name}</p>
                    <p className="text-xs text-muted">{r.year}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
