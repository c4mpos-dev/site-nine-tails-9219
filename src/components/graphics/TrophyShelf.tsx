import Link from "next/link";
import { Trophy } from "@/components/graphics/Trophies";
import type { Award } from "@/content/awards";
import { cn } from "@/lib/cn";

/** Altura de cada tipo de troféu na estante, proporcional ao tamanho real. */
const height = { frc: "h-36 sm:h-44", sesi: "h-40 sm:h-48" };

/**
 * A estante de troféus: todos os prêmios lado a lado sobre a prateleira roxa.
 * Cada troféu leva para o detalhe dele em /conquistas.
 */
export function TrophyShelf({ awards, className }: { awards: Award[]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto [scrollbar-width:thin]", className)}>
      <div className="min-w-[760px] px-2">
        <ul className="flex items-end justify-around gap-4 px-4">
          {awards.map((a) => (
            <li key={a.id} className="flex-1">
              <Link href={`/conquistas#${a.id}`} className="group block" aria-label={`${a.title}, ${a.date}`}>
                <Trophy
                  art={a.art}
                  className={cn("mx-auto w-auto drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1.5", height[a.art.kind])}
                />
              </Link>
            </li>
          ))}
        </ul>
        {/* Prateleira */}
        <div aria-hidden className="relative h-4 rounded-sm bg-gradient-to-b from-brand to-brand-strong shadow-[0_14px_24px_-12px_rgb(0_0_0/0.6)]">
          <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
        </div>
        <ul className="mt-4 flex justify-around gap-4 px-4">
          {awards.map((a) => (
            <li key={a.id} className="flex-1 text-center">
              <Link href={`/conquistas#${a.id}`} className="font-bold leading-tight hover:text-accent">
                {a.title}
              </Link>
              <p className="mt-0.5 text-xs text-muted">{a.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
