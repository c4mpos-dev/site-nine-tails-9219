"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

/**
 * Texto de painel de aeroporto: as letras giram até parar no valor certo
 * quando a linha aparece na tela. O texto final já vem no HTML (acessível e sem JS).
 */
export function FlapText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    const target = text.toUpperCase();
    let frame = 0;
    const total = 14 + target.length;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        setShown(
          target
            .split("")
            .map((ch, i) => (frame > 8 + i || ch === " " ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join(""),
        );
        if (frame >= total) clearInterval(timer);
      }, 45);
    }, delay);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [inView, reduce, text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
