"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls } from "motion/react";
import { useRef } from "react";

export const TOCA_KEY = "nt-toca";

/**
 * O emblema do rodapé guarda um segredo: nove cliques (uma por cauda) abrem a toca da raposa.
 * Cada clique dá uma balançadinha, e no nono a raposa leva você para lá.
 */
export function FoxSecret() {
  const router = useRouter();
  const clicks = useRef(0);
  const controls = useAnimationControls();

  async function onClick() {
    clicks.current += 1;
    const n = clicks.current;
    if (n >= 9) {
      clicks.current = 0;
      try {
        localStorage.setItem(TOCA_KEY, "1");
      } catch {}
      await controls.start({ rotate: [0, 360], scale: [1, 1.25, 1], transition: { duration: 0.7 } });
      router.push("/toca");
      return;
    }
    controls.start({ rotate: [0, n % 2 ? -12 : 12, 0], transition: { duration: 0.3 } });
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={controls}
      aria-label="Emblema da Nine Tails"
      className="shrink-0 cursor-pointer select-none"
    >
      <Image src="/brand/emblem.webp" alt="" width={64} height={58} className="h-14 w-auto" draggable={false} />
    </motion.button>
  );
}
