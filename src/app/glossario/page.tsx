import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { glossary } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Fala FRC?",
  description: "Glossário da FIRST Robotics Competition: os termos que aparecem no site da Nine Tails #9219, explicados.",
};

/** Glossário: para pais, patrocinadores e quem está chegando agora na robótica. */
export default function GlossaryPage() {
  const groups = [...new Set(glossary.map((g) => g.group))];
  const slug = (g: string) => g.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/arquivo", label: "Arquivo" },
          { href: "/glossario", label: "Fala FRC?" },
        ]}
        kicker="Glossário"
        title="Fala FRC?"
        lead="Pick, swerve, coopertition... A robótica tem um dialeto próprio. Aqui vai o dicionário para pais, patrocinadores e futuros membros."
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Grupos" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {groups.map((g) => (
              <li key={g}>
                <a href={`#${slug(g)}`} className="text-sm text-muted hover:text-accent">
                  {g}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14">
          {groups.map((g) => (
            <section key={g} id={slug(g)} className="scroll-mt-24">
              <h2 className="heading text-3xl">{g}</h2>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {glossary
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <div key={t.id} id={t.id} className="grid scroll-mt-24 gap-1 py-4 target:bg-surface sm:grid-cols-[220px_1fr] sm:gap-6">
                      <dt className="font-bold">{t.term}</dt>
                      <dd className="leading-relaxed text-muted">{t.def}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          ))}
          <p className="text-sm text-muted">
            Faltou alguma palavra?{" "}
            <a href="mailto:ninetails9219@gmail.com?subject=Gloss%C3%A1rio" className="text-link">
              Manda pra gente
            </a>
            . <Link href="/arquivo" className="text-link">Voltar ao arquivo</Link>
          </p>
        </div>
      </Container>
    </>
  );
}
