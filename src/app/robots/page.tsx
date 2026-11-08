import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RobotSheet } from "@/components/robots/RobotSheet";
import { RobotGallery } from "@/components/robots/RobotGallery";
import { RobotTable } from "@/components/robots/RobotTable";
import { HangarViews } from "@/components/robots/HangarViews";
import { RobotShowcase } from "@/components/robots/RobotShowcase";
import { robots } from "@/content/robots";
import { getSeason } from "@/content/seasons";
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

      {/* O hangar em movimento: rolando, cada robô atravessa a quadra, do primeiro ao mais novo */}
      <RobotShowcase robots={robots.map((r) => ({ ...r, game: getSeason(r.seasonSlug)?.game }))} />

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

    </>
  );
}
