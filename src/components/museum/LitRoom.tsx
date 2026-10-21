"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { stamp } from "./visits";

/**
 * Sala do museu: as luzes acendem quando o visitante entra (data-lit) e o ingresso ganha o carimbo dela.
 * Os filhos reagem com `group-data-[lit=true]/room:`.
 */
export function LitRoom({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setLit(true);
        stamp(id);
        io.disconnect();
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return (
    <section ref={ref} id={id} data-lit={lit} className={className}>
      {children}
    </section>
  );
}
