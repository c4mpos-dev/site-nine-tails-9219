"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Item = { src: string; caption: string; ratio: number | null };

/**
 * Foto ampliada numa janela sobre a página. Abre com clique (ou Enter) em qualquer elemento com
 * `data-zoom`, mostra só aquela foto, inteira e sem corte, e fecha com Esc, no X ou clicando fora.
 */
export function PhotoViewer() {
  const [item, setItem] = useState<Item | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = item !== null;

  const close = useCallback(() => setItem(null), []);

  // Abre a partir de qualquer foto marcada na página
  useEffect(() => {
    const start = (el: HTMLElement) => {
      // A proporção vem da miniatura já carregada; sem ela (botões), é lida quando a foto carrega
      const img = el.querySelector("img");
      trigger.current = el;
      setItem({
        src: el.dataset.zoom!,
        caption: el.dataset.zoomCaption ?? "",
        ratio: img?.naturalWidth ? img.naturalWidth / img.naturalHeight : null,
      });
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const el = (e.target as Element).closest<HTMLElement>("[data-zoom]");
      if (!el) return;
      e.preventDefault();
      start(el);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = e.target as HTMLElement;
      if (!el.dataset?.zoom || el.tagName === "BUTTON") return;
      e.preventDefault();
      start(el);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Enquanto aberta: trava a rolagem e fecha com Esc; ao fechar, devolve o foco
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        e.preventDefault();
        closeBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open, close]);

  const ratio = item?.ratio ?? 3 / 2;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.figure
            className="relative"
            style={{ width: `min(92vw, 1100px, calc(78vh * ${ratio}))` }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-lg bg-[#160b20] shadow-2xl" style={{ aspectRatio: ratio }}>
              <Image
                quality={90}
                src={item.src}
                alt={item.caption}
                fill
                sizes="(min-width: 1200px) 1100px, 92vw"
                className="object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (item.ratio === null && img.naturalWidth) {
                    setItem({ ...item, ratio: img.naturalWidth / img.naturalHeight });
                  }
                }}
              />
            </div>
            {item.caption && <figcaption className="mt-3 text-center text-sm text-white/85">{item.caption}</figcaption>}
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute -right-2 -top-2 grid size-9 place-items-center rounded-full bg-white text-[#160b20] shadow-lg transition-colors hover:bg-[#f0a6e8] sm:-right-3 sm:-top-3"
            >
              <X className="size-5" />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
