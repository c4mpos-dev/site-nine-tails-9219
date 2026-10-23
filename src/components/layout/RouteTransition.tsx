"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FoxLoader } from "@/components/brand/FoxLoader";

const EVENT = "nt:navigate";
/** Tempo mínimo da cortina na tela, para a animação não piscar em navegações instantâneas. */
const MIN_MS = 520;
/** Se a página nunca chegar (erro de rede), a cortina sai sozinha. */
const MAX_MS = 8000;
const EASE = [0.76, 0, 0.24, 1] as const;

const phrases = [
  "Ligando o robô",
  "Conferindo os bumpers",
  "Calibrando o swerve",
  "Trocando a bateria",
  "Alinhando com a aliança",
  "Esperando o sinal do juiz",
  "Apertando os parafusos",
];

const isOtherPage = (href: string) => {
  const url = new URL(href, location.href);
  return url.origin === location.origin && url.pathname !== location.pathname;
};

/** Para navegações feitas por código (router.push), que não passam por um clique em link. */
export function startRouteTransition(href: string) {
  if (isOtherPage(href)) window.dispatchEvent(new Event(EVENT));
}

/**
 * Troca de página com cortina: uma faixa magenta sobe, o fundo do tema cobre a tela e as nove caudas
 * acendem em volta do emblema. Quando a página nova chega, a cortina continua subindo e sai.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [phrase, setPhrase] = useState(phrases[0]);
  const since = useRef(0);

  useEffect(() => {
    const start = () => {
      since.current = performance.now();
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      setOn(true);
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (isOtherPage(a.href)) start();
    };
    // Captura: roda antes do onClick do <Link>, que cancela o evento
    document.addEventListener("click", onClick, true);
    window.addEventListener(EVENT, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(EVENT, start);
    };
  }, []);

  // Página nova na tela: espera o mínimo e abre a cortina
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setOn(false), Math.max(0, MIN_MS - (performance.now() - since.current)));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setOn(false), MAX_MS);
    return () => clearTimeout(t);
  }, [on]);

  const wipe = (enterDelay: number, exitDelay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
      : {
          initial: { clipPath: "inset(100% 0 0 0)" },
          animate: { clipPath: "inset(0% 0 0 0)", transition: { duration: 0.42, ease: EASE, delay: enterDelay } },
          exit: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.48, ease: EASE, delay: exitDelay } },
        };

  return (
    <AnimatePresence>
      {on && (
        <div key="cortina" className="fixed inset-0 z-[90] cursor-progress" aria-hidden>
          <motion.div className="absolute inset-0 bg-accent" {...wipe(0, 0.08)} />
          <motion.div className="absolute inset-0 grid place-items-center bg-bg" {...wipe(0.07, 0)}>
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.3 } }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
            >
              <FoxLoader className="size-36 sm:size-44" />
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">{phrase}…</p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
