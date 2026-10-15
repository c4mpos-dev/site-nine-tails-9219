"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Da oficina à arena: arraste a divisória para comparar o robô em construção e o robô em campo.
 * Usa um <input type="range"> por baixo, então funciona com teclado e leitores de tela.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Na oficina",
  afterLabel = "Na arena",
  beforePosition,
  afterPosition,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforePosition?: string;
  afterPosition?: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <figure>
      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-lg bg-surface-2">
        <Image src={after} alt={afterLabel} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: afterPosition }} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={beforeLabel} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: beforePosition }} />
        </div>

        <span className="absolute left-3 top-3 rounded bg-black/65 px-2 py-1 text-xs font-bold text-white">{beforeLabel}</span>
        <span className="absolute right-3 top-3 rounded bg-black/65 px-2 py-1 text-xs font-bold text-white">{afterLabel}</span>

        {/* Divisória */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand text-sm font-bold text-white">
            ⇆
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Comparar: ${beforeLabel} e ${afterLabel}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 text-sm text-muted">Arraste para comparar {beforeLabel.toLowerCase()} e {afterLabel.toLowerCase()}.</figcaption>
    </figure>
  );
}
