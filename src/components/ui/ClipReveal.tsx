"use client";

import { motion } from "motion/react";

/** Foto revelada como uma cortina subindo quando entra na tela (uma vez). */
export function ClipReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
