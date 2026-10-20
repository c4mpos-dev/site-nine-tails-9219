import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FlapText } from "@/components/archive/FlapText";
import { home, roundTripKm, trips } from "@/content/trips";

export const metadata: Metadata = {
  title: "Painel de embarque",
  description: "Todas as viagens de competição da Nine Tails #9219, saindo de Resende: de Brasília a Houston.",
};

/** As viagens da equipe num painel de aeroporto. */
export default function BoardingPage() {
  const done = trips.filter((t) => t.code !== "???");
  const totalKm = done.reduce((acc, t) => acc + roundTripKm(t), 0);
  const cities = new Set(done.map((t) => t.city)).size;
  const earthLaps = totalKm / 40075;

  return (
    <section className="bg-[#0b0710] text-white">
      <Container className="py-14 sm:py-20">
        <nav aria-label="Trilha" className="mb-6 flex gap-2 text-sm text-white/50">
          <Link href="/arquivo" className="hover:text-white">
            Mais
          </Link>
          <span aria-hidden>/</span>
          <span>Painel de embarque</span>
        </nav>
        <p className="kicker !text-[#f0a6e8]">Partidas · Origem {home.city} ({home.code})</p>
        <h1 className="heading mt-3 text-5xl sm:text-7xl">Por onde a raposa passou</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Cada competição começa numa estrada ou num aeroporto. Este é o painel de todas as viagens da equipe desde 2023.
        </p>

        {/* Painel */}
        <div className="mt-10 overflow-x-auto rounded-lg border border-white/10 bg-black shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]">
          <table className="w-full min-w-[760px] font-mono text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[0.7rem] uppercase tracking-[0.2em] text-[#f0a6e8]">
                <th className="px-4 py-3 font-normal">Data</th>
                <th className="px-4 py-3 font-normal">Destino</th>
                <th className="px-4 py-3 font-normal">Evento</th>
                <th className="px-4 py-3 text-right font-normal">Ida e volta</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t, i) => (
                <tr key={`${t.date}-${t.code}-${i}`} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-white/60">
                    <FlapText text={t.date} delay={i * 90} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="mr-3 inline-block rounded bg-white/10 px-1.5 py-0.5 text-[#f6d36b]">
                      <FlapText text={t.code} delay={i * 90} />
                    </span>
                    <span className="uppercase text-white">{t.city}</span>
                  </td>
                  <td className="px-4 py-3 uppercase text-white/75">{t.event}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-white/75">
                    {t.code === "???" ? "—" : `${roundTripKm(t).toLocaleString("pt-BR")} km`}
                  </td>
                  <td className="px-4 py-3">
                    <FlapText
                      text={t.status}
                      delay={300 + i * 90}
                      className={t.highlight ? "font-bold text-[#f0a6e8]" : t.code === "???" ? "animate-pulse text-[#f6d36b]" : "text-white/60"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-white/40">Distâncias em linha reta a partir de Resende, ida e volta. Na estrada é sempre mais.</p>

        {/* Totais */}
        <dl className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="border-t border-white/15 pt-4">
            <dt className="text-sm text-white/60">Quilômetros viajados</dt>
            <dd className="heading mt-1 text-5xl">{totalKm.toLocaleString("pt-BR")}</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="text-sm text-white/60">De uma volta ao mundo</dt>
            <dd className="heading mt-1 text-5xl">{Math.round(earthLaps * 100)}%</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="text-sm text-white/60">Cidades de competição</dt>
            <dd className="heading mt-1 text-5xl">{cities}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
