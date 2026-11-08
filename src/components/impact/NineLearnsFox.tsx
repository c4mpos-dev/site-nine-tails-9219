"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type School = { name: string; date: string; impact: number };
type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; c: string; s: number; delay: number };

const PUSH = 70;

/**
 * Nine Learns: cada criança vira um ponto, e os 6.222 pontos montam o emblema da raposa.
 * Quando a seção aparece, os pontos chegam de baixo, como a criançada entrando na escola, e o contador sobe junto.
 * Cada escola é uma fatia do emblema: passar por uma escola na lista (ou pela fatia no desenho) acende a parte dela.
 * O mouse ou o dedo espalham os pontos, que voltam para o lugar. Com "reduzir movimento", o emblema já aparece montado.
 */
export function NineLearnsFox({ schools, heading }: { schools: readonly School[]; heading: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const wake = useRef<() => void>(() => {});
  const total = schools.reduce((a, s) => a + s.impact, 0);
  const max = Math.max(...schools.map((s) => s.impact));

  const pick = (i: number | null) => {
    activeRef.current = i;
    setActive(i);
    wake.current();
  };

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, size = 2, cx = 0, cy = 0;
    let dots: Dot[] = [];
    let slices: number[] = []; // ângulo onde cada escola termina
    let raf = 0, running = false, started = reduce, t0 = 0, visible = false, arrived = reduce;
    const pointer = { x: -1e4, y: -1e4, on: false };
    let fg = "#000";

    const img = new Image();
    img.src = "/brand/emblem.webp";

    // Ângulo a partir do topo, no sentido horário, de 0 a 1
    const turn = (x: number, y: number) => ((Math.atan2(x - cx, -(y - cy)) / (Math.PI * 2)) + 1) % 1;

    const build = () => {
      const r = box.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height); dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = W * dpr; el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fg = getComputedStyle(box).getPropertyValue("--fg").trim() || fg;

      // Emblema contido no quadro, amostrado num canvas escondido
      const scale = Math.min((W * 0.92) / img.width, (H * 0.92) / img.height);
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const ox = Math.round((W - w) / 2), oy = Math.round((H - h) / 2);
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.drawImage(img, ox, oy, w, h);
      const data = o.getImageData(0, 0, W, H).data;

      let opaque = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 140) opaque++;
      const step = Math.max(1, Math.sqrt(opaque / total) * 0.98);
      size = Math.max(1.2, step * 0.78);

      const found: { x: number; y: number; c: string }[] = [];
      for (let y = oy; y < oy + h; y += step) {
        for (let x = ox; x < ox + w; x += step) {
          const i = (Math.round(y) * W + Math.round(x)) * 4;
          if (data[i + 3] <= 140) continue;
          const [rr, gg, bb] = [data[i], data[i + 1], data[i + 2]];
          const dark = rr * 0.3 + gg * 0.59 + bb * 0.11 < 45;
          found.push({ x, y, c: dark ? fg : `rgb(${rr},${gg},${bb})` });
        }
      }
      // Exatamente uma criança por ponto: sobra corta de forma espalhada, falta repete com um leve desvio
      const chosen: typeof found = [];
      for (let k = 0; k < total; k++) {
        const p = found[Math.floor((k * found.length) / total)];
        chosen.push(k < found.length ? p : { ...p, x: p.x + step / 2, y: p.y + step / 2 });
      }

      cx = W / 2; cy = H / 2;
      let acc = 0;
      slices = schools.map((s) => (acc += s.impact / total));
      dots = chosen.map((p) => {
        const fromX = Math.random() * W, fromY = H + 20 + Math.random() * H * 0.6;
        return {
          hx: p.x, hy: p.y, c: p.c,
          s: slices.findIndex((end) => turn(p.x, p.y) <= end + 1e-9),
          x: started ? p.x : fromX, y: started ? p.y : fromY, vx: 0, vy: 0,
          delay: Math.random() * 1400 + (1 - p.y / H) * 500,
        };
      });
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const a = activeRef.current;
      let home = 0;
      for (const d of dots) {
        ctx.globalAlpha = a === null || d.s === a ? 1 : 0.14;
        ctx.fillStyle = d.c;
        const grow = a !== null && d.s === a ? 1.25 : 1;
        ctx.fillRect(d.x - (size * grow) / 2, d.y - (size * grow) / 2, size * grow, size * grow);
        if (!arrived && Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) < 6) home++;
      }
      ctx.globalAlpha = 1;
      // O contador sobe enquanto a raposa se monta; depois fica no total, mesmo com os pontos bagunçados
      if (home === total) arrived = true;
      if (counter.current) counter.current.textContent = (arrived ? total : home).toLocaleString("pt-BR");
    };

    const step = (now: number) => {
      let moving = false;
      const r2 = PUSH * PUSH;
      for (const d of dots) {
        if (now - t0 < d.delay) { moving = true; continue; }
        let ax = (d.hx - d.x) * 0.05, ay = (d.hy - d.y) * 0.05;
        if (pointer.on) {
          const dx = d.x - pointer.x, dy = d.y - pointer.y, q = dx * dx + dy * dy;
          if (q < r2 && q > 0.01) {
            const f = (1 - Math.sqrt(q) / PUSH) * 3.2 / Math.sqrt(q);
            ax += dx * f; ay += dy * f;
          }
        }
        d.vx = (d.vx + ax) * 0.8; d.vy = (d.vy + ay) * 0.8;
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.05 || Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) > 0.5) moving = true;
      }
      draw();
      // Parado e sem mouse por perto: desliga o loop até a próxima interação
      if (moving || pointer.on) raf = requestAnimationFrame(step);
      else running = false;
    };

    const run = () => {
      if (reduce) { draw(); return; }
      if (running || !visible || !started) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    wake.current = () => (reduce ? draw() : running ? undefined : run());

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x; pointer.y = p.y; pointer.on = !reduce;
      // A fatia sob o cursor acende a escola correspondente
      const inside = Math.hypot(p.x - cx, p.y - cy) < Math.min(W, H) * 0.48;
      const s = inside ? slices.findIndex((end) => turn(p.x, p.y) <= end + 1e-9) : null;
      if (s !== activeRef.current) { activeRef.current = s; setActive(s); }
      run();
      if (reduce) draw();
    };
    const onLeave = () => {
      pointer.on = false;
      activeRef.current = null; setActive(null);
      run();
      if (reduce) draw();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") onLeave(); });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !started && dots.length) { started = true; t0 = performance.now(); }
      if (visible) run();
    }, { threshold: 0.35 });

    const ro = new ResizeObserver(() => { if (img.complete && img.naturalWidth) { build(); run(); } });

    img.decode().then(() => {
      build();
      io.observe(el); ro.observe(box);
    }).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [schools, total]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        {heading}
        <figure className="mt-8">
          <div ref={wrap} className="relative aspect-square w-full max-w-lg">
            <canvas
              ref={canvas}
              className="absolute inset-0 size-full cursor-crosshair touch-pan-y"
              role="img"
              aria-label={`O emblema da Nine Tails desenhado com ${total.toLocaleString("pt-BR")} pontos, um para cada criança do Nine Learns, divididos pelas cinco escolas.`}
            />
            <p className="pointer-events-none absolute bottom-2 left-2 rounded bg-fg/90 px-2 py-1 font-mono text-xs text-bg">
              <span ref={counter}>0</span> crianças
            </p>
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            Cada ponto é uma criança. Passe o mouse para bagunçar a raposa, ou escolha uma escola para ver a parte dela.
          </figcaption>
        </figure>
      </div>
      <ul className="space-y-2">
        {schools.map((s, i) => (
          <li key={s.name}>
            <button
              type="button"
              onPointerEnter={() => pick(i)}
              onPointerLeave={() => pick(null)}
              onFocus={() => pick(i)}
              onBlur={() => pick(null)}
              aria-pressed={active === i}
              className={cn(
                "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                active === i ? "bg-surface-2" : active !== null && "opacity-50",
              )}
            >
              <span className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-bold">
                  {s.name} <span className="font-normal text-muted">· {s.date}</span>
                </span>
                <span className={cn("heading text-2xl", active === i && "text-accent")}>{s.impact.toLocaleString("pt-BR")}</span>
              </span>
              <span className="mt-2 block h-2 overflow-hidden rounded-full bg-surface-2">
                <span
                  className={cn("block h-full rounded-full transition-colors", active === i ? "bg-accent" : "bg-brand")}
                  style={{ width: `${(s.impact / max) * 100}%` }}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
