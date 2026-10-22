import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Handshake, Mail, Megaphone, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { AlumniDirectory } from "@/components/alumni/AlumniDirectory";
import { alumni } from "@/content/alumni";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Quem já vestiu a camisa da Nine Tails #9219: o que fazia na equipe, onde está hoje e como encontrar cada um.",
};

const has = (re: RegExp) => alumni.filter((a) => re.test(`${a.role} ${a.now ?? ""}`)).length;

const stats = [
  { value: alumni.length, label: "alumni na lista" },
  { value: has(/mentor/i), label: "voltaram como mentores" },
  { value: has(/volunt[áa]ri[ao] FIRST|juiz/i), label: "são voluntários ou juízes da FIRST" },
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
  "Anos na equipe (ex.: 2022–2024):",
  "O que faço hoje:",
  "Instagram (@):",
  "LinkedIn (link):",
  "",
  "Autorizo a publicação destes dados no site da Nine Tails.",
].join("\n");

/** Alumni: quem passou pela equipe, numa lista compacta que cresce a cada temporada. */
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
        image={{ src: "/team/2023-houston-equipe-bandeira.webp", alt: "A equipe com a bandeira do Brasil no Mundial de Houston, em 2023." }}
      />

      {/* O que é ser alumni */}
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
          <p>
            <strong className="text-fg">Alumni</strong> é como a FIRST chama quem já foi integrante de uma equipe. Na Nine Tails, é todo mundo que vestiu a
            camisa em pelo menos uma temporada, desde a primeira turma, de 2022.
          </p>
          <p>
            A equipe é de escola técnica, então a turma muda todo ano. Quem sai leva o que aprendeu na oficina e na arena para a engenharia, a programação, o
            design e a comunicação. E boa parte não vai embora de vez: volta como mentor, trabalha como voluntário nos eventos da FIRST ou aparece para ajudar
            os novatos.
          </p>
          <p>
            Esta página serve para lembrar quem fez parte da história e facilitar achar cada um. A primeira temporada está contada no{" "}
            <Link href="/pioneers" className="text-link">
              diário dos pioneiros
            </Link>
            .
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-4 border-y border-line py-6 lg:grid-cols-1 lg:gap-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              <dd className="heading text-5xl text-accent">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* Lista */}
      <section className="border-y border-line bg-surface">
        <Container className="py-14">
          <p className="kicker">Onde estão</p>
          <h2 className="heading mt-2 text-4xl">A lista</h2>
          <p className="mt-2 max-w-xl text-muted">Ícone apagado é rede que a pessoa ainda não mandou.</p>
          <div className="mt-8">
            <AlumniDirectory alumni={alumni} />
          </div>
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
            <p className="heading mt-2 text-3xl">Entre na lista</p>
            <p className="mt-2 max-w-lg text-muted">
              Mande pelo e-mail o que quiser mostrar: área, pelo que era responsável, onde está hoje, Instagram e LinkedIn. Só entra no site o que você
              autorizar.
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
