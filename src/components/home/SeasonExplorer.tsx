"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Season } from "@/content/seasons";
import { cn } from "@/lib/cn";
import { Countdown } from "@/components/seasons/Countdown";

export type ExplorerPhoto = { src: string; caption: string; credit?: string; position?: string };

export type ExplorerSeason = Season & {
  cover?: ExplorerPhoto;
  thumbs: ExplorerPhoto[];
  logo?: string;
  robotNames: string[];
};

/** Abas por ano: cada temporada com a foto real do jogo, o logo oficial e o que a equipe fez. */
export function SeasonExplorer({ seasons, initial }: { seasons: ExplorerSeason[]; initial: number }) {
  const [active, setActive] = useState(initial);
  const s = seasons[active];
  const awards = s.events.flatMap((e) => e.awards ?? []).filter((a) => !a.startsWith("Wildcard"));
  const wins = s.events.reduce((acc, e) => acc + (Number(e.record?.split("-")[0]) || 0), 0);

  return (
    <div>
      <div role="tablist" aria-label="Temporadas" className="flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
        {seasons.map((season, i) => (
          <button
            key={season.slug}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "relative shrink-0 px-4 pb-3 pt-1 text-left transition-colors",
              i === active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <span className="heading block text-2xl">{season.year}</span>
            <span className="block text-xs font-bold uppercase tracking-wider">{season.game}</span>
            {i === active && (
              <motion.span layoutId="season-tab" className="absolute inset-x-0 -bottom-px h-[3px] bg-accent" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={s.slug}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start"
        >
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
              {s.cover ? (
                <Image src={s.cover.src} alt={s.cover.caption} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: s.cover.position }} />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center text-muted">
                  <div>
                    <p className="heading text-4xl text-fg">{s.game}</p>
                    <p className="mt-2 text-sm">O jogo será revelado no kickoff de 09/01/2027. Faltam:</p>
                    <Countdown className="mt-4 justify-center" />
                  </div>
                </div>
              )}
              {s.logo && (
                <div className="absolute left-4 top-4 rounded-md bg-white/95 p-2 shadow">
                  <Image src={s.logo} alt={`Logo ${s.game}`} width={120} height={60} className="h-10 w-auto" />
                </div>
              )}
            </div>
            {s.cover && (
              <figcaption className="mt-2 text-xs text-muted">
                {s.cover.caption}
                {s.cover.credit && ` Foto: ${s.cover.credit}.`}
              </figcaption>
            )}
            {s.thumbs.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {s.thumbs.slice(0, 3).map((t) => (
                  <div key={t.src} className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-2">
                    <Image src={t.src} alt={t.caption} fill sizes="200px" className="object-cover" style={{ objectPosition: t.position }} />
                  </div>
                ))}
              </div>
            )}
          </figure>

          <div>
            <p className="kicker">
              {s.year} · {s.firstTheme}
            </p>
            <h3 className="heading mt-3 text-3xl sm:text-4xl">{s.headline}</h3>
            <p className="mt-4 leading-relaxed text-muted">{s.summary}</p>

            {s.status === "completed" && (
              <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-center">
                <div>
                  <dt className="text-xs text-muted">Eventos</dt>
                  <dd className="heading text-3xl">{s.events.length}</dd>
                </div>
                <div className="border-x border-line">
                  <dt className="text-xs text-muted">Vitórias</dt>
                  <dd className="heading text-3xl">{wins}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Robôs</dt>
                  <dd className="heading text-3xl">{s.robotNames.length || "—"}</dd>
                </div>
              </dl>
            )}

            {awards.length > 0 && (
              <ul className="mt-5 space-y-1.5">
                {awards.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm font-bold">
                    <span className="size-2 rotate-45 bg-accent" /> {a}
                  </li>
                ))}
              </ul>
            )}
            {s.robotNames.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                {s.robotNames.length > 1 ? "Robôs" : "Robô"}: <strong className="text-fg">{s.robotNames.join(" e ")}</strong>
              </p>
            )}
            <Link href={`/temporadas/${s.slug}`} className="text-link mt-6 inline-block">
              {s.status === "upcoming" ? "O que já sabemos" : `Ler sobre ${s.game}`} →
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
