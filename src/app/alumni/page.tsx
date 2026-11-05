import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Handshake, Mail, Megaphone, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { AlumniBoard } from "@/components/alumni/AlumniBoard";
import { Reveal } from "@/components/ui/Reveal";
import { alumni, paths } from "@/content/alumni";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Quem já vestiu a camisa da Nine Tails #9219: o que fazia na equipe, o que faz hoje e como continua perto da raposa.",
};

const stats = [
  { value: alumni.length, label: "alumni na lista" },
  { value: 2023, label: "a primeira temporada" },
  { value: paths.length, label: "caminhos depois da equipe" },
];

const intro = [
  {
    title: "Quem conta como alumni",
    text: "É como a FIRST chama quem já foi integrante de uma equipe. Na Nine Tails, é todo mundo que vestiu a camisa em pelo menos uma temporada, desde a primeira turma, selecionada no fim de 2022.",
  },
  {
    title: "Para onde eles vão",
    text: "A equipe é de escola técnica, então a turma muda todo ano. Quem sai leva projeto, prazo, trabalho em equipe e muita pressão de partida para a faculdade e o trabalho.",
  },
  {
    title: "Para que serve esta página",
    text: (
      <>
        Mostrar quem fez parte da história e onde cada um está agora. Se você é de uma empresa ou faculdade, é um bom lugar para conhecer gente que já
        entrou em quadra. A primeira temporada está no{" "}
        <Link href="/pioneers" className="text-link">
          diário dos pioneiros
        </Link>
        .
      </>
    ),
  },
];

const ways = [
  { icon: GraduationCap, title: "Mentoria", text: "Voltar para orientar uma área: quem já passou por uma temporada conhece o caminho das pedras." },
  { icon: Handshake, title: "Voluntariado FIRST", text: "Ajudar nos eventos da FIRST no Brasil, como voluntário ou juiz, e ver a robótica do outro lado." },
  { icon: Wrench, title: "Oficina e conversas", text: "Passar uma tarde com os novatos e contar como foi a faculdade, o estágio ou o primeiro emprego." },
  { icon: Megaphone, title: "Divulgação", text: "Indicar patrocinadores, compartilhar as competições e levar o nome da raposa para onde estiver." },
];

const template = [
  "Nome:",
  "Área (Mecânica, Elétrica, Programação, Social & Marketing):",
  "Pelo que eu era responsável na equipe:",
  "Anos na equipe (ex.: 2023–2024):",
  "O que faço hoje (curso, cargo, empresa):",
  "Uma frase de como a turma lembra de mim:",
  "Foto (opcional, pode anexar):",
  "Instagram (@):",
  "LinkedIn (link):",
  "",
  "Autorizo a publicação destes dados no site da Nine Tails.",
].join("\n");

/** Alumni: quem passou pela equipe, numa órbita em volta do emblema e em crachás de "na raposa" e "hoje". */
export default function AlumniPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/archive", label: "Mais" },
          { href: "/alumni", label: "Alumni" },
        ]}
        kicker="Alumni"
        title="Quem passou pela raposa"
        lead="A cada temporada, gente sai da equipe para a faculdade e para o trabalho. A camisa fica, e muitos continuam por perto."
        image={{ src: "/team/2023-houston-equipe-bandeira.webp", alt: "A primeira turma da Nine Tails reunida com a bandeira do Brasil no Mundial de Houston, em 2023.", position: "50% 36%" }}
      />

      {/* O que é ser alumni: uma frase grande, os números e três respostas curtas */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="kicker">O que é alumni</p>
          <p className="heading mt-3 text-5xl leading-[0.95] sm:text-6xl">
            A turma muda.
            <br />
            <span className="text-accent">A camisa fica.</span>
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border-t-2 border-accent pt-3">
                <dd className="heading text-4xl">{s.value}</dd>
                <dt className="mt-1 text-xs leading-snug text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {intro.map((x, i) => (
            <li key={x.title}>
              <Reveal delay={i * 0.08} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="heading text-2xl">{x.title}</p>
                  <p className="mt-2 leading-relaxed text-muted">{x.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      {/* Órbita e crachás */}
      <section className="overflow-hidden border-y border-line bg-surface">
        <Container className="py-16">
          <AlumniBoard alumni={alumni} />
        </Container>
      </section>

      {/* Como continuar por perto */}
      <Container className="py-14">
        <p className="kicker">Depois da equipe</p>
        <h2 className="heading mt-2 text-4xl">Como continuar por perto</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((w) => (
            <li key={w.title} className="border-t-2 border-accent pt-4">
              <w.icon className="size-6 text-accent" />
              <p className="heading mt-3 text-xl">{w.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{w.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-8 rounded-lg border border-line bg-surface p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="kicker">É alumni?</p>
            <p className="heading mt-2 text-3xl">Pegue o seu crachá</p>
            <p className="mt-2 max-w-lg text-muted">
              Mande pelo e-mail o que quiser mostrar: o que fazia na equipe, o que faz hoje e uma frase sua. Só entra no site o que
              você autorizar.
            </p>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Alumni no site")}&body=${encodeURIComponent(template)}`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-bold text-brand-ink hover:bg-brand-strong"
            >
              <Mail className="size-4" /> Enviar meus dados
            </a>
          </div>
          <pre className="overflow-x-auto rounded-md border border-line bg-bg p-5 font-mono text-xs leading-relaxed text-muted">{template}</pre>
        </div>
      </Container>
    </>
  );
}
