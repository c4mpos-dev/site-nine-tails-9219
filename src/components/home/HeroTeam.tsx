"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { HeroPhoto } from "@/content/gallery";
import { cn } from "@/lib/cn";

const INTERVAL = 7000;

/**
 * Topo da home: a equipe inteira de cada temporada. A troca é uma faixa roxa que atravessa a tela
 * revelando a foto nova; o ano da temporada aparece gigante e vazado no canto, como o número dos robôs.
 * Pausa com o mouse em cima (ou foco) e, com "reduzir movimento", troca sem animação e não troca sozinha.
 */
export function HeroTeam({ photos, children }: { photos: HeroPhoto[]; children: React.ReactNode }) {
  const [index, setIndex] = useState(photos.length - 1);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const auto = !paused && !reduce && photos.length > 1;

  const go = (i: number) => {
    if (i === index) return;
    setPrev(index);
    setIndex(i);
  };

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % photos.length);
    }, INTERVAL);
    return () => clearTimeout(id);
  }, [auto, index, photos.length]);

  const current = photos[index];
  const animate = prev !== null && !reduce;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#160b20] text-white"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Camada de baixo: todas as fotos montadas (já carregadas); aparece só a anterior */}
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority={i === photos.length - 1 ? "high" : "low"}
          className={cn("-z-30 object-cover", i === (prev ?? index) ? "opacity-100" : "opacity-0")}
          style={{ objectPosition: p.position ?? "center" }}
        />
      ))}
      {/* Camada de cima: a foto atual, revelada pela faixa roxa e com um zoom lento */}
      <div
        key={`now-${index}`}
        className={cn("absolute inset-0 -z-20 overflow-hidden", animate && "animate-[hero-wipe_1.1s_cubic-bezier(.7,0,.2,1)_both]")}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="100vw"
          loading="eager"
          className={cn("object-cover", !reduce && "animate-[hero-kenburns_9s_ease-out_both]")}
          style={{ objectPosition: current.position ?? "center" }}
        />
      </div>

      {/* A faixa roxa que passa na troca */}
      {animate && (
        <div
          key={`band-${index}`}
          aria-hidden
          className="pointer-events-none absolute inset-y-[-10%] -z-10 w-[14%] -skew-x-12 animate-[hero-band_1.1s_cubic-bezier(.7,0,.2,1)_both] bg-gradient-to-r from-brand via-accent to-brand opacity-90"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#160b20]/95 via-[#160b20]/65 to-[#160b20]/15" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#160b20]/90 to-transparent" />

      {/* Ano gigante e vazado */}
      <div aria-hidden className="pointer-events-none absolute bottom-24 right-0 -z-10 overflow-hidden pr-4 sm:right-4 lg:bottom-[5.5rem]">
        <span
          key={`year-${index}`}
          className={cn(
            "heading block text-[28vw] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgb(240_166_232/0.5)] sm:text-[20vw] lg:text-[13rem]",
            !reduce && "animate-[hero-year_0.9s_cubic-bezier(.2,.8,.2,1)_0.35s_both]",
          )}
        >
          {current.year}
        </span>
      </div>

      {children}

      {/* Rodapé do topo: legenda e as temporadas */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-8 gap-y-4 px-4 pb-6 sm:px-6">
          <p className="max-w-sm text-sm text-white/75" aria-live="polite">
            <span className="font-bold text-white">
              Equipe {current.year} · {current.game}.
            </span>{" "}
            {current.caption}
          </p>
          <div className="flex gap-1" role="group" aria-label="Foto da equipe por temporada">
            {photos.map((p, i) => {
              const active = i === index;
              return (
                <button
                  key={p.year}
                  type="button"
                  onClick={() => go(i)}
                  aria-pressed={active}
                  aria-label={`Equipe ${p.year}, ${p.game}`}
                  className={cn(
                    "group relative w-24 overflow-hidden rounded-md px-3 pb-2.5 pt-2 text-left transition-colors sm:w-28",
                    active ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <span className={cn("heading block text-lg leading-none", active ? "text-white" : "text-white/55 group-hover:text-white")}>
                    {p.year}
                  </span>
                  <span className={cn("mt-1 block truncate text-[11px]", active ? "text-[#f0a6e8]" : "text-white/40")}>{p.game}</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
                    <span
                      key={`${index}-${auto}`}
                      className={cn(
                        "block h-full bg-[#f0a6e8]",
                        active ? (auto ? "animate-[hero-progress_7s_linear_forwards]" : "w-full") : "w-0",
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
