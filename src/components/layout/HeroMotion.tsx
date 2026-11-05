"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Foto do topo com profundidade: abre com um zoom lento e, ao rolar, desce mais devagar que o texto.
 * A moldura sobra um pouco para cima, então o deslocamento nunca mostra borda.
 */
export function HeroBackdrop({ src, alt, position }: { src: string; alt: string; position?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "7%"]);

  return (
    <div ref={ref} className="absolute inset-0 -z-20 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] bottom-0">
        <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease }} className="absolute inset-0">
          <Image
            quality={90}
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
            style={{ objectPosition: position ?? "center" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Título do topo subindo palavra por palavra, cada uma saindo de trás de uma máscara. */
export function HeroTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  if (typeof children !== "string") {
    return (
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className={className}>
        {children}
      </motion.h1>
    );
  }
  const words = children.split(" ");
  return (
    <h1 className={className}>
      <span className="sr-only">{children}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.1 + i * 0.07, ease }} className="inline-block">
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h1>
  );
}

/** O que vem depois do título (texto, números) entra logo atrás dele. */
export function HeroFade({ children, delay = 0.35 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
}
