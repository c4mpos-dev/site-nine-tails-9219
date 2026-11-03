import Link from "next/link";
import Image from "next/image";
import { Trophy as TrophyIcon } from "lucide-react";
import type { Robot } from "@/content/robots";
import { getSeason } from "@/content/seasons";
import { Tilt } from "@/components/ui/Tilt";
import { RobotBlueprint } from "./RobotBlueprint";

/**
 * Galeria do hangar: só as fotos, com nome, ano e jogo por cima.
 * No hover o card inclina com reflexo, a foto corre ao contrário (paralaxe) e o texto sobe revelando a frase.
 */
export function RobotGallery({ robots }: { robots: Robot[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {robots.map((r) => {
        const season = getSeason(r.seasonSlug);
        return (
          <li key={r.slug}>
            <Link href={`/robots/${r.slug}`} className="group block">
              <Tilt max={6} glare className="rounded-lg">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-2 ring-1 ring-line transition-shadow duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-accent">
                  {r.photo ? (
                    <Image
                      quality={90}
                      src={r.photo}
                      alt={`Robô ${r.name}`}
                      fill
                      sizes="(min-width:1024px) 31vw, (min-width:640px) 48vw, 95vw"
                      className="object-cover transition-[scale] duration-700 [translate:calc(var(--mx,0)*-12px)_calc(var(--my,0)*-12px)] group-hover:scale-[1.08]"
                      style={r.photoPosition ? { objectPosition: r.photoPosition } : undefined}
                    />
                  ) : (
                    <RobotBlueprint drivetrain={r.drivetrain} className="absolute inset-0 m-auto h-[70%] w-[70%] text-brand opacity-80" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    {r.order}
                  </span>
                  {r.awards && r.awards.length > 0 && (
                    <span
                      className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs font-bold text-white"
                      title={`${r.awards.length} ${r.awards.length > 1 ? "prêmios" : "prêmio"}`}
                    >
                      <TrophyIcon className="size-3.5 text-[#f0a6e8]" aria-hidden /> {r.awards.length}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-500 ease-out [@media(hover:hover)]:translate-y-7 [@media(hover:hover)]:group-hover:translate-y-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
                      {r.year}
                      {season && ` · ${season.game}`}
                    </p>
                    <h3 className="heading mt-1 text-4xl transition-colors group-hover:text-[#f0a6e8]">{r.name}</h3>
                    <span aria-hidden className="mt-2 block h-0.5 w-10 bg-[#f0a6e8] transition-[width] duration-500 group-hover:w-24" />
                    <p className="mt-2 line-clamp-2 text-sm text-white/75 transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                      {r.tagline}
                    </p>
                  </div>
                </div>
              </Tilt>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
