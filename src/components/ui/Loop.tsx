"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Trecho curto de vídeo em loop, sem som, que funciona como um GIF leve.
 * Só toca quando está na tela, respeita "reduzir movimento" (começa parado)
 * e tem botão de pausa.
 */
export function Loop({
  src,
  poster,
  label,
  className,
  aspect = "aspect-video",
  position,
}: {
  /** Caminho do .mp4 (o pôster .webp tem o mesmo nome, se `poster` não vier). */
  src: string;
  poster?: string;
  /** Descrição do que acontece no vídeo, para leitores de tela. */
  label: string;
  className?: string;
  aspect?: string;
  /** object-position do vídeo, ex.: "50% 30%". */
  position?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Quem pediu menos movimento começa com o vídeo parado; o botão manda depois disso.
  const reduce = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? !!reduce;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pausar no meio de um play() rejeita a promessa com AbortError; só o bloqueio do navegador conta.
    if (inView && !paused) el.play().catch((e: DOMException) => e.name === "NotAllowedError" && setChoice(true));
    else el.pause();
  }, [inView, paused]);

  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-surface-2", aspect, className)}>
      <video
        ref={ref}
        src={src}
        poster={poster ?? src.replace(/\.mp4$/, ".webp")}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 size-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      <button
        type="button"
        onClick={() => setChoice(!paused)}
        aria-label={paused ? "Tocar vídeo" : "Pausar vídeo"}
        className={cn(
          "absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:opacity-100 focus-visible:opacity-100",
          paused ? "opacity-100" : "opacity-80 sm:opacity-0 sm:group-hover:opacity-100",
        )}
      >
        {paused ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
      </button>
    </div>
  );
}
