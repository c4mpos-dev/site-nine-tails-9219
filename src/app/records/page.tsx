import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { records, topAllies, topRivals } from "@/lib/matchStats";
import { teamInfo } from "@/content/allies";
import { WatchButton } from "@/components/seasons/VideoDialog";

export const metadata: Metadata = {
  title: "Recordes e alianças",
  description: "Os recordes da Nine Tails #9219 em partidas oficiais e as equipes que mais jogaram ao nosso lado.",
};

/** Números tirados das 122 partidas registradas no The Blue Alliance. */
export default function RecordsPage() {
  const r = records();
  const allies = topAllies(10);
  const rivals = topRivals(6);
  const maxAlly = allies[0]?.total ?? 1;

  const cards = [
    { k: "Maior placar", v: String(r.best.score), d: `${r.best.score} x ${r.best.against} · ${r.best.where}`, video: r.best.video },
    { k: "Maior vitória", v: `+${r.biggest.margin}`, d: `${r.biggest.score} · ${r.biggest.where}`, video: r.biggest.video },
    { k: "Vitória mais apertada", v: `+${r.closest.margin}`, d: `${r.closest.score} · ${r.closest.where}`, video: r.closest.video },
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/archive", label: "Mais" },
          { href: "/records", label: "Recordes" },
        ]}
        kicker="Em quadra"
        title="Recordes e alianças"
        lead={`${r.total.total} partidas oficiais desde 2023. Estes são os momentos e as parcerias que a raposa deixou em quadra.`}
        image={{ src: "/team/2025-brasilia-arak-campo.webp", alt: "Arak em campo", position: "50% 60%" }}
      />

      {/* Recordes */}
      <Container className="py-14">
        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          {cards.map((c) => (
            <RevealItem key={c.k} className="border-t-2 border-accent pt-4">
              <p className="text-sm text-muted">{c.k}</p>
              <p className="heading mt-1 text-4xl">{c.v}</p>
              <p className="mt-1 text-sm text-muted">{c.d}</p>
              {c.video && <WatchButton video={c.video} className="mt-2" />}
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>

      {/* Alianças */}
      <section className="border-y border-line bg-surface">
        <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="kicker">Coopertition em quadra</p>
            <h2 className="heading mt-3 text-4xl sm:text-5xl">Quem mais jogou do nosso lado</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Na FRC, a aliança muda a cada partida: quem é adversário agora pode ser parceiro daqui a pouco. Estas são as
              equipes com quem a Nine Tails mais dividiu a quadra.
            </p>
            <p className="mt-4 text-sm text-muted">Equipes de demonstração (números 9990+) usadas em off-seasons ficam de fora.</p>
          </Reveal>
          <ol className="space-y-4">
            {allies.map((a, i) => {
              const info = teamInfo(a.team);
              return (
                <li key={a.team} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="heading pt-0.5 text-xl text-muted">{i + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <a
                        href={`https://www.thebluealliance.com/team/${a.team}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold hover:text-accent"
                      >
                        #{a.team} {info?.name ?? ""}
                      </a>
                      <span className="text-sm tabular-nums text-muted">
                        {a.total} partidas juntas
                      </span>
                    </div>
                    {/* Barra: partidas juntas */}
                    <div className="mt-1.5 h-2 rounded-full bg-brand" style={{ width: `${(a.total / maxAlly) * 100}%` }} />
                    <p className="mt-1 text-xs text-muted">
                      {info?.city ? `${info.city} · ` : ""}
                      {a.events.join(", ")}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Adversários */}
      <Container className="py-14">
        <h2 className="heading text-3xl">Velhos conhecidos</h2>
        <p className="mt-2 text-muted">As equipes que mais cruzaram com a raposa do outro lado da quadra.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rivals.map((x) => (
            <li key={x.team} className="rounded-lg border border-line p-4">
              <a href={`https://www.thebluealliance.com/team/${x.team}`} target="_blank" rel="noreferrer" className="font-bold hover:text-accent">
                #{x.team} {teamInfo(x.team)?.name ?? ""}
              </a>
              <p className="text-sm text-muted tabular-nums">
                {x.total} partidas frente a frente{teamInfo(x.team)?.city ? ` · ${teamInfo(x.team)?.city}` : ""}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted">
          Fonte: todas as partidas registradas no{" "}
          <a href="https://www.thebluealliance.com/team/9219" target="_blank" rel="noreferrer" className="text-link">
            The Blue Alliance
          </a>
          , incluindo off-seasons.{" "}
          <Link href="/archive" className="text-link">
            Mais páginas
          </Link>
        </p>
      </Container>
    </>
  );
}
