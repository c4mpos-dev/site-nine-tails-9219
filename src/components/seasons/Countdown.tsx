"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Kickoff da temporada BIOCORE: 9 jan 2027, 12h (horário de Nova York) = 17h UTC. */
export const KICKOFF_2027 = Date.UTC(2027, 0, 9, 17, 0, 0);

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Contagem regressiva para o kickoff. Só calcula no navegador (o servidor não sabe "agora"). */
export function Countdown({ target = KICKOFF_2027, className }: { target?: number; className?: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  if (left !== null && left <= 0) {
    return <p className={cn("heading text-3xl text-accent", className)}>O jogo foi revelado!</p>;
  }

  const p = left === null ? null : parts(left);
  const cells = [
    { v: p?.d, k: "dias" },
    { v: p?.h, k: "horas" },
    { v: p?.m, k: "min" },
    { v: p?.s, k: "seg" },
  ];

  return (
    <div className={cn("flex gap-2", className)} role="timer" aria-label="Tempo até o kickoff da temporada BIOCORE">
      {cells.map((c) => (
        <div key={c.k} className="min-w-16 rounded-md border border-line bg-surface-2 px-3 py-2 text-center">
          <p className="heading text-3xl tabular-nums">{c.v === undefined ? "--" : String(c.v).padStart(2, "0")}</p>
          <p className="text-[0.65rem] uppercase tracking-wider text-muted">{c.k}</p>
        </div>
      ))}
    </div>
  );
}
