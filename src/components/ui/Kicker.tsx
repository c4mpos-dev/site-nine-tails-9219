"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Rótulo acima dos títulos com um traço na cor da raposa que se desenha quando a seção aparece.
 * O traço é revelado por clip-path (e não scaleX), para o observador de tela enxergar o elemento.
 */
export function Kicker({ children, className, line = "bg-accent", center }: { children: React.ReactNode; className?: string; line?: string; center?: boolean }) {
  return (
    <p className={cn("kicker flex items-center gap-3", center && "justify-center", className)}>
      <motion.span
        aria-hidden
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn("h-0.5 w-8 shrink-0 rounded-full", line)}
      />
      {children}
    </p>
  );
}
