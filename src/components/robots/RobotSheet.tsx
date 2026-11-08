import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy as TrophyIcon } from "lucide-react";
import type { Robot } from "@/content/robots";
import { getSeason } from "@/content/seasons";
import { awards } from "@/content/awards";
import { Tilt } from "@/components/ui/Tilt";
import { RobotBlueprint } from "./RobotBlueprint";
import { cn } from "@/lib/cn";

/** Cantos de visor, como num desenho técnico. */
function Corners() {
  const c = "absolute z-10 size-5 border-accent transition-transform duration-300";
  return (
    <>
      <span aria-hidden className={`${c} -left-2 -top-2 border-l-2 border-t-2 group-hover:-translate-x-1 group-hover:-translate-y-1`} />
      <span aria-hidden className={`${c} -right-2 -top-2 border-r-2 border-t-2 group-hover:translate-x-1 group-hover:-translate-y-1`} />
      <span aria-hidden className={`${c} -bottom-2 -left-2 border-b-2 border-l-2 group-hover:-translate-x-1 group-hover:translate-y-1`} />
      <span aria-hidden className={`${c} -bottom-2 -right-2 border-b-2 border-r-2 group-hover:translate-x-1 group-hover:translate-y-1`} />
    </>
  );
}

/**
 * Ficha técnica de um robô na página de robôs: foto grande com visor, número gigante ao fundo,
 * especificações e os prêmios que ele trouxe. `flip` alterna o lado da foto.
 */
export function RobotSheet({ robot, flip }: { robot: Robot; flip?: boolean }) {
  const season = getSeason(robot.seasonSlug);
  const number = robot.order.replace(/\D/g, "").padStart(2, "0");
  const won = awards.filter((a) => robot.awards?.includes(a.id));
  const specs = [
    { k: "Temporada", v: season ? `${robot.year} · ${season.game}` : String(robot.year) },
    { k: robot.events.length > 1 ? "Competições" : "Competição", v: robot.events },
  ];

  return (
    <Link href={`/robots/${robot.slug}`} className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={cn("relative lg:col-span-7", flip && "lg:order-2")}>
        <Corners />
        <Tilt max={5} glare className="rounded-md">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface-2">
            {robot.photo ? (
              <Image
                quality={90}
                src={robot.photo}
                alt={`Robô ${robot.name}`}
                fill
                sizes="(min-width:1024px) 58vw, 95vw"
                className="object-cover transition-[scale] duration-700 [translate:calc(var(--mx,0)*-10px)_calc(var(--my,0)*-10px)] group-hover:scale-[1.05]"
                style={robot.photoPosition ? { objectPosition: robot.photoPosition } : undefined}
              />
            ) : (
              <RobotBlueprint drivetrain={robot.drivetrain} className="absolute inset-0 m-auto h-[75%] w-[75%] text-brand opacity-80" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/85">
              {robot.order} · {robot.year}
            </span>
          </div>
        </Tilt>
      </div>

      <div className={cn("relative lg:col-span-5", flip && "lg:order-1")}>
        {/* Número gigante, só o contorno */}
        <span
          aria-hidden
          className="heading pointer-events-none absolute -top-14 right-0 select-none text-[9rem] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--line)] transition-[-webkit-text-stroke-color] duration-300 group-hover:[-webkit-text-stroke-color:var(--accent)] sm:text-[11rem]"
        >
          {number}
        </span>
        <p className="kicker relative">{season?.game ?? robot.year}</p>
        <h2 className="heading relative mt-2 text-5xl transition-colors group-hover:text-accent sm:text-6xl">{robot.name}</h2>
        <p className="relative mt-3 text-lg leading-relaxed text-muted">{robot.tagline}</p>

        <dl className="relative mt-6 divide-y divide-line border-y border-line">
          {specs.map((s) => (
            <div key={s.k} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{s.k}</dt>
              <dd className="text-right font-bold">
                {Array.isArray(s.v) ? s.v.map((e) => <span key={e} className="block">{e}</span>) : s.v}
              </dd>
            </div>
          ))}
        </dl>

        {won.length > 0 && (
          <ul className="relative mt-4 flex flex-wrap gap-2">
            {won.map((a) => (
              <li key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-bold text-accent">
                <TrophyIcon className="size-3.5" /> {a.title}
              </li>
            ))}
          </ul>
        )}

        <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold">
          Ver a ficha completa
          <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
