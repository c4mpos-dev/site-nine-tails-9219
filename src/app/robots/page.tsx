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
import { TankTails3D } from "@/components/robots/TankTails3D";

export const metadata: Metadata = {
  title: "Robôs",
  description: "Tank Tails, The Answer, Garuttinho, Predator, Arak e Pharaoh: todos os robôs da Nine Tails #9219, do tank drive ao swerve.",
};

export default function RobotsPage() {
  const newestFirst = [...robots].reverse();
  return (
    <>
      {/* Topo: o Tank Tails, o primeiro robô, repetindo uma jogada da Charged Up */}
      <section className="relative isolate overflow-hidden bg-band text-white">
        {/* Linhas da quadra ao fundo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_60%,#000_30%,transparent_75%)]"
        />
        <Container className="grid items-center gap-4 py-12 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          <div>
            <p className="kicker !text-[#f0a6e8]">Robôs</p>
            <h1 className="heading mt-3 text-5xl sm:text-7xl">Feitos na nossa oficina</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Cada robô leva meses de projeto, fabricação, programação e testes, e nasce do que o anterior ensinou.
            </p>
          </div>
          <figure>
            <TankTails3D className="aspect-[4/3] w-full" />
            <figcaption className="-mt-2 text-center text-sm text-white/60">
              <Link href="/robots/tank-tails" className="font-bold text-white hover:text-[#f0a6e8]">
                Tank Tails
              </Link>
              , o primeiro, pontuando um cone como na Charged Up de 2023.
            </figcaption>
          </figure>
        </Container>
      </section>

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
