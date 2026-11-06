"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/icons/Social";
import { paths, type Alumnus } from "@/content/alumni";
import { cn } from "@/lib/cn";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const slug = (name: string) => `alumni-${name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-")}`;

const period = (y?: [number, number?]) => (!y ? "" : y[1] && y[1] !== y[0] ? `${y[0]}–${y[1]}` : `Turma de ${y[0]}`);

// Três anéis girando em sentidos alternados; a turma se reparte entre eles
const C = 300;
const rings = [
  { r: 130, secs: 80, dir: "normal" },
  { r: 205, secs: 110, dir: "reverse" },
  { r: 275, secs: 140, dir: "normal" },
] as const;

/**
 * Órbita dos alumni: o emblema no centro e a turma girando em volta.
 * Passar o mouse por alguém pausa o giro e mostra o nome; clicar leva ao crachá.
 */
function Orbit({ alumni, active, setActive, onPick }: { alumni: Alumnus[]; active: string | null; setActive: (n: string | null) => void; onPick: (n: string) => void }) {
  const go = (name: string) => {
    onPick(name);
    const el = document.getElementById(slug(name));
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.animate([{ outlineColor: "var(--accent)" }, { outlineColor: "transparent" }], { duration: 1600, easing: "ease-out" });
  };

  return (
    <svg viewBox="0 0 600 600" className="group/orbit w-full max-w-xl overflow-visible" role="img" aria-label="Órbita dos alumni: o emblema da equipe no centro e quem passou por ela girando em volta.">
      {rings.map(({ r, secs, dir }, i) => {
        // Anéis maiores levam mais gente: 2, 4 e o resto, na ordem da lista
        const people = alumni.filter((_, k) => (k % 7 < 2 ? 0 : k % 7 < 4 ? 1 : 2) === i);
        return (
          <motion.g
            key={r}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <circle cx={C} cy={C} r={r} fill="none" className="stroke-accent/35" strokeWidth={1.5} strokeDasharray="3 6" />
            <g
              className="animate-[spin_1s_linear_infinite] group-hover/orbit:[animation-play-state:paused] motion-reduce:animate-none"
              style={{ transformBox: "view-box", transformOrigin: "50% 50%", animationDuration: `${secs}s`, animationDirection: dir }}
            >
              {people.map((a, k) => {
                const t = (k / people.length) * Math.PI * 2 + i * 0.9;
                // Arredonda para o servidor e o navegador gerarem o mesmo número
                const x = Math.round(C + r * Math.sin(t)), y = Math.round(C - r * Math.cos(t));
                const on = active === a.name;
                return (
                  <g key={a.name} transform={`translate(${x} ${y})`}>
                    {/* Gira ao contrário para as iniciais continuarem de pé */}
                    <g
                      className="animate-[spin_1s_linear_infinite] group-hover/orbit:[animation-play-state:paused] motion-reduce:animate-none"
                      style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: `${secs}s`, animationDirection: dir === "normal" ? "reverse" : "normal" }}
                    >
                      <g
                        role="link"
                        tabIndex={0}
                        aria-label={`${a.name}: ver o crachá`}
                        className="cursor-pointer outline-none"
                        onPointerEnter={() => setActive(a.name)}
                        onPointerLeave={() => setActive(null)}
                        onFocus={() => setActive(a.name)}
                        onBlur={() => setActive(null)}
                        onClick={() => go(a.name)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), go(a.name))}
                      >
                        <circle r={30} fill="transparent" />
                        <circle
                          r={on ? 25 : 21}
                          className={cn("transition-[fill,stroke] duration-300", on ? "fill-brand stroke-accent" : "fill-surface-2 stroke-line")}
                          strokeWidth={2}
                        />
                        <text
                          textAnchor="middle"
                          dy="0.35em"
                          className={cn("heading pointer-events-none text-[15px] transition-colors", on ? "fill-brand-ink" : "fill-accent")}
                        >
                          {initials(a.name)}
                        </text>
                        <text
                          y={44}
                          textAnchor="middle"
                          className={cn("pointer-events-none fill-fg text-[14px] font-bold transition-opacity duration-200", on ? "opacity-100" : "opacity-0")}
                        >
                          {a.name}
                        </text>
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
          </motion.g>
        );
      })}

      {/* O emblema no centro, com um pulso suave */}
      <circle cx={C} cy={C} r={52} className="fill-brand/15 motion-safe:animate-pulse" />
      <motion.image
        href="/brand/emblem.webp"
        x={C - 46}
        y={C - 42}
        width={92}
        height={84}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
    </svg>
  );
}

/**
 * Crachá compacto: foto ou iniciais, nome e o que a pessoa faz hoje.
 * Clicar abre o resto (o que fazia na raposa, a frase da turma e as redes), com o trilho do "antes" para o "hoje".
 */
