import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SponsorWall } from "@/components/ui/SponsorWall";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Apoie a equipe",
  description: "Patrocine a Nine Tails #9219 e invista em educação STEAM, inovação e na próxima geração de engenheiros de Resende.",
};

const mail = `mailto:${site.email}?subject=Patroc%C3%ADnio%20Nine%20Tails`;

const reasons = [
  { title: "Forma profissionais", text: "CAD, usinagem, eletrônica, programação, gestão e comunicação, com prazos de verdade." },
  { title: "Impacto real", text: "Mais de 25 mil pessoas impactadas com STEAM na rede pública e na comunidade." },
  { title: "Visibilidade", text: "Sua marca no robô, no uniforme, nas redes e em eventos nacionais e internacionais." },
  { title: "Conexão com a indústria", text: "Contato direto com os futuros técnicos e engenheiros da região." },
];

export default function SponsorPage() {
  return (
    <>
      <PageHero
        kicker="Apoie a equipe"
        title="Patrocine a Nine Tails"
        lead="Um robô de FRC custa caro, e as viagens para as regionais custam ainda mais. Cada parceiro mantém vivo um time que forma pessoas e transforma a comunidade."
        image={{ src: "/seasons/2023-charged-up-field.webp", alt: "Campo de FRC durante uma regional", credit: "Lily Chen / NAVWAR, domínio público" }}
      >
        <div className="mt-8">
          <Button href={mail}>Falar sobre patrocínio</Button>
        </div>
      </PageHero>

      <Container className="py-14">
        <SectionHeading kicker="Por que apoiar" title="O retorno vai além da marca" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <div key={r.title} className="border-t-2 border-accent pt-4">
              <p className="heading text-3xl text-muted">0{i + 1}</p>
              <h3 className="heading mt-2 text-xl">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="border-y border-line bg-surface">
        <Container className="py-14">
          <SectionHeading kicker="Parceiros" title="Quem já está com a gente" />
          <SponsorWall className="mt-8" />
        </Container>
      </section>

      <Container className="py-14">
        <div className="rounded-lg bg-brand p-8 text-brand-ink sm:p-12">
          <h2 className="heading text-4xl">Vamos conversar?</h2>
          <p className="mt-3 max-w-xl text-white/85">
            Mande um e-mail para <strong>{site.email}</strong> e enviamos o plano de patrocínio da temporada.
          </p>
          <a href={mail} className="mt-6 inline-block rounded-md bg-white px-5 py-3 text-sm font-bold text-[#1b0d26] hover:bg-white/90">
            Enviar e-mail →
          </a>
        </div>
      </Container>
    </>
  );
}
