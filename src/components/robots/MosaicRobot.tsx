"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { useReducedMotion } from "motion/react";
import { createMosaic, type MosaicHandle } from "./mosaic/engine";

/** Fotos dos pôsteres, servidas já reduzidas pelo otimizador de imagens do Next. */
const PHOTOS: Record<string, string> = {
  robot: "/team/2023-houston-tank-tails.webp",
  ras: "/team/2023-brasilia-rookie-all-star.webp",
  ri: "/team/2023-houston-rookie-inspiration.webp",
  pharaoh: "/team/robo-pharaoh.webp",
  answer: "/team/2023-the-answer-partida.webp",
  arak: "/team/robo-arak.webp",
  impacto: "/team/2024-cuiaba-premio-impacto.webp",
  equipe: "/team/2025-equipe.webp",
};
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`;
const STILL = 3; // quadro de repouso: o robô já montado
/** Depois de entrar e andar ~5 s, o robô assenta (WCAG 2.2.2); passar o mouse, focar ou tocar faz andar de novo. */
const SETTLE_AFTER = 1.6 + 5;
const SETTLE_FRAME = 1.6 + (4 / 7) * 8; // um quadro com o braço na pose inicial

/**
 * Ajusta a resolução do canvas à proporção da tela: 1080 de altura no desktop; em tela estreita,
 * pelo menos 1000 de largura, para o robô inteiro caber. Devolve true se mudou.
 */
function fit(canvas: HTMLCanvasElement) {
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return false;
  const aspect = width / height;
  const w = aspect >= 1000 / 1080 ? Math.round(1080 * aspect) : 1000;
  const h = aspect >= 1000 / 1080 ? 1080 : Math.round(1000 / aspect);
  if (canvas.width === w && canvas.height === h) return false;
  canvas.width = w;
  canvas.height = h;
  return true;
}

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Abertura da home, ocupando a tela abaixo do cabeçalho: um robô feito de pôsteres da equipe
 * entra correndo, freia no centro e fica andando. Rolando a página, ele arranca e sai pela direita.
 * Ocupa a largura toda: o canvas segue o tamanho da seção. Para sozinha fora da tela e na aba escondida;
 * com "reduzir movimento", mostra o robô parado no centro.
 */
export type IntroStat = { value: number; label: string };
export type IntroRobot = { name: string; year: number; game: string; drivetrain: string; href: string };

export function MosaicIntro({ stats, robot }: { stats: IntroStat[]; robot: IntroRobot }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<MosaicHandle | null>(null);
  const time = useRef(0);
  const exit = useRef(0);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  // com "reduzir movimento", fica parado no quadro final
  const playing = !reduce;
  const [visible, setVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing && visible && !settled;
  });
  const wake = () => {
    if (!settled || reduce) return;
    time.current = 1.6;
    setSettled(false);
  };

  // Monta o motor quando as fotos e as fontes estiverem prontas.
  useEffect(() => {
    let alive = true;
    const root = getComputedStyle(document.documentElement);
    const oswald = root.getPropertyValue("--font-oswald").trim() || "Oswald";
    const manrope = root.getPropertyValue("--font-manrope").trim() || "Manrope";
    const display = `${oswald}, "Arial Narrow", sans-serif`;
    const body = `${manrope}, system-ui, sans-serif`;
    Promise.all([
      Promise.all(Object.entries(PHOTOS).map(async ([k, src]) => [k, await load(optimized(src))] as const)),
      document.fonts.load(`700 100px ${display}`).catch(() => null),
      document.fonts.load(`700 24px ${body}`).catch(() => null),
    ])
      .then(([pairs]) => {
        if (!alive || !canvasRef.current) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) time.current = STILL;
        fit(canvasRef.current);
        engine.current = createMosaic(canvasRef.current, Object.fromEntries(pairs), { display, body });
        setReady(true);
      })
      .catch((err) => console.error("Abertura em mosaico não carregou:", err));
    return () => {
      alive = false;
      engine.current?.destroy();
      engine.current = null;
    };
  }, []);

  // Acompanha o tamanho da seção (largura toda, altura da tela).
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !ready) return;
    const ro = new ResizeObserver(() => {
      if (fit(el)) {
        engine.current?.resize();
        engine.current?.render(time.current, exit.current);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  // Rolagem: 0 com a abertura inteira na tela, 1 quando ela já subiu 60%.
  useEffect(() => {
    const el = canvasRef.current?.parentElement;
    if (!el) return;
    const reduceMq = matchMedia("(prefers-reduced-motion: reduce)");
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 && exit.current === 1) return; // já saiu da tela: nada a redesenhar
      const next = reduceMq.matches ? 0 : Math.min(1, Math.max(0, -r.top / (r.height * 0.6)));
      if (next === exit.current) return;
      exit.current = next;
      if (!playingRef.current && r.bottom > 0) engine.current?.render(time.current, next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  // Fora da tela ou com a aba escondida, não gasta CPU.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden), { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const e = engine.current;
    if (!ready || !e) return;
    if (!playing || !visible || settled) {
      e.render(time.current, exit.current);
      return;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      time.current += Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (time.current > SETTLE_AFTER) {
        time.current = SETTLE_FRAME;
        e.render(time.current, exit.current);
        setSettled(true);
        return;
      }
      e.render(time.current, exit.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, playing, visible, settled]);

  return (
    <section
      aria-label="Abertura"
      className="relative h-[calc(100svh-65px)] min-h-80 overflow-hidden bg-band"
      onPointerEnter={wake}
      onPointerDown={wake}
      onFocus={wake}
    >
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        role="img"
        aria-label="Animação: um robô feito de miniaturas de pôsteres da equipe entra correndo, freia no centro e fica andando com um cone no braço."
        className={`absolute inset-0 size-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {/* Painel por cima do robô: lema, último robô e os números das partidas (tudo vindo do conteúdo e do TBA) */}
      <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-6xl flex-col justify-between px-[max(1rem,env(safe-area-inset-left,0px))] pb-5 pt-8 text-white sm:px-6 sm:pb-8 sm:pt-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="kicker text-[#ef4fdd]">FRC 9219 · Resende, RJ</p>
            <h1 className="heading mt-2 text-4xl leading-none sm:text-5xl">
              <span className="sr-only">Nine Tails #9219: </span>
              Evolução constante
              <br />
              <span className="text-white/45">desde 2022.</span>
            </h1>
          </div>
          <Link
            href={robot.href}
            className="pointer-events-auto group hidden border-l-2 border-[#ef4fdd] pl-4 transition-colors sm:block"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">Robô atual</span>
            <span className="heading mt-1 flex items-center gap-1 text-2xl">
              {robot.name}
              <ArrowUpRight className="size-4 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
            </span>
            <span className="block text-sm text-white/65">
              {robot.year} · {robot.game} · {robot.drivetrain}
            </span>
          </Link>
        </div>

        <dl className="grid grid-cols-3 gap-x-4 gap-y-4 border-t border-white/15 pt-4 sm:grid-cols-6 sm:pt-5">
          {stats.map((st) => (
            <div key={st.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs leading-snug text-white/60">{st.label}</dt>
              <dd className="heading text-3xl sm:text-4xl">
                <Counter value={st.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
