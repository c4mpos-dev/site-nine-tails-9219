import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { home, roundTripKm, trips } from "@/content/trips";
import { records } from "@/lib/matchStats";

export const metadata: Metadata = {
  title: "Mais",
  description: "Recordes, viagens, o diário dos pioneiros e glossário da Nine Tails #9219.",
};

/** Página "Mais": reúne as seções extras do site, todas também no menu. */
export default function ArchivePage() {
  const rec = records();
  const km = trips.filter((t) => t.code !== "???").reduce((a, t) => a + roundTripKm(t), 0);
  return (
    <>
      <PageHero
        kicker="Mais"
        title="Mais da Nine Tails"
        lead="Números, viagens, histórias de bastidor e material da marca: tudo o que a gente juntou ao longo das temporadas."
        image={{ src: "/team/2023-the-answer-partida.webp", alt: "The Answer em partida no Off-Season de 2023" }}
      />
      <Container className="py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/museum" className="group grid overflow-hidden rounded-lg border border-line bg-band text-white card md:col-span-2 md:grid-cols-[1fr_1.2fr]">
            <div className="p-6 sm:p-8">
              <p className="kicker !text-[#f0a6e8]">Acervo · 2022 até hoje</p>
              <h2 className="heading mt-2 text-4xl group-hover:text-[#f0a6e8]">Museu da Raposa</h2>
              <p className="mt-2 max-w-md text-white/75">
                Fotos sérias e de resenha, robôs, troféus e objetos de cada temporada, expostos em salas.
              </p>
              <p className="mt-4 font-bold">
                Entrar no museu <span aria-hidden className="card-arrow !text-[#f0a6e8]">→</span>
              </p>
            </div>
            <div className="relative hidden min-h-56 md:block">
              {[
                { src: "/museu/23-inicio-lanche.webp", c: "left-[8%] top-8 -rotate-6" },
                { src: "/museu/23-volta-beijo-trofeu.webp", c: "left-[38%] top-4 rotate-3" },
                { src: "/museu/24-festa-abraco-3.webp", c: "left-[66%] top-10 -rotate-2" },
              ].map((p) => (
                <div key={p.src} className={`absolute w-[28%] bg-[#fdfcf8] p-1.5 pb-5 shadow-xl transition-transform duration-500 group-hover:-translate-y-1 ${p.c}`}>
                  <div className="relative aspect-square">
                    <Image src={p.src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </Link>

          <Link href="/pioneers" className="card group overflow-hidden rounded-lg border border-line">
            <div className="card-media relative aspect-[16/9] overflow-hidden">
              <Image quality={90} src="/team/2023-houston-space-center.webp" alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6">
              <p className="kicker">Charged Up · 2023</p>
              <h2 className="heading mt-2 text-3xl group-hover:text-accent">
                Os pioneiros <span aria-hidden className="card-arrow">→</span>
              </h2>
              <p className="mt-2 text-muted">O diário da primeira temporada em sete capítulos: da prova da seletiva ao Engineering Award.</p>
            </div>
          </Link>

          <Link href="/travel" className="card group overflow-hidden rounded-lg border border-line">
            <div className="flex aspect-[16/9] flex-col justify-center gap-2 bg-black px-6 font-mono text-sm">
              {trips.slice(0, 4).map((t, i) => (
                <p key={i} className="flex gap-4 text-white/70">
                  <span className="w-20 text-white/60">{t.date}</span>
                  <span className="text-[#f6d36b]">{t.code}</span>
                  <span className="truncate uppercase">{t.city}</span>
                </p>
              ))}
            </div>
            <div className="p-6">
              <p className="kicker">Partidas · {home.city}</p>
              <h2 className="heading mt-2 text-3xl group-hover:text-accent">
                Painel de embarque <span aria-hidden className="card-arrow">→</span>
              </h2>
              <p className="mt-2 text-muted">
                Todas as viagens de competição, de Brasília a Houston: {km.toLocaleString("pt-BR")} km na conta.
              </p>
            </div>
          </Link>

          <Link href="/records" className="card group rounded-lg border border-line p-6">
            <p className="kicker">Em quadra</p>
            <h2 className="heading mt-2 text-3xl group-hover:text-accent">
              Recordes <span aria-hidden className="card-arrow">→</span>
            </h2>
            <p className="mt-2 text-muted">
              {rec.total.total} partidas, o maior placar ({rec.best.score} pontos), a maior sequência de vitórias e a evolução de cada temporada.
            </p>
          </Link>

          <Link href="/glossary" className="card group rounded-lg border border-line p-6">
            <p className="kicker">Dicionário</p>
            <h2 className="heading mt-2 text-3xl group-hover:text-accent">
              Fala FRC? <span aria-hidden className="card-arrow">→</span>
            </h2>
            <p className="mt-2 text-muted">Pick, swerve, coopertition: o dialeto da robótica explicado para quem está chegando.</p>
          </Link>
        </div>
      </Container>
    </>
  );
}
