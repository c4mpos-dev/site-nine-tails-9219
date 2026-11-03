"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";

const EVENT = "nt:navigate";
/** Se a página nunca chegar (erro de rede), a barra sai sozinha. */
const MAX_MS = 8000;

const isOtherPage = (href: string) => {
  const url = new URL(href, location.href);
  return url.origin === location.origin && url.pathname !== location.pathname;
};

/** Para navegações feitas por código (router.push), que não passam por um clique em link. */
export function startRouteTransition(href: string) {
  if (isOtherPage(href)) window.dispatchEvent(new Event(EVENT));
}

/**
 * Troca de página discreta: uma barra magenta corre no topo com o emblema da raposa na ponta.
 * Avança rápido no começo e desacelera enquanto espera; quando a página chega, completa e some.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const run = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const start = () => {
      run.current?.stop();
      progress.set(0);
      setOn(true);
      run.current = animate(progress, [0, 0.45, 0.8, 0.92], { duration: 6, times: [0, 0.08, 0.4, 1], ease: "easeOut" });
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
  }, [progress]);

  const finish = () => {
    run.current?.stop();
    run.current = animate(progress, 1, { duration: 0.22, ease: "easeOut", onComplete: () => setOn(false) });
  };

  // Página nova na tela: completa a barra
  useEffect(() => {
    if (on) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    const t = setTimeout(finish, MAX_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]"
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: on ? 0.1 : 0.35, delay: on ? 0 : 0.1 }}
    >
      <motion.div style={{ width }} className="relative h-full bg-gradient-to-r from-brand to-accent shadow-[0_0_10px_var(--accent)]">
        <Image src="/brand/emblem.webp" alt="" width={48} height={44} className="absolute -right-3 top-1 w-6 drop-shadow" />
      </motion.div>
    </motion.div>
  );
}
