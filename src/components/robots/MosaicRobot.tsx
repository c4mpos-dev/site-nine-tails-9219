"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { createMosaic, type MosaicHandle } from "./mosaic/engine";

export type MosaicStat = { value: number; label: string };
export type MosaicSource = { src: string; caption: string; robot?: boolean };

/** Fotos servidas já reduzidas pelo otimizador de imagens do Next (384px: a foto aberta ocupa ~60% da altura; q=75 é uma das qualidades liberadas no next.config). */
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`;

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
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // uma foto que falhar só fica de fora
    img.src = src;
  });
}

/**
 * Topo da página de robôs: o Tank Tails montado com fotos da equipe e dos robôs entra correndo e fica andando.
 * De tempos em tempos a câmera mergulha numa peça, revela a foto original e a legenda, e volta para o robô.
 * Clicar numa peça abre ela; o botão no canto pausa tudo (WCAG 2.2.2). Rolando a página, ele arranca e sai
 * pela direita. Para sozinho fora da tela e na aba escondida; com "reduzir movimento", fica parado e montado.
 */
export function MosaicRobot({
  photos,
  stats,
  kicker,
  title,
  lead,
  featured,
}: {
  photos: MosaicSource[];
  stats: MosaicStat[];
  kicker: string;
  title: string;
  lead: string;
  featured: { href: string; label: string; name: string; note: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<MosaicHandle | null>(null);
  const exit = useRef(0);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  // com uma foto aberta, o painel por cima sai da frente
  const [focused, setFocused] = useState(false);
  const running = ready && !reduce && visible && !paused;
  const runningRef = useRef(running);
  useEffect(() => {
    runningRef.current = running;
  });

  const click = (e: React.MouseEvent) => {
    const c = canvasRef.current;
    if (!c || !engine.current || reduce) return;
    const r = c.getBoundingClientRect();
    if (engine.current.click(((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height)) {
      setPaused(false);
      if (!runningRef.current) engine.current.render(exit.current);
    }
  };

  // Monta o motor quando as fotos e a fonte estiverem prontas.
  useEffect(() => {
    let alive = true;
    const root = getComputedStyle(document.documentElement);
    const manrope = root.getPropertyValue("--font-manrope").trim() || "Manrope";
    const body = `${manrope}, system-ui, sans-serif`;
    Promise.all([
      Promise.all(photos.map(async (p) => ({ ...p, img: await load(optimized(p.src)) }))),
      document.fonts.load(`600 24px ${body}`).catch(() => null),
    ])
      .then(([loaded]) => {
        if (!alive || !canvasRef.current) return;
        const ok = loaded.filter((p): p is typeof p & { img: HTMLImageElement } => p.img !== null);
        if (!ok.length) return;
        const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
        fit(canvasRef.current);
        engine.current = createMosaic(canvasRef.current, ok, { body, tour: !still, onFocus: setFocused });
        if (still) engine.current.still();
        setReady(true);
      })
      .catch((err) => console.error("Robô em mosaico não carregou:", err));
    return () => {
      alive = false;
      engine.current?.destroy();
      engine.current = null;
    };
  }, [photos]);

  // Acompanha o tamanho da seção (largura toda, altura da tela).
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !ready) return;
    const ro = new ResizeObserver(() => {
      if (fit(el)) {
        engine.current?.resize();
        engine.current?.render(exit.current);
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
      if (!runningRef.current && r.bottom > 0) engine.current?.render(next);
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
    if (!running) {
      e.render(exit.current);
      return;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      e.frame(Math.min(0.05, (now - prev) / 1000), exit.current);
      prev = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, running]);

  return (
    <section aria-label="Abertura" className="relative h-[calc(100svh-65px)] min-h-80 overflow-hidden bg-band">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        role="img"
        aria-label={`Animação: o Tank Tails montado com ${photos.length} fotos da equipe e dos robôs. De tempos em tempos a câmera se aproxima de uma das fotos e mostra a legenda.`}
        onClick={click}
        className={cn("absolute inset-0 size-full cursor-pointer transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
      />

      {/* Painel por cima do robô: título, o robô em destaque e os números. Sai da frente com uma foto aberta. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 mx-auto flex max-w-6xl flex-col justify-between px-[max(1rem,env(safe-area-inset-left,0px))] pb-5 pt-8 text-white transition-[opacity,translate] duration-500 sm:px-6 sm:pb-8 sm:pt-12",
          focused && "-translate-y-3 opacity-0",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="kicker text-[#ef4fdd]">{kicker}</p>
            <h1 className="heading mt-2 text-4xl leading-none sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">{lead}</p>
          </div>
          <Link href={featured.href} className={cn("group hidden border-l-2 border-[#ef4fdd] pl-4 sm:block", !focused && "pointer-events-auto")}>
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{featured.label}</span>
            <span className="heading mt-1 flex items-center gap-1 text-2xl">
              {featured.name}
              <ArrowUpRight className="size-4 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
            </span>
            <span className="block text-sm text-white/65">{featured.note}</span>
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/15 pt-4 sm:grid-cols-4 sm:pt-5">
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

      {!reduce && ready && (
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "Continuar a animação" : "Pausar a animação"}
          aria-pressed={paused}
          className="absolute bottom-5 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white sm:bottom-8 sm:right-6"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      )}
    </section>
  );
}
