"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Match } from "@/content/matches";
import { VideoDialog, type MatchVideo } from "@/components/seasons/VideoDialog";
import { cn } from "@/lib/cn";

const resultWord = { W: "Vitória", L: "Derrota", T: "Empate" } as const;

type Group = { key: string; name: string; matches: Match[] };

/**
 * Todas as partidas oficiais em ordem, um quadrado por partida, agrupadas por evento.
 * Vitória = quadrado cheio; derrota = vazado; empate = tracejado. A maior sequência de vitórias ganha um anel.
 * Passe o mouse (ou o foco) para ver o placar; clicar abre o vídeo quando o TBA tem.
 */
export function MatchTrail({ groups, streak: run }: { groups: Group[]; streak: string[] }) {
  const [video, setVideo] = useState<MatchVideo | null>(null);
  const streak = new Set(run);
  let n = 0;

  return (
    <div>
      <ol className="flex flex-wrap gap-x-6 gap-y-6">
        {groups.map((g) => {
          const count = (r: string) => g.matches.filter((m) => m[7] === r).length;
          return (
            <li key={g.key}>
              <ol className="flex max-w-[16.5rem] flex-wrap gap-1" aria-label={`Partidas em ${g.name}`}>
                {g.matches.map((m) => {
                  const [, label, , , , ours, theirs, res, vid] = m;
                  const id = `${g.key}-${label}`;
                  const name = `${g.name} · ${label}: ${ours} x ${theirs}`;
                  const delay = Math.min(n++ * 0.012, 1.4);
                  return (
                    <li key={label} className="group relative">
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay }}
                        onClick={() => vid && setVideo({ id: vid, title: name })}
                        aria-label={`${g.name}, ${label}: ${resultWord[res].toLowerCase()} por ${ours} a ${theirs}${vid ? ". Assistir ao vídeo" : ""}`}
                        className={cn(
                          "block size-3.5 rounded-[3px] outline-offset-2 transition-transform hover:scale-125",
                          res === "W" ? "bg-win" : "border-2 border-loss",
                          res === "T" && "border-dashed",
                          streak.has(id) && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
                          vid ? "cursor-pointer" : "cursor-default",
                        )}
                      />
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max -translate-x-1/2 rounded-md border border-line bg-surface-2 px-3 py-2 text-left text-xs shadow-lg group-focus-within:block group-hover:block"
                      >
                        <span className="block text-muted">{g.name}</span>
                        <span className="block font-bold text-fg">
                          {label} · {resultWord[res]}
                        </span>
                        <span className="block text-base font-bold tabular-nums text-fg">
                          {ours} x {theirs}
                        </span>
                        {vid && <span className="mt-1 block font-bold text-accent">▶ Clique para assistir</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-2 text-xs">
                <span className="font-bold">{g.name}</span> <span className="tabular-nums text-muted" title="Vitórias, derrotas e empates">
                  {count("W")}-{count("L")}-{count("T")}
                </span>
              </p>
            </li>
          );
        })}
      </ol>
      <VideoDialog video={video} onClose={() => setVideo(null)} />
    </div>
  );
}

export function TrailLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[3px] bg-win" /> Vitória
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[3px] border-2 border-loss" /> Derrota
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[3px] border-2 border-dashed border-loss" /> Empate
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[3px] bg-win ring-2 ring-accent ring-offset-1 ring-offset-bg" /> Maior sequência de vitórias
      </span>
    </p>
  );
}
