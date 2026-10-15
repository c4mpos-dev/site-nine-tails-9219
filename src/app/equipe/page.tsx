import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { alumni, areas, mentors, roster } from "@/content/people";

export const metadata: Metadata = {
  title: "Equipe",
  description: "A história, as áreas, os mentores, os membros e os alumni da Nine Tails #9219, equipe de FRC da Escola Firjan SENAI SESI Resende.",
};

const milestones = [
  { date: "Nov 2022", text: "Processo seletivo na Firjan SENAI Resende: 80 inscritos para 15 vagas. Nasce a Nine Tails." },
  { date: "Mar 2023", text: "Primeira regional, em Brasília: 9º lugar, Rookie All Star e vaga para o Mundial." },
  { date: "Abr 2023", text: "Mundial de Houston, divisão Curie: Rookie Inspiration Award." },
  { date: "Ago 2023", text: "Off-Season no Rio de Janeiro: Engineering Award com o The Answer, construído em menos de um mês." },
  { date: "Nov 2023", text: "Nine Learns: 6.222 crianças de escolas públicas de Resende em três semanas." },
  { date: "Ago 2024", text: "Primeiro swerve drive (Predator) e final do Off-Season do Mato Grosso." },
  { date: "Mar 2025", text: "Arak, com níveis de coral automatizados, nas regionais de Brasília e São Paulo." },
  { date: "Mar 2026", text: "Temporada REBUILT, com regionais em São Paulo e Osasco." },
  { date: "2027", text: "BIOCORE: a próxima temporada já está a caminho." },
];

/** Página de leitura: a história da equipe contada de forma simples. */
export default function TeamPage() {
  return (
    <>
      <PageHero
        kicker="Quem somos"
        title="A nossa história"
        lead="Uma equipe de escola técnica que decidiu entrar no mundo da FRC, e levar mais gente junto."
        image={{ src: "/photos/equipe-1.webp", alt: "Equipe Nine Tails reunida", position: "50% 30%" }}
      />

      {/* Texto de abertura */}
      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="prose-nt max-w-[68ch]">
          <p className="text-xl !text-fg">
            A Nine Tails nasceu em 2 de novembro de 2022, da parceria entre SESI e SENAI, na Escola Firjan de Resende (RJ).
          </p>
          <p>
            Foram 80 inscritos para 15 vagas, divididas em quatro áreas: mecânica, elétrica, programação e social/marketing.
            Com três meses de equipe fomos para a primeira regional, em Brasília. Ficamos entre os 10 melhores robôs, ganhamos
            o <strong>Rookie All Star</strong> e uma vaga para o Mundial de Houston, onde recebemos o{" "}
            <strong>Rookie Inspiration Award</strong>.
          </p>
          <p>
            Desde então a equipe se renova a cada ano, mas a ideia é a mesma: aprender construindo, e levar a robótica para
            escolas públicas e comunidades que nunca tiveram contato com ela. O processo seletivo dá prioridade a quem veio da
            rede pública.
          </p>
          <p>
            A história completa da primeira formação está no{" "}
            <Link href="/pioneiros" className="text-link">
              diário dos pioneiros
            </Link>
            .
          </p>

          <h2 id="nome" className="scroll-mt-24">
            Por que &quot;Nine Tails&quot;?
          </h2>
          <p>
            Na mitologia japonesa, a <strong>Kitsune (狐)</strong> é uma raposa que ganha uma nova cauda a cada mil anos de
            sabedoria, até chegar a nove. O nome virou o jeito da equipe se enxergar: <strong>evolução constante</strong>, uma
            temporada de cada vez.
          </p>
        </div>
        <div className="space-y-6">
          <Photo src="/photos/hero-1.webp" alt="Equipe em frente à Escola Firjan SENAI Resende" caption="Em frente à escola, em Resende." aspect="aspect-[4/3]" sizes="340px" />
          <Photo src="/photos/rookie-inspiration.webp" alt="Equipe em Houston" caption="Houston, 2023." aspect="aspect-[4/3]" sizes="340px" />
          <Photo src="/team/2023-tank-tails-oficina.webp" alt="Tank Tails na oficina" caption="O primeiro robô, ainda na oficina." aspect="aspect-[4/3]" sizes="340px" />
        </div>
      </Container>

      {/* Marcos */}
      <section className="border-y border-line bg-surface">
        <Container className="py-14">
          <SectionHeading kicker="Linha do tempo" title="Marcos da equipe" />
          <ol className="mt-10 max-w-3xl">
            {milestones.map((m, i) => (
              <li key={m.date} className="grid grid-cols-[88px_20px_1fr] gap-3 sm:grid-cols-[110px_24px_1fr]">
                <span className="heading pt-0.5 text-lg text-accent">{m.date}</span>
                <span className="relative flex justify-center">
                  <span className="mt-2 size-2.5 rounded-full bg-accent" />
                  {i < milestones.length - 1 && <span className="absolute bottom-0 top-5 w-px bg-line" />}
                </span>
                <p className="pb-8 leading-relaxed text-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Áreas */}
      <Container className="py-14">
        <SectionHeading kicker="Áreas" title="Como a equipe se organiza" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <div key={a.slug}>
              <Photo src={a.photo} alt={a.name} aspect="aspect-[4/5]" sizes="(min-width:1024px) 22vw, 45vw" />
              <h3 className="heading mt-4 text-2xl">{a.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{a.description}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Pessoas */}
      <Container className="grid gap-12 py-6 lg:grid-cols-3">
        <div>
          <h2 className="heading text-3xl">Mentores</h2>
          <ul className="mt-5 space-y-4">
            {mentors.map((m) => (
              <li key={m.name}>
                <p className="font-bold">{m.name}</p>
                <p className="text-sm text-muted">
                  {m.role}
                  {m.area ? ` · ${m.area}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="heading text-3xl">Competidores</h2>
          <p className="text-sm text-muted">Elenco {roster.season}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {roster.members.map((m) => (
              <li key={m.name}>
                <p className="font-bold">{m.name}</p>
                <p className="text-xs text-muted">{m.area}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="heading text-3xl">Alumni</h2>
          <p className="text-sm text-muted">Quem passou e continua por perto.</p>
          <ul className="mt-5 space-y-3">
            {alumni.map((a) => (
              <li key={a.name}>
                <p className="font-bold">{a.name}</p>
                <p className="text-xs text-muted">{a.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-14">
        <div className="rounded-lg border border-line p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="heading text-3xl">Quer entrar para a equipe?</h2>
            <p className="mt-2 text-muted">O processo seletivo acontece todo ano, com provas por área. Os avisos saem no nosso Instagram.</p>
          </div>
          <Button href="https://www.instagram.com/ninetails9219/" className="mt-6 shrink-0 sm:mt-0">
            @ninetails9219
          </Button>
        </div>
      </Container>
    </>
  );
}
