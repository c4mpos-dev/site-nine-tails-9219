import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Photo } from "@/components/ui/Photo";
import { communityActions, coopertition, foundedTeams, projects, reach, schools } from "@/content/impact";

export const metadata: Metadata = {
  title: "Impacto",
  description:
    "Nine Learns, formação de professores, times fundados na rede pública e 55 equipes em 16 países: o impacto social da Nine Tails #9219.",
};

const numbers = [
  { v: 25000, s: "+", k: "pessoas impactadas" },
  { v: 6222, s: "", k: "crianças no Nine Learns" },
  { v: 30, s: "", k: "professores formados" },
  { v: 16, s: "", k: "países alcançados" },
];

export default function ImpactPage() {
  const maxSchool = Math.max(...schools.map((s) => s.impact));
  return (
    <>
      <PageHero
        kicker="Impacto"
        title="Mais que um torneio"
        lead="Nossa missão é transformar vidas através da robótica, levando STEAM para a rede pública e para as comunidades de Resende e região."
        image={{ src: "/team/2024-cuiaba-pit-visitas.webp", alt: "Visitantes no box da Nine Tails conhecendo o Nine Learns" }}
      >
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {numbers.map((x) => (
            <div key={x.k} className="border-t border-white/30 pt-3">
              <dd className="heading text-4xl">
                <Counter value={x.v} suffix={x.s} />
              </dd>
              <dt className="text-sm text-white/75">{x.k}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Projetos */}
      <Container className="py-14">
        <SectionHeading kicker="Projetos" title="O que fazemos fora da arena" />
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <RevealItem key={p.name} className="flex flex-col rounded-lg border border-line p-6">
              <p className="kicker">{p.tag}</p>
              <h3 className="heading mt-2 text-2xl">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
              {p.metric && <p className="heading mt-4 text-xl text-accent">{p.metric}</p>}
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>

      {/* Nine Learns por escola */}
      <section className="border-y border-line bg-surface">
        <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              kicker="Nine Learns · 2023"
              title="6.222 crianças em três semanas"
              lead="Entre novembro e dezembro de 2023, o Nine Learns e o Nine Learns Kids passaram por cinco escolas públicas de Resende, com atividades de baixo custo feitas com material reciclável."
            />
            <Photo src="/team/2024-cuiaba-pit.webp" alt="Box da Nine Tails com o painel do Nine Learns" caption="O box da equipe em Cuiabá, com o painel do Nine Learns." className="mt-8" aspect="aspect-[4/3]" />
          </div>
          <div className="space-y-5">
            {schools.map((s) => (
              <div key={s.name}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <p className="font-bold">
                    {s.name} <span className="font-normal text-muted">· {s.date}</span>
                  </p>
                  <p className="heading text-2xl">{s.impact.toLocaleString("pt-BR")}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(s.impact / maxSchool) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pelo mundo */}
      <Container className="py-14">
        <SectionHeading
          kicker="Pelo mundo"
          title="55 equipes em 16 países"
          lead="Mandamos o material do Nine Learns para equipes de FRC dos cinco continentes, incluindo a 254 Cheesy Poofs, a 118 Robonauts e a 1477 Texas Torque."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {reach.map((r) => (
            <div key={r.continent} className="rounded-lg border border-line p-5">
              <p className="heading text-4xl text-accent">{r.teams}</p>
              <p className="heading mt-1 text-xl">{r.continent}</p>
              <p className="mt-1 text-sm text-muted">{r.countries.join(", ")}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Legado e coopertition */}
      <Container className="grid gap-12 py-6 lg:grid-cols-2">
        <div>
          <h2 className="heading text-3xl">Times que ajudamos a fundar</h2>
          <ul className="mt-5 space-y-4">
            {foundedTeams.map((t) => (
              <li key={t.name} className="border-l-2 border-accent pl-4">
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-muted">
                  {t.program} · {t.place}
                </p>
              </li>
            ))}
            <li className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
              A equipe irmã <strong className="text-fg">Smart Lego</strong> representou a escola no Mundial FIRA, na Alemanha, e foi
              1º lugar geral no Torneio Brasil de Robótica.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="heading text-3xl">Coopertition</h2>
          <p className="mt-1 text-sm text-muted">48 reuniões com equipes do Brasil e do mundo.</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {coopertition.map((c) => (
              <li key={c.number}>
                <span className="font-bold">
                  #{c.number} {c.team}
                </span>
                <span className="block text-xs text-muted">{c.place}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="heading text-3xl">Na comunidade</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {communityActions.map((a) => (
            <li key={a} className="rounded-md border border-line px-3 py-1.5 text-sm text-muted">
              {a}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
