import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Photo } from "@/components/ui/Photo";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  EngineeringIcon,
  FinalistIcon,
  HonorIcon,
  RookieAllStarIcon,
  RookieInspirationIcon,
} from "@/components/graphics/Trophies";
import { awards } from "@/content/awards";

export const metadata: Metadata = {
  title: "Conquistas",
  description:
    "Rookie All Star, Rookie Inspiration no Mundial de Houston, Engineering Award e mais: os prêmios da Nine Tails #9219.",
};

const icons: Record<string, typeof RookieAllStarIcon> = {
  "Rookie All Star Award": RookieAllStarIcon,
  "Rookie Inspiration Award": RookieInspirationIcon,
  "Engineering Award": EngineeringIcon,
  Finalista: FinalistIcon,
};

export default function AwardsPage() {
  return (
    <>
      <PageHero
        kicker="Conquistas"
        title="Prêmios e reconhecimentos"
        lead="Na FIRST, os prêmios mais importantes reconhecem engenharia, impacto e inspiração, não só pontuação."
        image={{ src: "/team/2023-houston-abraco.webp", alt: "Integrantes da Nine Tails comemorando em Houston" }}
      />
      <Container className="py-14">
        <RevealGroup className="divide-y divide-line">
          {awards.map((a) => {
            const Icon = icons[a.title] ?? HonorIcon;
            return (
              <RevealItem key={a.title} className="grid gap-6 py-10 md:grid-cols-[96px_1fr_auto] md:items-start">
                <Icon className="h-20 w-16 text-accent" />
                <div className="max-w-2xl">
                  <p className="kicker">{a.year}</p>
                  <h2 className="heading mt-2 text-3xl sm:text-4xl">{a.title}</h2>
                  <p className="mt-1 font-bold text-muted">{a.event}</p>
                  <p className="mt-3 leading-relaxed text-muted">{a.description}</p>
                </div>
                {a.photo && (
                  <Photo src={a.photo} alt={`${a.title}, ${a.event}`} className="w-full md:w-72" aspect="aspect-[3/2]" sizes="300px" />
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
        <p className="mt-10 text-muted">
          Quer os números de quadra?{" "}
          <Link href="/recordes" className="text-link">
            Veja os recordes e as alianças da raposa
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
