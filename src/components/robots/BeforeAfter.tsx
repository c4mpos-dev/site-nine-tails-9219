"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

/**
 * Da oficina à arena: arraste a divisória para comparar o robô em construção e o robô em campo.
 * Usa um <input type="range"> por baixo, então funciona com teclado e leitores de tela.
 * As etiquetas dos cantos abrem cada foto ampliada.
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
        <Image quality={90} src={after} alt={afterLabel} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: afterPosition }} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image quality={90} src={before} alt={beforeLabel} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: beforePosition }} />
        </div>


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

        {[
          { label: beforeLabel, src: before, side: "left-3" },
          { label: afterLabel, src: after, side: "right-3" },
        ].map((t) => (
          <button
            key={t.src}
            type="button"
            data-zoom={t.src}
            data-zoom-caption={t.label}
            aria-label={`Ampliar foto: ${t.label}`}
            className={`absolute top-3 ${t.side} flex cursor-zoom-in items-center gap-1.5 rounded bg-black/65 px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-brand`}
          >
            {t.label} <Maximize2 className="size-3" />
          </button>
        ))}
      </div>
      <figcaption className="mt-2 text-sm text-muted">Arraste para comparar {beforeLabel.toLowerCase()} e {afterLabel.toLowerCase()}. Toque numa etiqueta para ampliar.</figcaption>
    </figure>
  );
}
