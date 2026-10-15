import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { DenCard } from "@/components/archive/DenCard";
import { home, roundTripKm, trips } from "@/content/trips";
import { records } from "@/lib/matchStats";

export const metadata: Metadata = {
  title: "Arquivo",
  description: "O arquivo da Nine Tails #9219: histórias, viagens e segredos que não cabem no menu.",
};

/** Hub das seções "escondidas" do site. */
export default function ArchivePage() {
  const rec = records();
  const km = trips.filter((t) => t.code !== "???").reduce((a, t) => a + roundTripKm(t), 0);
  return (
    <>
      <PageHero
        kicker="Arquivo"
        title="O que não cabe no menu"
        lead="Histórias, bastidores e segredos guardados ao longo das temporadas. Algumas portas estão abertas; outras você vai ter que encontrar."
        image={{ src: "/team/2023-the-answer-partida.webp", alt: "The Answer em partida no Off-Season de 2023" }}
      />
      <Container className="py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/pioneiros" className="group overflow-hidden rounded-lg border border-line transition-colors hover:border-accent">
            <div className="relative aspect-[16/9]">
              <Image src="/team/2023-houston-space-center.webp" alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="p-6">
              <p className="kicker">Charged Up · 2023</p>
              <h2 className="heading mt-2 text-3xl group-hover:text-accent">Os pioneiros</h2>
              <p className="mt-2 text-muted">O diário da primeira temporada em sete capítulos: da prova da seletiva ao Engineering Award.</p>
            </div>
          </Link>

          <Link href="/embarque" className="group overflow-hidden rounded-lg border border-line transition-colors hover:border-accent">
            <div className="flex aspect-[16/9] flex-col justify-center gap-2 bg-black px-6 font-mono text-sm">
              {trips.slice(0, 4).map((t, i) => (
                <p key={i} className="flex gap-4 text-white/70">
                  <span className="w-20 text-white/40">{t.date}</span>
                  <span className="text-[#f6d36b]">{t.code}</span>
                  <span className="truncate uppercase">{t.city}</span>
                </p>
              ))}
            </div>
            <div className="p-6">
              <p className="kicker">Partidas · {home.city}</p>
              <h2 className="heading mt-2 text-3xl group-hover:text-accent">Painel de embarque</h2>
              <p className="mt-2 text-muted">
                Todas as viagens de competição, de Brasília a Houston: {km.toLocaleString("pt-BR")} km na conta.
              </p>
            </div>
          </Link>

          <Link href="/recordes" className="group rounded-lg border border-line p-6 transition-colors hover:border-accent">
            <p className="kicker">Em quadra</p>
            <h2 className="heading mt-2 text-3xl group-hover:text-accent">Recordes e alianças</h2>
            <p className="mt-2 text-muted">
              {rec.total.total} partidas, o maior placar ({rec.best.score} pontos) e as equipes que mais jogaram do nosso lado.
            </p>
          </Link>

          <Link href="/glossario" className="group rounded-lg border border-line p-6 transition-colors hover:border-accent">
            <p className="kicker">Dicionário</p>
            <h2 className="heading mt-2 text-3xl group-hover:text-accent">Fala FRC?</h2>
            <p className="mt-2 text-muted">Pick, swerve, coopertition: o dialeto da robótica explicado para quem está chegando.</p>
          </Link>

          <DenCard />
        </div>
      </Container>
    </>
  );
}