function Badge({ a, active, open, setActive, toggle }: { a: Alumnus; active: boolean; open: boolean; setActive: (n: string | null) => void; toggle: () => void }) {
  const then = a.did ?? (a.area ? `Área de ${a.area}` : a.years?.[0] === 2023 ? "Turma pioneira da Charged Up" : undefined);
  const panel = `${slug(a.name)}-mais`;

  return (
    <article
      id={slug(a.name)}
      onPointerEnter={() => setActive(a.name)}
      onPointerLeave={() => setActive(null)}
      className={cn(
        "group/badge relative scroll-mt-28 overflow-hidden rounded-lg border bg-bg outline-2 outline-offset-4 outline-transparent transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
        active || open ? "border-accent shadow-[0_14px_30px_-20px_var(--brand)]" : "border-line",
      )}
    >
      {/* Faixa do crachá na lateral, que engrossa quando abre */}
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5 origin-left bg-brand transition-transform duration-300", open ? "scale-x-100" : "scale-x-[0.67] group-hover/badge:scale-x-100")} />

      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={panel} className="flex w-full items-center gap-3 py-3 pl-5 pr-3 text-left">
        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 ring-2 ring-line transition-shadow duration-300 group-hover/badge:ring-accent">
          {a.photo ? (
            <Image src={a.photo.src} alt="" fill sizes="44px" className="object-cover" style={{ objectPosition: a.photo.position }} />
          ) : (
            <span className="heading text-lg text-accent">{initials(a.name)}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="heading block truncate text-xl leading-tight">{a.name}</span>
          <span className="block truncate text-sm text-muted">{a.now ?? "Contando em breve"}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300",
            open ? "rotate-45 border-accent bg-accent text-brand-ink" : "border-line text-muted group-hover/badge:border-accent group-hover/badge:text-accent",
          )}
        >
          <Plus className="size-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-dashed border-line pb-4 pl-5 pr-4 pt-4">
              <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <span>Alumni · #9219</span>
                <span>{period(a.years)}</span>
              </p>
              {/* Antes e agora, ligados por um trilho por onde desce um ponto */}
              <dl className="relative mt-3 grid grid-cols-[1rem_1fr] gap-x-3 gap-y-3 text-sm">
                <span aria-hidden className="relative col-start-1 row-span-2 row-start-1 mx-auto w-px bg-[repeating-linear-gradient(to_bottom,var(--line)_0_4px,transparent_4px_8px)]">
                  <span className="absolute -left-[3px] top-1 size-[7px] animate-[alumni-trail_1.6s_ease-in-out_infinite] rounded-full bg-accent motion-reduce:hidden" />
                </span>
                <div className="col-start-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Na raposa</dt>
                  <dd className="mt-0.5">{then ?? "Integrante da equipe"}</dd>
                </div>
                <div className="col-start-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Hoje</dt>
                  <dd className="mt-0.5 font-bold">{a.now ?? "Contando em breve"}</dd>
                </div>
              </dl>
              {a.vibe && <p className="mt-4 border-l-2 border-accent pl-3 text-sm italic leading-relaxed text-muted">{a.vibe}</p>}
              {(a.instagram || a.linkedin) && (
                <div className="mt-3 flex justify-end">
                  {a.instagram && (
                    <a href={`https://www.instagram.com/${a.instagram}/`} target="_blank" rel="noreferrer" aria-label={`Instagram @${a.instagram}`} className="grid size-9 place-items-center rounded-md text-accent hover:bg-surface-2">
                      <InstagramIcon className="size-[18px]" />
                    </a>
                  )}
                  {a.linkedin && (
                    <a href={a.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${a.name}`} className="grid size-9 place-items-center rounded-md text-accent hover:bg-surface-2">
                      <LinkedinIcon className="size-[18px]" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/**
 * A página dos alumni em duas partes: a órbita com a turma girando em volta do emblema e os crachás.
 * Passar por um crachá acende a pessoa na órbita, e vice-versa.
 */
export function AlumniBoard({ alumni }: { alumni: Alumnus[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="mx-auto w-full max-w-xl">
          <Orbit alumni={alumni} active={active} setActive={setActive} onPick={setOpen} />
        </div>
        <div>
          <p className="kicker">Perto e longe</p>
          <h2 className="heading mt-2 text-4xl sm:text-5xl">Onde a raposa chegou</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-muted">
            Cada um saiu da oficina para um canto, mas todo mundo continua girando em volta do mesmo emblema. Hoje, os alumni:
          </p>
          <ul className="mt-6 space-y-3">
            {paths.map((p, i) => (
              <motion.li
                key={p.label}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="flex gap-3"
              >
                <span aria-hidden className="mt-2 size-2.5 shrink-0 rounded-full bg-accent" style={{ opacity: 1 - i * 0.15 }} />
                <span>
                  <span className="block font-bold">{p.label}</span>
                  <span className="block text-sm text-muted">{p.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">Passe o mouse por alguém na órbita para ver o nome, ou clique para ir ao crachá.</p>
        </div>
      </div>

      <ul className="mt-16 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {alumni.map((a, i) => (
          <motion.li
            key={a.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Badge a={a} active={active === a.name} open={open === a.name} setActive={setActive} toggle={() => setOpen(open === a.name ? null : a.name)} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
