"use client";

import { Stamp } from "./Stamp";
import { useVisited } from "./visits";
import { cn } from "@/lib/cn";

type Stop = { id: string; number: string; title: string; year: string };

/** O ingresso na saída, com um carimbo por sala percorrida. */
export function Passport({ stops }: { stops: Stop[] }) {
  const visited = useVisited();
  const done = stops.filter((s) => visited.includes(s.id)).length;
  const all = done === stops.length;

  return (
    <div className="relative rounded-md bg-[#f6efe2] p-5 text-[#1b0d26] shadow-[0_20px_30px_-10px_rgb(0_0_0/0.5)] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7d1394]">Seu ingresso · verso</p>
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
}
