import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { seasonPhotos } from "@/content/credits";

export const metadata: Metadata = pageMeta({
  title: "Créditos das fotos",
  description: "Créditos e licenças das fotos de temporadas da FRC usadas no site da Nine Tails #9219.",
  path: "/credits",
});

export default function CreditsPage() {
  return (
    <>
      <PageHero
        kicker="Créditos"
        title="Créditos das fotos"
        lead="As fotos da equipe são nossas. As fotos que ilustram os jogos da FRC são de outras pessoas, sob licenças livres. Obrigado a quem compartilha!"
      />
      <Container className="py-12">
        <ul className="max-w-3xl divide-y divide-line">
          {Object.values(seasonPhotos).map((p) => (
            <li key={p.src} className="py-4">
              <p className="font-bold">{p.caption}</p>
              <p className="text-sm text-muted">
                {p.author} · {p.license} ·{" "}
                <a href={p.source} target="_blank" rel="noreferrer" className="text-link">
                  fonte
                </a>
              </p>
            </li>
          ))}
          <li className="py-4 text-sm text-muted">
            Os logos dos jogos e da FIRST® Robotics Competition são marcas da FIRST®, usados conforme as diretrizes para equipes.
          </li>
        </ul>
      </Container>
    </>
  );
}
