import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Topo das páginas internas: foto real ao fundo, escurecida com o roxo da equipe.
 * Sem foto, vira uma faixa lisa.
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
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="-z-20 object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
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
        {kicker && <p className="kicker !text-[#f0a6e8]">{kicker}</p>}
        <h1 className="heading mt-3 max-w-4xl text-5xl sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lead}</p>}
        {children}
      </Container>
      {image?.credit && <p className="absolute bottom-2 right-4 text-[0.65rem] text-white/45">Foto: {image.credit}</p>}
    </section>
  );
}
