import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { RobotCard } from "@/components/robots/RobotCard";
import { RobotBlueprint } from "@/components/robots/RobotBlueprint";
import { robots } from "@/content/robots";
import { TankTails3D } from "@/components/robots/TankTails3D";

export const metadata: Metadata = {
  title: "Robôs",
  description: "Tank Tails, The Answer, Garuttinho, Predator e Arak: todos os robôs da Nine Tails #9219, do tank drive ao swerve.",
};

export default function RobotsPage() {
  return (
    <>
      <PageHero
        kicker="Robôs"
        title="Feitos na nossa oficina"
        lead="Cada robô leva meses de projeto, fabricação, programação e testes, e nasce do que o anterior ensinou."
        image={{ src: "/team/2025-arak.webp", alt: "Arak, robô da Nine Tails na temporada Reefscape", position: "50% 60%" }}
      />

      {/* O primeiro: Tank Tails em 3D */}
      <Container className="grid items-center gap-8 py-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="kicker">O primeiro · 2023</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl">Tank Tails</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Onde tudo começou: tração de tanque, torre de alumínio e um braço telescópico que pegava cones e cubos do chão
            e levava até o nó mais alto. Foi com ele que a raposa chegou a Houston no ano de estreia.
          </p>
          <Link href="/robos/tank-tails" className="text-link mt-5 inline-block font-bold">
            Conhecer o Tank Tails
          </Link>
        </div>
        <TankTails3D className="aspect-[4/3] w-full" />
      </Container>

      {/* Linhagem: a evolução da tração, robô a robô */}
      <section className="border-b border-line bg-surface">
        <Container className="py-14">
          <SectionHeading kicker="Linhagem" title="Do tank drive ao swerve" />
          <div className="mt-10 overflow-x-auto [scrollbar-width:thin]">
            <ol className="relative flex min-w-[720px] justify-between gap-4">
              <span aria-hidden className="absolute left-0 right-0 top-[56px] h-px bg-line" />
              {robots.map((r) => (
                <li key={r.slug} className="relative w-full text-center">
                  <Link href={`/robos/${r.slug}`} className="group block">
                    <div className="mx-auto grid size-28 place-items-center rounded-full border border-line bg-bg transition-colors group-hover:border-accent">
                      <RobotBlueprint drivetrain={r.drivetrain} className="h-16 w-20 text-brand" />
                    </div>
                    <p className="heading mt-3 text-lg group-hover:text-accent">{r.name}</p>
                    <p className="text-xs text-muted">
                      {r.year} · {r.drivetrain}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <RevealGroup className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {[...robots].reverse().map((r) => (
            <RevealItem key={r.slug}>
              <RobotCard robot={r} />
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.tagline}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </>
  );
}
