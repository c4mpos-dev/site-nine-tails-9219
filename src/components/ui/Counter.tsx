"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Número que conta até o valor final quando aparece na tela. */
export function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = fmt(value, decimals) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = fmt(v, decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix, reduce]);

  // Valor final já no HTML: o número aparece mesmo sem JS e é lido corretamente por crawlers.
  return (
    <span ref={ref} className="tabular-nums">
      {fmt(value, decimals) + suffix}
    </span>
  );
}
