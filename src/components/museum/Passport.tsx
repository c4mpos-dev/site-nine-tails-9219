"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { RotateCw } from "lucide-react";
import { Flip } from "@/components/ui/Flip";
import { Stamp } from "./Stamp";
import { useVisited } from "./visits";
import { cn } from "@/lib/cn";

type Stop = { id: string; number: string; title: string; year: string };

const card = "h-full rounded-md p-5 shadow-[0_20px_30px_-10px_rgb(0_0_0/0.5)] sm:p-6";

/**
 * O ingresso na saída, com um carimbo por sala percorrida. Com todas as salas carimbadas,
 * ele vira sozinho (uma vez) e mostra no outro lado o certificado de visita.
 */
export function Passport({ stops }: { stops: Stop[] }) {
  const visited = useVisited();
  const done = stops.filter((s) => visited.includes(s.id)).length;
  const all = done === stops.length;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const [flipped, setFlipped] = useState(false);

  // Recompensa: ao chegar aqui com a visita completa, o ingresso vira para o certificado
  useEffect(() => {
    if (!all || !inView) return;
    const t = setTimeout(() => setFlipped(true), 500);
    return () => clearTimeout(t);
  }, [all, inView]);

  const stamps = (
    <div className={cn(card, "bg-[#f6efe2] text-[#1b0d26]")}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7d1394]">Seu ingresso · carimbos</p>
        <p className="font-mono text-xs font-bold">
          {done}/{stops.length} salas
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {stops.map((s, i) => {
          const on = visited.includes(s.id);
          return (
            <li key={s.id} className="grid place-items-center" title={s.title}>
              {on ? (
                <Stamp
                  number={s.number}
                  label={s.title}
                  year={s.year}
                  className={cn("size-20 !mix-blend-multiply", i % 2 ? "rotate-[9deg] text-[#9e19b8]/80" : "-rotate-[11deg] text-[#b5139f]/75")}
                />
              ) : (
                <span className="grid size-20 place-items-center rounded-full border-2 border-dashed border-[#1b0d26]/20 font-mono text-sm text-[#1b0d26]/30">
                  {s.number}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="font-hand mt-4 text-center text-2xl leading-tight">
        {all ? "visita completa. obrigado por passar aqui!" : done ? "faltam algumas salas…" : "percorra as salas para carimbar"}
      </p>
    </div>
  );

  const certificate = (
    <div className={cn(card, "relative grid place-items-center overflow-hidden bg-[#2a0f3a] text-center text-[#f6efe2]")}>
      <div aria-hidden className="absolute inset-2 rounded border border-[#f0a6e8]/30" />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0a6e8]">Certificado de visita</p>
        <p className="heading mt-3 text-3xl leading-none sm:text-4xl">Visitante oficial</p>
        <p className="heading text-3xl leading-none text-[#f0a6e8] sm:text-4xl">do Museu da Raposa</p>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/75">
          Percorreu as {stops.length} salas, de {stops[0]?.year} a {stops.at(-1)?.year}, e viu a história da Nine Tails #9219 de perto.
        </p>
        <span
          aria-hidden
          className="mx-auto mt-4 grid size-24 -rotate-12 place-items-center rounded-full border-[3px] border-[#f0a6e8]/80 font-mono uppercase leading-tight text-[#f0a6e8]/90"
        >
          <span className="grid size-[86%] place-content-center rounded-full border border-dashed border-current">
            <span className="text-[8px] tracking-[0.2em]">Visita</span>
            <span className="heading text-lg">Completa</span>
            <span className="text-[8px] tracking-[0.2em]">FRC 9219</span>
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      <Flip flipped={flipped && all} front={stamps} back={certificate} />
      {all && (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mx-auto mt-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent"
        >
          <RotateCw className="size-3.5" /> {flipped ? "Ver os carimbos" : "Ver o certificado"}
        </button>
      )}
    </div>
  );
}
