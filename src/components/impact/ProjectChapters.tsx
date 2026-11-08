"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/impact";
import { cn } from "@/lib/cn";

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Uma palavra da descrição: acende quando o scroll passa pela parte dela no parágrafo. */
function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** Descrição que vai do apagado ao escuro, palavra por palavra, conforme a pessoa rola a página. */
function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");
  if (reduce) return <p ref={ref} className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}

const COLS = 6, ROWS = 4;
/** Ordem embaralhada (fixa) em que os blocos saem da frente da foto. */
const ORDER = Array.from({ length: COLS * ROWS }, (_, i) => (i * 7 + 3) % (COLS * ROWS));

/** Foto que aparece em blocos, como um tabuleiro abrindo, quando chega na tela. */
function BlockPhoto({ src, alt, position }: { src: string; alt: string; position?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative size-full">
      <Image src={src} alt={alt} fill quality={90} sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: position }} />
      {!reduce && (
        <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {ORDER.map((o, i) => (
            <motion.span
              key={i}
              className="bg-surface"
              initial={{ opacity: 1 }}
              animate={inView ? { opacity: 0 } : undefined}
              transition={{ duration: 0.25, delay: o * 0.035 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Os projetos de impacto, um capítulo para cada: número grande, nome, a descrição acendendo
 * palavra por palavra e o lugar da foto. Ao lado, um índice fixo marca em qual projeto a pessoa está.
 */
export function ProjectChapters({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // o capítulo ativo é o que está passando pelo meio da tela
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[13rem_1fr]">
      {/* Índice */}
      <nav aria-label="Projetos" className="hidden lg:block">
        <ol className="sticky top-28 space-y-1 border-l border-line">
          {projects.map((p, i) => (
            <li key={p.name}>
              <a
                href={`#projeto-${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "-ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  i === active ? "border-accent font-bold text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                <span className="font-mono text-xs leading-5 text-accent">{num(i)}</span>
                {p.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div>
        {projects.map((p, i) => (
          <article
            key={p.name}
            id={`projeto-${i + 1}`}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="grid scroll-mt-24 items-center gap-8 border-t border-line py-14 first:border-0 first:pt-0 md:grid-cols-2 md:gap-12"
          >
            <div className={cn(i % 2 === 1 && "md:order-2")}>
              <p className="flex items-baseline gap-3">
                <span className="heading text-6xl text-accent/25 sm:text-7xl">{num(i)}</span>
                <span className="kicker">{p.tag}</span>
              </p>
              <h3 className="heading mt-2 text-4xl sm:text-5xl">{p.name}</h3>
              <ScrollText text={p.description} className="mt-5 text-xl leading-relaxed text-fg sm:text-2xl" />
              {p.metric && <p className="heading mt-6 border-t-2 border-accent pt-3 text-3xl text-accent sm:text-4xl">{p.metric}</p>}
            </div>

            {/* Foto do projeto (quando ainda não tem, fica o lugar dela marcado) */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
              {p.photo ? (
                <BlockPhoto src={p.photo} alt={p.photoAlt ?? p.name} position={p.photoPosition} />
              ) : (
                <div className="grid size-full place-items-center rounded-lg border border-dashed border-accent/30">
                  <span aria-hidden className="heading text-[9rem] leading-none text-accent/10">{num(i)}</span>
                  <span className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Foto em breve</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
