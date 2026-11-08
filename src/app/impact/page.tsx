import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { Photo } from "@/components/ui/Photo";
import { NineLearnsFox } from "@/components/impact/NineLearnsFox";
import { ProjectChapters } from "@/components/impact/ProjectChapters";
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
  return (
    <>
      <PageHero
        kicker="Impacto"
        title="Robótica na rede pública de Resende"
        lead="O Nine Learns já passou por 5 escolas públicas de Resende, com 6.222 crianças, e o material está com 55 equipes em 16 países."
        image={{ src: "/team/2025-maua-escola-visita.webp", alt: "Alunos da Escola Francisco Quirino Diniz, em Mauá, com os projetos feitos na visita da Nine Tails", position: "50% 55%" }}
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
        <SectionHeading kicker="Projetos" title="O que fazemos fora da arena" lead={`${projects.length} projetos, cada um com a sua história.`} />
        <div className="mt-12">
          <ProjectChapters projects={projects} />
        </div>
      </Container>

      {/* O estande do Nine Learns nas competições */}
      <Container className="pb-14">
        <p className="kicker">Fora da quadra</p>
        <h2 className="heading mt-3 text-3xl sm:text-4xl">O Nine Learns também vai às competições</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Em cada evento, o box da equipe vira estande: painéis do projeto, materiais para levar para casa e conversa com
          quem passa, de outras equipes a famílias e estudantes.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Photo src="/team/2024-cuiaba-estande-nine-learns.webp" alt="Estande da Nine Tails com os painéis do Nine Learns" caption="O estande em Cuiabá, 2024." aspect="aspect-[4/3]" sizes="(min-width:640px) 33vw, 100vw" />
          <Photo src="/team/2024-cuiaba-estande-visitas.webp" alt="Visitantes no estande da Nine Tails" caption="Estudantes visitando o box." aspect="aspect-[4/3]" sizes="(min-width:640px) 33vw, 100vw" />
          <Photo src="/team/2024-cuiaba-pit-visitas.webp" alt="Integrantes apresentando o Nine Learns" caption="Apresentando o projeto para quem passa." aspect="aspect-[4/3]" sizes="(min-width:640px) 33vw, 100vw" />
        </div>
      </Container>

      {/* Nine Learns por escola */}
      <section className="border-y border-line bg-surface">
        <Container className="py-14">
          <NineLearnsFox
            schools={schools}
            heading={
              <SectionHeading
                kicker="Nine Learns · 2023"
                title="6.222 crianças em três semanas"
                lead="Entre novembro e dezembro de 2023, o Nine Learns e o Nine Learns Kids passaram por cinco escolas públicas de Resende, com atividades de baixo custo feitas com material reciclável."
              />
            }
          />
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
