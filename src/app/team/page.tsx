import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { Loop } from "@/components/ui/Loop";
import { InstagramIcon, LinkedinIcon } from "@/components/icons/Social";
import { alumni, areas, mentors, roster } from "@/content/people";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Equipe",
  description: "A história, as áreas, os mentores, os membros e os alumni da Nine Tails #9219, equipe de FRC da Escola Firjan SENAI SESI Resende.",
};

const facts = [
  { value: "2022", label: "fundação, em 2 de novembro" },
  { value: "80", label: "inscritos para 15 vagas na primeira seleção" },
  { value: "4", label: "áreas: mecânica, elétrica, programação e marketing" },
  { value: "RJ", label: "Escola Firjan SENAI SESI, em Resende" },
];

const milestones = [
  { date: "Nov 2022", text: "Processo seletivo: 80 inscritos para 15 vagas. Nasce a Nine Tails." },
  { date: "Mar 2023", text: "Primeira regional, em Brasília: Rookie All Star e vaga para o Mundial." },
  { date: "Abr 2023", text: "Mundial de Houston, divisão Curie: Rookie Inspiration Award." },
  { date: "Ago 2023", text: "Engineering Award no Off-Season do Rio com o The Answer." },
  { date: "Nov 2023", text: "Nine Learns: 6.222 crianças de escolas públicas em três semanas." },
  { date: "Ago 2024", text: "Primeiro swerve (Predator) e final do Off-Season do Mato Grosso." },
  { date: "Mar 2025", text: "Arak nas regionais de Brasília e São Paulo." },
  { date: "Mar 2026", text: "Temporada REBUILT, em São Paulo e Osasco." },
];

const workshop = [
  {
    src: "/clips/oficina-cad.mp4",
    title: "Projeto",
    text: "Tudo começa no CAD: o robô é montado peça por peça no computador antes de existir.",
    label: "Integrante da equipe modelando uma peça do robô no computador.",
  },
  {
    src: "/clips/oficina-usinagem.mp4",
    title: "Usinagem",
    text: "Na fresa, as peças saem do alumínio. Quem projeta também aprende a fabricar.",
    label: "Integrantes da equipe usinando uma peça na fresadora.",
  },
  {
    src: "/clips/oficina-codigo.mp4",
    title: "Código",
    text: "A programação dá vida ao robô: controle, sensores e o autônomo.",
    label: "Integrantes da equipe programando o robô nos notebooks.",
  },
];

