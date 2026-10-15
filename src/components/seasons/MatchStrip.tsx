"use client";

import { useState } from "react";
import type { Match } from "@/content/matches";
import { VideoDialog, type MatchVideo } from "@/components/seasons/VideoDialog";
import { cn } from "@/lib/cn";

const resultWord = { W: "Vitória", L: "Derrota", T: "Empate" } as const;

/**
 * Fita de partidas de um evento: uma barra por partida, altura = nossos pontos.
 * Vitória = barra cheia na cor da equipe; derrota = barra vazada. Passe o mouse (ou o foco)
 * para ver o placar; quando o TBA tem o vídeo, clicar na barra abre a partida.
 */
export function MatchStrip({
  title,
  matches,
  max,
  names = {},
}: {
  title: string;
  matches: Match[];
  max: number;
  /** Apelidos das equipes, para o tooltip. */
  names?: Record<number, string>;
}) {
  const [video, setVideo] = useState<MatchVideo | null>(null);
  const count = (r: Match[7]) => matches.filter((m) => m[7] === r).length;
  const [w, l, t] = [count("W"), count("L"), count("T")];
  const team = (n: number) => (names[n] ? `${n} ${names[n]}` : String(n));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-muted tabular-nums">
          {w}V · {l}D{t ? ` · ${t}E` : ""}
        </p>
      </div>
      <ol className="mt-3 flex h-28 items-end gap-[3px] border-b border-line pb-px" aria-label={`Partidas em ${title}`}>
        {matches.map((m) => {
          const [, label, , allies, opponents, ours, theirs, res, vid] = m;
          const h = Math.max(6, (ours / max) * 100);
          const playoff = label.startsWith("P") || label.startsWith("F");
          const name = `${title} · ${label}: ${ours} x ${theirs}`;
          return (
            <li key={label} className="group relative flex h-full min-w-[10px] flex-1 items-end">
              <button
                type="button"
                onClick={() => vid && setVideo({ id: vid, title: name })}
                className={cn(
                  "w-full rounded-t-[3px] outline-offset-2 transition-opacity",
                  res === "W" ? "bg-win" : "border-2 border-b-0 border-loss bg-transparent",
                  res === "T" && "border-dashed",
                  vid ? "cursor-pointer hover:opacity-80" : "cursor-default",
                )}
                style={{ height: `${h}%` }}
                aria-label={`${label}: ${resultWord[res].toLowerCase()} por ${ours} a ${theirs}${vid ? ". Assistir ao vídeo" : ""}`}
              />
              {playoff && <span aria-hidden className="absolute -bottom-3 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
              {/* Tooltip */}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max max-w-[240px] -translate-x-1/2 rounded-md border border-line bg-surface-2 px-3 py-2 text-left text-xs shadow-lg group-focus-within:block group-hover:block"
              >
                <span className="block font-bold text-fg">
                  {label} · {resultWord[res]}
                </span>
                <span className="block text-base font-bold tabular-nums text-fg">
                  {ours} x {theirs}
                </span>
                <span className="block text-muted">Com {allies.map(team).join(" e ")}</span>
                <span className="block text-muted">Contra {opponents.map(team).join(", ")}</span>
                {vid && <span className="mt-1 block font-bold text-accent">▶ Clique para assistir</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <VideoDialog video={video} onClose={() => setVideo(null)} />
    </div>
  );
}

export function MatchLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-2.5 rounded-t-[2px] bg-win" /> Vitória
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-2.5 rounded-t-[2px] border-2 border-b-0 border-loss" /> Derrota
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-1 rounded-full bg-accent" /> Playoffs
      </span>
      <span>Altura da barra = pontos da nossa aliança. Passe o mouse para ver o placar; clique para ver o vídeo.</span>
    </p>
  );
}
