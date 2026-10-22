"use client";

import { motion } from "motion/react";
import { Tilt } from "@/components/ui/Tilt";

/**
 * Troféu com volume: balança em 3D quando aparece na tela (em cascata, pelo `delay`)
 * e depois acompanha o mouse, para ser olhado de lado como um troféu de verdade.
 */
export function TrophyTurn({
  delay = 0,
  className,
  innerClassName,
  children,
}: {
  delay?: number;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Tilt max={24} className={className}>
      <motion.div
        className={innerClassName}
        initial={{ rotateY: 0 }}
        whileInView={{ rotateY: [0, -28, 20, -9, 3, 0] }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, delay, ease: "easeInOut" }}
        style={{ transformPerspective: 700 }}
      >
        {children}
      </motion.div>
    </Tilt>
  );
}
