"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type MatchVideo = { id: string; title: string };

/** Player do vídeo oficial da partida (YouTube, via The Blue Alliance) num <dialog> nativo. */
export function VideoDialog({ video, onClose }: { video: MatchVideo | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (video && !d.open) d.showModal();
    if (!video && d.open) d.close();
  }, [video]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(960px,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-0 text-fg backdrop:bg-black/80"
    >
      {video && (
        <div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-bold">{video.title}</p>
            <button type="button" onClick={onClose} className="rounded p-1 text-muted hover:text-accent" aria-label="Fechar vídeo">
              <X className="size-5" />
            </button>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="size-full"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Botão "assistir" que abre o vídeo de uma partida. */
export function WatchButton({ video, className }: { video: MatchVideo; className?: string }) {
  const [open, setOpen] = useState<MatchVideo | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(video)}
        className={cn("inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline", className)}
      >
        <Play className="size-3.5 fill-current" /> Assistir
      </button>
      <VideoDialog video={open} onClose={() => setOpen(null)} />
    </>
  );
}
