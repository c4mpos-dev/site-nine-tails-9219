"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

const spring = { stiffness: 180, damping: 18, mass: 0.6 };

/**
 * Inclina o conteúdo em 3D seguindo o mouse, como uma carta na mão.
 * Expõe a posição do ponteiro em --mx e --my (de -1 a 1) para os filhos fazerem paralaxe,
 * e com `glare` passa um reflexo de luz por cima. No toque e com "reduzir movimento", fica parado.
 */
export function Tilt({ max = 10, glare, className, children }: { max?: number; glare?: boolean; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotateY = useTransform(sx, (v) => v * max);
  const rotateX = useTransform(sy, (v) => -v * max);
  const shine = useSpring(0, spring);
  const gx = useTransform(sx, (v) => `${50 + v * 50}%`);
  const gy = useTransform(sy, (v) => `${50 + v * 50}%`);
  const light = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.35), transparent 55%)`;

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 2 - 1);
    y.set(((e.clientY - r.top) / r.height) * 2 - 1);
    shine.set(1);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
    shine.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, "--mx": sx, "--my": sy } as React.ComponentProps<typeof motion.div>["style"]}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          style={{ background: light, opacity: shine }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
        />
      )}
    </motion.div>
  );
}
