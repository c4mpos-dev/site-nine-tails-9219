import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Photo } from "@/components/ui/Photo";
import { Loop } from "@/components/ui/Loop";
import { Reveal } from "@/components/ui/Reveal";
import { Trophy } from "@/components/graphics/Trophies";
import { TrophyTurn } from "@/components/graphics/TrophyTurn";
import { TrophyShelf } from "@/components/graphics/TrophyShelf";
import { awards } from "@/content/awards";

export const metadata: Metadata = {
  title: "Conquistas",
  description: "Rookie All Star, Rookie Inspiration no Mundial de Houston, Engineering Award, Prêmio de Impacto e mais: os prêmios da Nine Tails #9219.",
};

const inWords = ["zero", "uma", "duas", "três", "quatro", "cinco"];

export default function AwardsPage() {
  const seasonCount = new Set(awards.map((a) => a.year)).size;
  return (
    <>
      <PageHero
        kicker="Conquistas"
        title="Prêmios e reconhecimentos"
        lead="Na FIRST, os prêmios mais importantes reconhecem engenharia, impacto e inspiração, não só pontuação."
        image={{ src: "/team/2023-houston-abraco.webp", alt: "Integrantes da Nine Tails comemorando em Houston" }}
      />

      {/* A estante */}
      <section className="border-b border-line bg-surface">
        <Container className="pb-12 pt-14">
          <p className="kicker">A estante</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl">
            {awards.length} troféus em {inWords[seasonCount] ?? seasonCount} temporadas
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Cada um desenhado no formato do troféu de verdade: o cristal e a placa da FRC, os troféus do Festival SESI de Robótica. Clique em um para ver a
            história.
          </p>
          <TrophyShelf awards={awards} className="mt-12" />
        </Container>
      </section>

      {/* Um por um */}
      <Container className="py-6">
        {awards.map((a, i) => (
          <section
            key={a.id}
            id={a.id}
            className="grid scroll-mt-24 gap-8 border-b border-line py-14 last:border-0 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr_300px] lg:items-center"
          >
            <Reveal>
              <div className="grid aspect-square place-items-center rounded-lg border border-line bg-[radial-gradient(circle_at_50%_60%,color-mix(in_oklab,var(--brand)_22%,transparent),transparent_70%)] p-6">
                <TrophyTurn className="size-full" innerClassName="grid size-full place-items-center">
                  <Trophy art={a.art} className="max-h-full w-auto drop-shadow-xl" />
                </TrophyTurn>
              </div>
            </Reveal>
            <div className="max-w-2xl">
              <p className="kicker">
                {String(i + 1).padStart(2, "0")} · {a.date}
              </p>
              <h2 className="heading mt-2 text-3xl sm:text-4xl">{a.title}</h2>
              <p className="mt-1 font-bold text-muted">{a.event}</p>
              <p className="mt-3 leading-relaxed text-muted">{a.description}</p>
            </div>
            {a.clip ? (
              <figure className="md:col-span-2 lg:col-span-1">
                <Loop src={a.clip.src} label={a.clip.label} aspect="aspect-[4/5]" />
                <figcaption className="mt-2 text-sm text-muted">Logo depois de receber a placa.</figcaption>
              </figure>
            ) : (
              a.photo && (
                <Photo
                  src={a.photo}
                  alt={`${a.title}, ${a.event}`}
                  caption="Na hora da premiação."
                  position={a.photoPosition}
                  className="md:col-span-2 lg:col-span-1"
                  aspect="aspect-[4/3]"
                  sizes="(min-width:1024px) 300px, 100vw"
                />
              )
            )}
          </section>
        ))}
        <p className="py-10 text-muted">
          Quer os números de quadra?{" "}
          <Link href="/records" className="text-link">
            Veja os recordes e as alianças da raposa
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
