import Image from "next/image";
import type { Piece } from "@/content/museum";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

/** Pequena inclinação "aleatória" mas estável para polaroids e fotos com fita, a partir do número da peça. */
const tilt = (seed: number) => [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5][seed % 8];

/**
 * Foco de luz vindo do teto. Acende quando a sala acende (LitRoom), um pouco depois do outro,
 * como uma fileira de spots ligando.
 */
function Spot({ seed, wide }: { seed: number; wide?: boolean }) {
  return (
    <span
      aria-hidden
      style={{ transitionDelay: `${150 + (seed % 6) * 120}ms` }}
      className={cn(
        "pointer-events-none absolute -top-20 bottom-1/4 -z-10 opacity-0 transition-opacity duration-700 group-data-[lit=true]/room:opacity-100",
        "[mask-image:linear-gradient(to_bottom,transparent,black_35%)] bg-[radial-gradient(ellipse_50%_65%_at_50%_30%,rgb(255_196_120/0.22),rgb(255_196_120/0.06)_55%,transparent_75%)]",
        wide ? "inset-x-[10%]" : "-inset-x-10",
      )}
    />
  );
}

/** Luminária de quadro, de latão, presa acima da moldura. */
function PictureLight() {
  return (
    <span aria-hidden className="mx-auto mb-1 block w-2/5">
      <span className="mx-auto block h-2 w-1 bg-[#8a6a2c]" />
      <span className="block h-2 rounded-full bg-gradient-to-b from-[#e6c47a] to-[#8a6a2c] shadow-[0_6px_14px_rgb(255_222_160/0.35)]" />
    </span>
  );
}

/** Placa de museu: número da peça, título, nota e data. */
export function Placard({ no, title, note, when, className }: { no: string; title: string; note?: string; when?: string; className?: string }) {
  return (
    <div className={cn("relative mt-3 border border-line bg-surface-2 px-3 py-2 text-xs shadow-sm", className)}>
      <p className="font-mono text-[10px] tracking-wider text-muted">
        Nº {no}
        {when && ` · ${when}`}
      </p>
      <p className="mt-0.5 font-bold leading-snug text-fg">{title}</p>
      {note && <p className="mt-0.5 leading-snug text-muted">{note}</p>}
    </div>
  );
}

function Photo({ piece, sizes, className }: { piece: Piece; sizes: string; className?: string }) {
  return (
    <div
      {...zoom(piece.src, piece.note ? `${piece.title}. ${piece.note}` : piece.title)}
      className={cn("zoomable relative w-full overflow-hidden bg-surface-2", className)}
      style={{ aspectRatio: piece.r }}
    >
      <Image src={piece.src} alt={piece.title} fill sizes={sizes} className="object-cover" style={{ objectPosition: piece.position }} />
    </div>
  );
}

/** Uma peça do acervo, com a moldura do tipo dela. */
export function Exhibit({ piece, no, seed }: { piece: Piece; no: string; seed: number }) {
  const sizes = "(min-width:1024px) 26vw, (min-width:640px) 40vw, 90vw";

  if (piece.frame === "tela") {
    return (
      <figure className="relative isolate">
        <Spot seed={seed} wide />
        <div className="bg-[#0d0a10] p-1.5 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] sm:p-2">
          <Photo piece={{ ...piece, r: Math.max(piece.r, 1.6) }} sizes="(min-width:1024px) 70vw, 95vw" />
        </div>
        <Placard no={no} title={piece.title} note={piece.note} when={piece.when} className="ml-auto max-w-xs" />
      </figure>
    );
  }

  if (piece.frame === "polaroid") {
    return (
      <figure className="relative isolate px-2 pt-2" style={{ transform: `rotate(${tilt(seed)}deg)` }}>
        <Spot seed={seed} />
        {/* Tachinha */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-10 size-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f0a6e8,#9e19b8_60%,#5a0d6b)] shadow-[0_3px_4px_rgb(0_0_0/0.5)]"
        />
        <div className="bg-[#fdfcf8] p-2.5 pb-3 shadow-[0_12px_24px_-12px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-translate-y-1">
          <Photo piece={piece} sizes={sizes} />
          <p className="font-hand mt-2 text-center text-xl leading-tight text-[#2a2230]">{piece.title}</p>
          <p className="mt-0.5 text-right font-mono text-[10px] text-[#6b5f75]">
            Nº {no}
            {piece.when && ` · ${piece.when}`}
          </p>
        </div>
      </figure>
    );
  }

  if (piece.frame === "fita") {
    return (
      <figure className="relative isolate px-2 pt-3" style={{ transform: `rotate(${tilt(seed + 3) / 2}deg)` }}>
        <Spot seed={seed} />
        <div className="relative shadow-[0_10px_22px_-12px_rgb(0_0_0/0.55)]">
          <Photo piece={piece} sizes={sizes} />
          <span aria-hidden className="absolute -left-3 -top-2 h-5 w-14 -rotate-[24deg] bg-[#efe3b3]/80 shadow-sm" />
          <span aria-hidden className="absolute -right-3 -top-2 h-5 w-14 rotate-[22deg] bg-[#efe3b3]/80 shadow-sm" />
        </div>
        <Placard no={no} title={piece.title} note={piece.note} when={piece.when} />
      </figure>
    );
  }

  if (piece.frame === "vitrine") {
    return (
      <figure className="relative isolate pt-2">
        <Spot seed={seed} />
        {/* Redoma de vidro: tampa, vidro com reflexo e o objeto dentro */}
        <div className="mx-1 h-2 rounded-t-sm bg-gradient-to-b from-[#3a2a48] to-[#241532]" />
        <div className="relative border-x-2 border-[#241532]/70 bg-gradient-to-b from-[#ece6f1] to-[#d9d0e2] p-5 shadow-[inset_0_0_24px_rgb(255_255_255/0.7)]">
          <Photo piece={piece} sizes={sizes} className="rounded-sm shadow-[0_10px_20px_-8px_rgb(0_0_0/0.5)]" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgb(255_255_255/0.35)_42%,transparent_48%,transparent_70%,rgb(255_255_255/0.2)_76%,transparent_80%)]"
          />
        </div>
        {/* Pedestal */}
        <div className="h-3 bg-gradient-to-b from-[#3a2a48] to-[#241532]" />
        <div className="mx-4 h-12 bg-gradient-to-b from-[#241532] to-[#14071a] shadow-[0_16px_24px_-14px_rgb(0_0_0/0.7)]" />
        <Placard no={no} title={piece.title} note={piece.note} when={piece.when} />
      </figure>
    );
  }

  return (
    <figure className="relative isolate pt-2">
      <Spot seed={seed} />
      <PictureLight />
      {/* Moldura de madeira com passe-partout */}
      <div className="bg-gradient-to-br from-[#3b2a1f] to-[#1f150f] p-2 shadow-[0_14px_28px_-14px_rgb(0_0_0/0.7)]">
        <div className="bg-[#f6f1e7] p-3 shadow-[inset_0_1px_3px_rgb(0_0_0/0.25)] sm:p-4">
          <Photo piece={piece} sizes={sizes} />
        </div>
      </div>
      <Placard no={no} title={piece.title} note={piece.note} when={piece.when} />
    </figure>
  );
}
