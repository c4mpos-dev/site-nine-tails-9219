"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Flip } from "@/components/ui/Flip";

const paper = "relative flex h-full overflow-hidden rounded-md bg-[#f6efe2] shadow-[0_20px_30px_-10px_rgb(0_0_0/0.55)]";

/** Furos do picote, na cor do fundo da entrada. */
function Holes({ side }: { side: "left" | "right" }) {
  const x = side === "right" ? "right-14" : "left-14";
  return (
    <>
      <span aria-hidden className={`absolute -top-2 ${x} size-4 rounded-full bg-[#160b20]`} />
      <span aria-hidden className={`absolute -bottom-2 ${x} size-4 rounded-full bg-[#160b20]`} />
    </>
  );
}

/** Ingresso de papel, com picote e código de barras. Vira em 3D no clique para mostrar as regras da casa no verso. */
export function Ticket({ roomCount, pieceCount }: { roomCount: number; pieceCount: number }) {
  const [back, setBack] = useState(false);

  const front = (
    <div className="relative h-full">
      <div className={paper}>
        <div className="flex-1 border-r-2 border-dashed border-[#1b0d26]/25 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7d1394]">Ingresso · entrada franca</p>
          <p className="heading mt-2 text-3xl leading-none">Museu da Raposa</p>
          <p className="mt-1 text-xs">Acervo Nine Tails · FRC 9219</p>
          <dl className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase">
            <div>
              <dt className="text-[#1b0d26]/50">Salas</dt>
              <dd className="text-base font-bold">{roomCount}</dd>
            </div>
            <div>
              <dt className="text-[#1b0d26]/50">Peças</dt>
              <dd className="text-base font-bold">{pieceCount}</dd>
            </div>
            <div>
              <dt className="text-[#1b0d26]/50">Desde</dt>
              <dd className="text-base font-bold">2022</dd>
            </div>
          </dl>
          {/* Código de barras */}
          <div
            aria-hidden
            className="mt-4 h-8 bg-[repeating-linear-gradient(90deg,#1b0d26_0_2px,transparent_2px_4px,#1b0d26_4px_5px,transparent_5px_8px,#1b0d26_8px_11px,transparent_11px_13px)]"
          />
          <p className="mt-1 font-mono text-[10px] tracking-[0.3em]">0 9219 2022 0001</p>
        </div>
        <div className="flex w-16 flex-col items-center justify-center gap-2 bg-[#9e19b8] text-white">
          <p className="heading rotate-90 whitespace-nowrap text-lg tracking-wider">Nº 9219</p>
        </div>
      </div>
      <Holes side="right" />
    </div>
  );

  // No verso o canhoto fica do outro lado, como num papel de verdade
  const verso = (
    <div className="relative h-full">
      <div className={paper}>
        <div className="flex w-16 items-center justify-center bg-[#1b0d26] text-white/80">
          <p className="rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em]">Guarde este ingresso</p>
        </div>
        <div className="flex-1 border-l-2 border-dashed border-[#1b0d26]/25 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7d1394]">Verso · regras da casa</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm leading-snug">
            <li>É permitido tocar nas fotos: elas ampliam.</li>
            <li>Cada sala percorrida ganha um carimbo.</li>
            <li>Na saída, confira os carimbos e pegue o certificado.</li>
            <li>Viu alguém conhecido? Mande a foto para o acervo.</li>
          </ol>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1b0d26]/50">Válido para sempre</p>
        </div>
      </div>
      <Holes side="left" />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-sm rotate-[-3deg] text-left text-[#1b0d26]">
      <button
        type="button"
        onClick={() => setBack((b) => !b)}
        aria-label={back ? "Virar o ingresso para a frente" : "Virar o ingresso para ver o verso"}
        className="block w-full cursor-pointer rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0a6e8]"
      >
        <Flip flipped={back} front={front} back={verso} />
      </button>
      <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        <RotateCw className="size-3" /> Toque para virar
      </p>
    </div>
  );
}
