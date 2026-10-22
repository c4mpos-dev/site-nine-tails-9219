"use client";

import { motion } from "motion/react";

/**
 * Cartão de duas faces que vira em 3D. As duas faces ocupam a mesma célula do grid,
 * então a altura é a da maior. Sombra vai dentro das faces: `filter` aqui achataria o 3D.
 * A face de trás fica `inert`, para não receber clique nem foco por baixo da da frente.
 */
export function Flip({ flipped, front, back, className }: { flipped: boolean; front: React.ReactNode; back: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ perspective: 1400 }}>
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 13 }}
      >
        <div className="[grid-area:1/1] [backface-visibility:hidden]" inert={flipped}>
          {front}
        </div>
        <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)]" inert={!flipped}>
          {back}
        </div>
      </motion.div>
    </div>
  );
}
