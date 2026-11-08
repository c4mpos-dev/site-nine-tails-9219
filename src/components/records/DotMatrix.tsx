"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

/** Algarismos em 5×7, como no letreiro de LED do telão da arena. */
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};
const COLS = 5, ROWS = 7, GAP = 1;

/**
 * Número em matriz de pontos. Quando aparece na tela, os LEDs acendem numa varredura da esquerda
 * para a direita, como o placar ligando. Os apagados ficam visíveis, bem fracos, como no painel de verdade.
 */
export function DotMatrix({ value, delay = 0, className }: { value: number; delay?: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const on = inView || reduce;

  const digits = String(value).split("");
  const width = digits.length * (COLS + GAP) - GAP;
  const dots: { x: number; y: number; lit: boolean }[] = [];
  digits.forEach((d, i) => {
    GLYPHS[d]?.forEach((row, y) => [...row].forEach((bit, x) => dots.push({ x: i * (COLS + GAP) + x, y, lit: bit === "1" })));
  });

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{value}</span>
      <svg ref={ref} aria-hidden viewBox={`0 0 ${width} ${ROWS}`} className="h-full w-auto overflow-visible">
        {dots.map((d) => (
          <circle
            key={`${d.x}-${d.y}`}
            cx={d.x + 0.5}
            cy={d.y + 0.5}
            r={0.36}
            fill="currentColor"
            style={{
              opacity: d.lit && on ? 1 : 0.13,
              transition: reduce ? undefined : `opacity 0.12s ${delay + d.x * 0.045 + d.y * 0.012}s`,
            }}
          />
        ))}
      </svg>
    </span>
  );
}
