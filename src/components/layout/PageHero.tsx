import Link from "next/link";
import { Maximize2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { HeroBackdrop, HeroFade, HeroTitle } from "./HeroMotion";

/**
 * Topo das páginas internas: foto real ao fundo, escurecida com o roxo da equipe.
 * Sem foto, vira uma faixa lisa. O botão no canto mostra a foto inteira, sem o texto por cima.
 * A foto abre com zoom lento e desce devagar ao rolar; o título sobe palavra por palavra.
 */
export function PageHero({
  kicker,
  title,
  lead,
  crumbs,
  image,
  children,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: Array<{ href: string; label: string }>;
  image?: { src: string; alt: string; credit?: string; position?: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#160b20] text-white">
      {image && (
        <>
          <HeroBackdrop src={image.src} alt={image.alt} position={image.position} />
          <div className="absolute inset-0 -z-10 bg-[var(--hero-overlay)]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#160b20] via-transparent to-transparent" />
        </>
      )}
      <Container className="py-16 sm:py-24">
        {crumbs && (
          <nav aria-label="Trilha" className="mb-6 flex flex-wrap gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Início
            </Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex gap-2">
                <span aria-hidden>/</span>
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        {kicker && (
          <Kicker className="!text-[#f0a6e8]" line="bg-[#f0a6e8]">
            {kicker}
          </Kicker>
        )}
        <HeroTitle className="heading mt-3 max-w-4xl text-5xl sm:text-7xl">{title}</HeroTitle>
        <HeroFade>
          {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lead}</p>}
          {children}
        </HeroFade>
      </Container>
      {image && (
        <div className="absolute bottom-3 right-4 flex items-center gap-3">
          {image.credit && <p className="text-[0.65rem] text-white/45">Foto: {image.credit}</p>}
          <button
            type="button"
            data-zoom={image.src}
            data-zoom-caption={image.alt}
            aria-label="Ver a foto inteira"
            title="Ver a foto inteira"
            className="grid size-9 cursor-zoom-in place-items-center rounded-full bg-white/10 text-white/75 transition-colors hover:bg-white/20 hover:text-white"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      )}
    </section>
  );
}
