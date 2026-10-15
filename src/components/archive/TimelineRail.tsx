"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/** Linha vertical que se preenche com a cor da equipe conforme a leitura avança. */
export function TimelineRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-line sm:left-[11px]" />
      <motion.span
        aria-hidden
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-accent sm:left-[11px]"
      />
      {children}
    </div>
  );
}
