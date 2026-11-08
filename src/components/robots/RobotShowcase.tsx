"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Robot } from "@/content/robots";
import { cn } from "@/lib/cn";

export type ShowcaseRobot = Pick<Robot, "slug" | "name" | "year" | "drivetrain" | "tagline" | "features" | "cutout" | "photo"> & { game?: string };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/*
 * Cada robô tem o seu trecho de scroll (u vai de 0 a 1). Ele entra um pouco antes do trecho começar
 * e sai um pouco depois que acaba, então o que sai e o que chega cruzam a quadra juntos.
 */
const IN: [number, number] = [-0.18, 0.12];
const OUT: [number, number] = [0.82, 1.12];
const phase = (u: number, [a, b]: [number, number]) => clamp((u - a) / (b - a));

/** As três legendas técnicas: de onde a linha sai no robô, onde dobra e onde fica o texto (em % do palco). */
const CALLOUTS = [
  { from: [42, 44], elbow: [30, 30], to: [14, 30], side: "left" },
  { from: [60, 40], elbow: [72, 24], to: [86, 24], side: "right" },
  { from: [58, 66], elbow: [74, 74], to: [86, 74], side: "right" },
] as const;

/** Ano em dígitos que rolam, como um odômetro. */
function Odometer({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex overflow-hidden leading-none", className)} aria-label={value}>
      {[...value].map((d, i) => (
        <span key={i} aria-hidden className="relative inline-block h-[1em] w-[0.62em]">
          <span
            className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(${-Number(d)}em)`, transitionDelay: `${i * 60}ms` }}
          >
            {Array.from({ length: 10 }, (_, k) => (
              <span key={k} className="block h-[1em] text-center">
                {k}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * O hangar em movimento: a seção fica presa na tela e, conforme a pessoa rola, cada robô (recortado, sem fundo)
 * entra pela direita como se andasse na quadra, para no centro com as linhas técnicas se desenhando até as
 * especificações dele, e sai pela esquerda enquanto o próximo chega. Atrás, o nome gigante corre no sentido contrário.
 */
export function RobotShowcase({ robots }: { robots: ShowcaseRobot[] }) {
  const n = robots.length;
  const reduce = !!useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const bots = useRef<(HTMLDivElement | null)[]>([]);
  const names = useRef<(HTMLDivElement | null)[]>([]);
  const notes = useRef<(HTMLDivElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // tamanho do palco, para as linhas técnicas serem desenhadas em pixels (e não esticadas)
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  const paint = (v: number) => {
    const W = window.innerWidth;
    const travel = Math.min(W * 0.8, 1100);
    const now = clamp(Math.floor(v * n), 0, n - 1);
    for (let i = 0; i < n; i++) {
      const u = v * n - i;
      // o primeiro já está na quadra quando a seção chega; o último fica parado no fim
      const a = i === 0 ? 1 : ease(phase(u, IN));
      const b = i === n - 1 ? 0 : ease(phase(u, OUT));
      const moving = Math.sin(Math.PI * (i === 0 ? 0 : phase(u, IN))) + Math.sin(Math.PI * (i === n - 1 ? 0 : phase(u, OUT)));
      const x = (1 - a) * travel - b * travel;
      // com "reduzir movimento", nada anda: só aparece o robô da vez
      const visible = reduce ? i === now : a > 0 && b < 1;

      const bot = bots.current[i];
      if (bot) {
        bot.style.visibility = visible ? "visible" : "hidden";
        if (!reduce) {
          // na arrancada o robô inclina para a frente e borra, como numa foto de ação
          bot.style.transform = `translate3d(${x}px, 0, 0) rotate(${-moving * 3}deg)`;
          bot.style.filter = `blur(${(moving * 5).toFixed(2)}px)`;
        }
      }

      const name = names.current[i];
      if (name) {
        // um nome some antes do próximo aparecer, para os dois não se misturarem
        const fade = reduce ? Number(i === now) : Math.min(i === 0 ? 1 : clamp((u - 0.02) / 0.14), i === n - 1 ? 1 : clamp((0.96 - u) / 0.12));
        name.style.opacity = String(fade);
        if (!reduce) name.style.transform = `translate3d(${(0.5 - u) * W * 0.22}px, -50%, 0)`;
      }

      // as linhas técnicas se desenham com o robô parado e somem antes de ele sair
      const note = notes.current[i];
      if (note) {
        const d = reduce ? Number(i === now) : Math.min(clamp((u - (i === 0 ? 0.02 : 0.16)) / 0.22), i === n - 1 ? 1 : 1 - clamp((u - 0.7) / 0.1));
        note.style.setProperty("--d", d.toFixed(3));
        note.style.visibility = d > 0 ? "visible" : "hidden";
      }

      const fill = fills.current[i];
      if (fill) fill.style.transform = `scaleX(${clamp(u)})`;
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    paint(v);
    setActive(clamp(Math.floor(v * n), 0, n - 1));
  });
  // posição inicial e ao mudar o tamanho da janela
  useEffect(() => {
    const repaint = () => paint(scrollYProgress.get());
    repaint();
    window.addEventListener("resize", repaint);
    return () => window.removeEventListener("resize", repaint);
  });

  const r = robots[active];
  const specs = (x: ShowcaseRobot) => [
    { k: "Tração", v: x.drivetrain },
    ...x.features.filter((f) => f.toLowerCase() !== x.drivetrain.toLowerCase()).slice(0, 2).map((v, j) => ({ k: j === 0 ? "Destaque" : "Em quadra", v })),
  ];

  return (
    <section ref={section} aria-label="Os robôs da Nine Tails, um por um" className="relative border-t border-line bg-tint" style={{ height: `${n * 100 + 40}vh` }}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Prancheta: quadriculado técnico que some nas bordas, e a luz roxa atrás do robô */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgb(158 25 184 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(158 25 184 / 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            backgroundPosition: "center center",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 52%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 52%, #000 30%, transparent 80%)",
          }}
        />
        <div aria-hidden className="absolute left-1/2 top-[54%] size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(181_88_199/0.28),transparent_65%)]" />
        {/* O chão da quadra */}
        <div aria-hidden className="absolute inset-x-0 top-[78%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Os nomes gigantes, vazados, atrás dos robôs */}
        {robots.map((x, i) => (
          <div
            key={x.slug}
            ref={(el) => {
              names.current[i] = el;
            }}
            aria-hidden
            className="heading pointer-events-none absolute left-1/2 top-[50%] -ml-[50vw] w-screen select-none whitespace-nowrap text-center text-[26vw] leading-none text-transparent will-change-transform lg:text-[19vw]"
            style={{ WebkitTextStroke: "2px rgb(158 25 184 / 0.3)", transform: "translate3d(0,-50%,0)", opacity: i === 0 ? 1 : 0 }}
          >
            {x.name}
          </div>
        ))}

        {/* Os robôs */}
        {robots.map((x, i) => (
          <div
            key={x.slug}
            ref={(el) => {
              bots.current[i] = el;
            }}
            className="pointer-events-none absolute left-1/2 top-[50%] -ml-[min(43vw,430px)] -mt-[min(26svh,270px)] h-[min(52svh,540px)] w-[min(86vw,860px)] will-change-transform"
            style={{ visibility: i === 0 ? "visible" : "hidden" }}
          >
            {/* sombra no chão */}
            <div aria-hidden className="absolute inset-x-[14%] bottom-[2%] h-[9%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(42_8_52/0.38),transparent)] blur-md" />
            <Image
              src={x.cutout ?? x.photo!}
              alt={`Robô ${x.name}`}
              fill
              quality={90}
              priority={i === 0}
              sizes="(min-width:1024px) 860px, 86vw"
              className="object-contain object-bottom drop-shadow-[0_24px_30px_rgb(74_0_97/0.22)]"
            />
          </div>
        ))}

        {/* As linhas técnicas e as especificações (só em telas largas) */}
        {robots.map((x, i) => (
          <div
            key={x.slug}
            ref={(el) => {
              notes.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ visibility: "hidden", "--d": 0 } as React.CSSProperties}
          >
            <svg viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0 size-full overflow-visible">
              {CALLOUTS.map((c, j) => {
                const pt = (px: number, py: number) => `${(px * size.w) / 100},${(py * size.h) / 100}`;
                return (
                  <polyline
                    key={j}
                    points={`${pt(c.from[0], c.from[1])} ${pt(c.elbow[0], c.elbow[1])} ${pt(c.to[0] + (c.side === "left" ? 1 : -1), c.to[1])}`}
                    pathLength={1}
                    fill="none"
                    stroke="#9e19b8"
                    strokeWidth={1.25}
                    strokeDasharray="1 1"
                    style={{ strokeDashoffset: "calc(1 - var(--d))" }}
                  />
                );
              })}
            </svg>
            {CALLOUTS.map((c, j) => {
              const s = specs(x)[j];
              if (!s) return null;
              return (
                <div key={j}>
                  <span
                    className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-tint"
                    style={{ left: `${c.from[0]}%`, top: `${c.from[1]}%`, scale: "var(--d)" }}
                  />
                  <div
                    className={cn("absolute w-56 -translate-y-1/2", c.side === "left" ? "-translate-x-full text-right" : "")}
                    style={{ left: `${c.to[0]}%`, top: `${c.to[1]}%`, opacity: `calc(var(--d) * 2 - 1)` }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {String(j + 1).padStart(2, "0")} — {s.k}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug text-fg">{s.v}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Topo: ano em odômetro, jogo e a contagem */}
        <div className="absolute inset-x-0 top-0 pt-20 sm:pt-24">
          <div className="mx-auto flex max-w-6xl items-start justify-between gap-6 px-4 sm:px-6">
            <div>
              <p className="kicker">O hangar em movimento</p>
              <p className="heading mt-2 text-5xl text-fg sm:text-6xl">
                <Odometer value={String(r.year)} />
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-muted">{r.game}</p>
            </div>
            <p className="heading text-right text-2xl text-muted">
              <span className="text-fg">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Base: a frase do robô e a trilha com todos */}
        <div className="absolute inset-x-0 bottom-0 pb-6 sm:pb-8">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
            <div key={r.slug} className="animate-[stack-in_0.5s_cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:animate-none">
              <h2 className="heading text-3xl sm:text-4xl">{r.name}</h2>
              <p className="mt-1 max-w-md text-sm text-muted sm:text-base">{r.tagline}</p>
              <Link href={`/robots/${r.slug}`} className="text-link mt-3 inline-flex items-center gap-1 text-sm">
                Conhecer o {r.name} <ArrowRight className="size-4" />
              </Link>
            </div>
            <ol className="hidden gap-2 sm:flex">
              {robots.map((x, i) => (
                <li key={x.slug} className="flex-1">
                  <Link href={`/robots/${x.slug}`} className="group block" tabIndex={-1}>
                    <span className="block h-0.5 overflow-hidden rounded-full bg-line">
                      <span
                        ref={(el) => {
                          fills.current[i] = el;
                        }}
                        className="block h-full origin-left scale-x-0 bg-accent"
                      />
                    </span>
                    <span className={cn("mt-2 block truncate text-xs transition-colors", i === active ? "font-bold text-fg" : "text-muted group-hover:text-fg")}>
                      {x.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
