import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { zoom } from "@/lib/zoom";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Photo } from "@/components/ui/Photo";
import { Loop } from "@/components/ui/Loop";
import { Reveal } from "@/components/ui/Reveal";
import { Trophy } from "@/components/graphics/Trophies";
import { TrophyTurn } from "@/components/graphics/TrophyTurn";
import { AwardRing } from "@/components/graphics/AwardRing";
import { awards } from "@/content/awards";

export const metadata: Metadata = pageMeta({
  title: "Conquistas",
  description: "Rookie All Star, Rookie Inspiration no Mundial de Houston, Engineering Award, Prêmio de Impacto e mais: os prêmios da Nine Tails #9219.",
  path: "/awards",
});

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

      {/* A vitrine: as medalhas girando */}
      <section className="border-b border-line bg-surface">
        <Container className="pb-12 pt-14">
          <p className="kicker">A vitrine</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl">
            {awards.length} troféus em {inWords[seasonCount] ?? seasonCount} temporadas
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Arraste para girar ou clique numa medalha para trazê-la para a frente. Clique na da frente para ver a história.
          </p>
          <AwardRing awards={awards} className="mt-10" />
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
              {a.highlight && (
                <figure className="mt-6 flex items-center gap-5 rounded-lg border border-line bg-surface p-3 pr-5">
                  <div
                    className="zoomable relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-md bg-surface-2 sm:w-36"
                    {...zoom(a.highlight.src, `${a.highlight.name} com o ${a.title}.`)}
                  >
                    <Image
                      quality={90}
                      src={a.highlight.src}
                      alt={`${a.highlight.name} com o cristal e a placa do ${a.title}`}
                      fill
                      sizes="144px"
                      className="object-cover"
                      style={{ objectPosition: a.highlight.position }}
                    />
                  </div>
                  <figcaption>
                    <span className="heading block text-2xl text-accent">{a.highlight.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{a.highlight.text}</span>
                  </figcaption>
                </figure>
              )}
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
            Veja os recordes da raposa
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
