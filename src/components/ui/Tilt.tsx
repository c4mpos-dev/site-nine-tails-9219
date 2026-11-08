"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

const spring = { stiffness: 180, damping: 18, mass: 0.6 };

/** Película holográfica: faixas nas cores da equipe e um risco fino de foil por cima. */
const FOIL: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(115deg, rgb(255 255 255 / 0) 0 6px, rgb(255 255 255 / 0.07) 6px 7px), " +
    "linear-gradient(115deg, transparent 18%, #9e19b8 30%, #e8c6f0 40%, #ffffff 46%, #b558c7 54%, #6a117b 64%, transparent 78%)",
  backgroundSize: "100% 100%, 260% 260%",
  mixBlendMode: "color-dodge",
};

/**
 * Inclina o conteúdo em 3D seguindo o mouse, como uma carta na mão.
 * Expõe a posição do ponteiro em --mx e --my (de -1 a 1) para os filhos fazerem paralaxe,
 * e com `glare` passa um reflexo de luz por cima. No toque e com "reduzir movimento", fica parado.
 * Com `holo`, vira carta holográfica: faixas de roxo e lilás correm pela foto conforme ela inclina
 * (no toque, o brilho passa sozinho de tempos em tempos).
 */
export function Tilt({
  max = 10,
  glare,
  holo,
  className,
  children,
}: {
  max?: number;
  glare?: boolean;
  holo?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
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
  // o arco-íris da carta anda no sentido contrário ao da luz, como a película holográfica
  const hx = useTransform(sx, (v) => `${50 - v * 45}%`);
  const hy = useTransform(sy, (v) => `${50 - v * 45}%`);
  const foil = useMotionTemplate`${hx} ${hy}`;

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
      {holo && (
        <>
          <motion.span aria-hidden style={{ ...FOIL, backgroundPosition: foil, opacity: shine }} className="pointer-events-none absolute inset-0 rounded-[inherit]" />
          <span
            aria-hidden
            style={FOIL}
            className="pointer-events-none absolute inset-0 hidden rounded-[inherit] opacity-35 animate-[holo-sweep_7s_ease-in-out_infinite] [@media(hover:none)]:block"
          />
        </>
      )}
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
