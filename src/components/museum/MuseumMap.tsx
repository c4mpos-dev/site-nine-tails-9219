"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Stop = { id: string; number: string; title: string };

/**
 * Planta do museu: no desktop, uma planta baixa fixa na lateral; no celular, uma barra de salas no rodapé.
 * Marca a sala que está na tela e leva direto para qualquer uma.
 */
export function MuseumMap({ stops }: { stops: Stop[] }) {
  const [active, setActive] = useState(stops[0]?.id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = stops.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    // Só aparece depois da entrada, para não cobrir o ingresso
    const first = document.getElementById(stops[1]?.id ?? "");
    const show = new IntersectionObserver(([e]) => setVisible(e.isIntersecting || e.boundingClientRect.top < 0), { rootMargin: "0px 0px -60% 0px" });
    if (first) show.observe(first);
    return () => {
      io.disconnect();
      show.disconnect();
    };
  }, [stops]);

  const current = stops.find((s) => s.id === active);

  return (
    <>
      {/* Desktop: planta baixa vertical */}
      <nav
        aria-label="Planta do museu"
        className={cn(
          "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 xl:block",
          visible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">Planta</p>
        <ol className="relative flex flex-col items-center gap-2 rounded-md border border-line bg-bg/90 p-2 backdrop-blur">
          {stops.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id} className="group relative">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "grid size-9 place-items-center border font-mono text-[11px] font-bold transition-colors",
                    on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted hover:border-accent hover:text-fg",
                  )}
                >
                  {s.number}
                </a>
                <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-fg px-2 py-1 text-xs font-bold text-bg opacity-0 transition-opacity group-hover:opacity-100">
                  {s.title}
                </span>
              </li>
            );
          })}
        </ol>
        {current && <p className="mt-2 w-14 text-center text-[10px] leading-tight text-muted">Você está aqui</p>}
      </nav>

      {/* Celular e tablet: barra de salas */}
      <nav
        aria-label="Salas do museu"
        className={cn(
          "fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-300 xl:hidden",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ol className="flex gap-1 overflow-x-auto rounded-full border border-line bg-bg/95 p-1 shadow-lg backdrop-blur [scrollbar-width:none]">
          {stops.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                    on ? "bg-brand text-brand-ink" : "text-muted hover:text-fg",
                  )}
                >
                  <span className="font-mono">{s.number}</span>
                  {on && <span>{s.title}</span>}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