export default function TeamPage() {
  return (
    <>
      <PageHero
        kicker="Equipe"
        title="Quem faz a raposa"
        lead="Estudantes de escola técnica, mentores e ex-integrantes que constroem robôs e levam a robótica para mais gente."
        image={{ src: "/team/2025-equipe.webp", alt: "Equipe Nine Tails com a bandeira da Firjan na Regional de Brasília 2025", position: "50% 60%" }}
      />

      {/* 1. A história, curta, com os números ao lado */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="prose-nt max-w-[66ch]">
          <p className="text-xl !text-fg">
            A Nine Tails nasceu em 2 de novembro de 2022, da parceria entre SESI e SENAI, na Escola Firjan de Resende (RJ).
          </p>
          <p>
            Com três meses de equipe fomos para a primeira regional, em Brasília. Ficamos entre os 10 melhores robôs, ganhamos
            o <strong>Rookie All Star</strong> e uma vaga para o Mundial de Houston, onde recebemos o{" "}
            <strong>Rookie Inspiration Award</strong>.
          </p>
          <p>
            Desde então a equipe se renova a cada ano, mas a ideia é a mesma: aprender construindo, e levar a robótica para
            escolas públicas e comunidades que nunca tiveram contato com ela. O processo seletivo dá prioridade a quem veio da
            rede pública. A história da primeira formação está no{" "}
            <Link href="/pioneiros" className="text-link">
              diário dos pioneiros
            </Link>
            .
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start border-t-2 border-accent pt-6">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="heading text-4xl">{f.value}</dt>
              <dd className="mt-1 text-sm leading-snug text-muted">{f.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* 2. O nome */}
      <Container>
        <div id="nome" className="grid scroll-mt-24 gap-6 rounded-lg border border-line bg-surface p-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
          <p className="heading text-7xl text-accent" aria-hidden>
            狐
          </p>
          <div>
            <h2 className="heading text-3xl">Por que &quot;Nine Tails&quot;?</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted">
              Na mitologia japonesa, a <strong className="text-fg">Kitsune</strong> é uma raposa que ganha uma nova cauda a cada
              mil anos de sabedoria, até chegar a nove. O nome virou o jeito da equipe se enxergar: evolução constante, uma
              temporada de cada vez.
            </p>
          </div>
        </div>
      </Container>

      {/* 3. Áreas, cada uma com quem faz parte dela */}
      <div id="membros" className="scroll-mt-16" />
      <Container className="py-20">
        <SectionHeading
          kicker="Áreas"
          title="Como a equipe se organiza"
          lead={`Quatro áreas que trabalham juntas no mesmo robô. Abaixo de cada uma, quem fez parte dela na temporada ${roster.season}.`}
        />
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => {
            const members = roster.members.filter((m) => m.area === a.name);
            return (
              <section key={a.slug} aria-labelledby={`area-${a.slug}`}>
                <Photo src={a.photo} alt={`Área de ${a.name}`} aspect="aspect-[4/5]" sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" />
                <h3 id={`area-${a.slug}`} className="heading mt-5 text-2xl">
                  {a.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{a.description}</p>
                {members.length > 0 && (
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {members.map((m) => (
                      <li key={m.name} className="flex items-baseline justify-between gap-3 py-2">
                        <span className="font-bold">{m.name}</span>
                        <span className="text-right text-xs text-muted">{m.role}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </Container>

      {/* Na oficina: do desenho ao código, em loops curtos */}
      <Container className="pb-20">
        <SectionHeading
          kicker="Na oficina"
          title="Do desenho ao código"
          lead="Antes de chegar à arena, cada peça passa pelo CAD, pela usinagem e pelo código. Trechos gravados na oficina em julho de 2023."
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {workshop.map((w, i) => (
            <li key={w.src}>
              <Loop src={w.src} label={w.label} aspect="aspect-[4/5]" />
              <p className="mt-4 flex items-baseline gap-3">
                <span className="heading text-2xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading text-2xl">{w.title}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{w.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* 4. Mentores e alumni */}
      <section className="border-y border-line bg-surface">
        <Container className="grid gap-16 py-20 lg:grid-cols-[1fr_1.4fr]">
          <div id="mentores" className="scroll-mt-24">
            <p className="kicker">Quem orienta</p>
            <h2 className="heading mt-3 text-4xl">Mentores</h2>
            <ul className="mt-8 space-y-4">
              {mentors.map((m) => (
                <li key={m.name} className="flex items-center gap-4">
                  <span aria-hidden className="heading grid size-12 shrink-0 place-items-center rounded-full bg-brand text-lg text-brand-ink">
                    {m.name[0]}
                  </span>
                  <span>
                    <span className="block font-bold">{m.name}</span>
                    <span className="block text-sm text-muted">
                      {m.role}
                      {m.area ? ` · ${m.area}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div id="alumni" className="scroll-mt-24">
            <p className="kicker">Quem passou e continua por perto</p>
            <h2 className="heading mt-3 text-4xl">Alumni</h2>
            <p className="mt-3 max-w-lg text-muted">Onde anda quem já vestiu a camisa da raposa, e como achar cada um.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {alumni.map((a) => (
                <li key={a.name} className="flex gap-3 rounded-lg border border-line bg-bg p-4">
                  <span aria-hidden className="heading grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-lg text-accent">
                    {a.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">{a.name}</span>
                    <span className="block text-sm text-muted">
                      {a.now ?? a.role}
                      {a.years && ` · na equipe em ${a.years}`}
                    </span>
                    {(a.instagram || a.linkedin) && (
                      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold">
                        {a.instagram && (
                          <a href={`https://www.instagram.com/${a.instagram}/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            <InstagramIcon className="size-3.5" /> @{a.instagram}
                          </a>
                        )}
                        {a.linkedin && (
                          <a href={a.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            <LinkedinIcon className="size-3.5" /> LinkedIn
                          </a>
                        )}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              É alumni e quer aparecer aqui com o seu @?{" "}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Alumni no site")}`} className="text-link">
                Mande para a equipe
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* 5. Marcos, em faixa compacta */}
      <Container className="py-20">
        <SectionHeading kicker="Linha do tempo" title="Marcos da equipe" />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <li key={m.date} className="bg-bg p-5">
              <p className="heading text-xl text-accent">{m.date}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">
          Cada temporada em detalhe está em{" "}
          <Link href="/temporadas" className="text-link">
            Temporadas
          </Link>
          .
        </p>
      </Container>

      {/* 6. Convite */}
      <Container>
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
