"use client";

import { useEffect, useRef } from "react";

type Piece = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; tone: number };

const AUTO_BACK_MS = 2500;
const KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
};

/**
 * O 404 como uma quadra de FRC vista de cima: os números são feitos de peças de jogo e um robô 9219
 * passa empurrando tudo. Sozinho ele roda o autônomo; com mouse, toque ou setas, o visitante assume
 * o teleoperado. As peças voltam para o lugar como se fossem molas. Com "reduzir movimento", fica parado.
 */
export function Field404() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mode = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const loose = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, gap = 6, R = 40, dpr = 1;
    let pieces: Piece[] = [];
    const bot = { x: 0, y: 0, vx: 0, vy: 0, a: 0 };
    const target = { x: 0, y: 0 };
    let teleop = false, lastInput = 0, t0 = performance.now(), raf = 0, visible = true, hudAt = 0;
    const keys = new Set<string>();
    const colors = { fg: "#000", accent: "#f0f", line: "#888", steel: "#cdd6dc", brand: "#90f" };

    const readColors = () => {
      const cs = getComputedStyle(box);
      colors.fg = cs.getPropertyValue("--fg").trim() || colors.fg;
      colors.accent = cs.getPropertyValue("--accent").trim() || colors.accent;
      colors.line = cs.getPropertyValue("--line").trim() || colors.line;
      colors.brand = cs.getPropertyValue("--brand").trim() || colors.brand;
    };

    // Amostra o texto "404" num canvas escondido e transforma cada ponto aceso numa peça
    const build = () => {
      const r = box.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height); dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = W * dpr; el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = Math.max(5, Math.round(W / 150));
      R = Math.max(26, H * 0.11);

      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d")!;
      const family = getComputedStyle(el).fontFamily;
      let size = H * 0.82;
      o.font = `700 ${size}px ${family}`;
      const fit = o.measureText("404").width;
      if (fit > W * 0.82) size *= (W * 0.82) / fit;
      o.font = `700 ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText("404", W / 2, H / 2 + size * 0.04);
      const data = o.getImageData(0, 0, W, H).data;

      const old = pieces;
      pieces = [];
      for (let y = gap / 2; y < H; y += gap)
        for (let x = gap / 2; x < W; x += gap)
          if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 128) {
            const p = old[pieces.length];
            pieces.push({ hx: x, hy: y, x: p?.x ?? x, y: p?.y ?? y, vx: 0, vy: 0, tone: Math.random() });
          }

      if (!bot.x) Object.assign(bot, { x: W * 0.12, y: H * 0.8 });
    };

    const drawField = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      // Zonas das alianças nas pontas e a linha do meio, bem apagadas
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = colors.brand;
      ctx.fillRect(0, 0, W * 0.07, H);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(W * 0.93, 0, W * 0.07, H);
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 10);
      ctx.lineTo(W / 2, H - 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, H * 0.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawPieces = () => {
      const rad = gap * 0.36;
      for (const p of pieces) {
        const off = Math.hypot(p.x - p.hx, p.y - p.hy);
        ctx.fillStyle = off > gap * 1.5 ? colors.fg : p.tone < 0.82 ? colors.accent : colors.steel;
        ctx.globalAlpha = off > gap * 1.5 ? 0.75 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Robô visto de cima: chassi escuro, bumper magenta com o número e a intake na frente
    const drawBot = () => {
      const s = R * 1.25;
      ctx.save();
      ctx.translate(bot.x, bot.y);
      ctx.rotate(bot.a);
      ctx.shadowColor = "rgb(0 0 0 / 0.35)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.16);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#1b0d26";
      ctx.beginPath();
      ctx.roundRect(-s * 0.36, -s * 0.36, s * 0.72, s * 0.72, s * 0.06);
      ctx.fill();
      // Rodas swerve nos cantos
      ctx.fillStyle = colors.steel;
      for (const [cx, cy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        ctx.save();
        ctx.translate(cx * s * 0.22, cy * s * 0.22);
        ctx.rotate(-bot.a + Math.atan2(bot.vy, bot.vx) + Math.PI / 2);
        ctx.fillRect(-s * 0.04, -s * 0.08, s * 0.08, s * 0.16);
        ctx.restore();
      }
      // Intake na frente (sentido do movimento)
      ctx.fillStyle = colors.steel;
      ctx.fillRect(s * 0.36, -s * 0.3, s * 0.1, s * 0.6);
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${s * 0.17}px ${getComputedStyle(el).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.rotate(Math.PI / 2);
      ctx.fillText("9219", 0, s * 0.43);
      ctx.restore();
    };

    const step = (now: number) => {
      const idle = now - lastInput > AUTO_BACK_MS && keys.size === 0;
      if (teleop && idle) {
        teleop = false;
        t0 = now;
      }

      // Teclado: o alvo anda junto com o robô na direção das setas
      if (keys.size) {
        let dx = 0, dy = 0;
        keys.forEach((k) => { dx += KEYS[k][0]; dy += KEYS[k][1]; });
        target.x = bot.x + dx * R * 3;
        target.y = bot.y + dy * R * 3;
        lastInput = now;
      }

      // Autônomo: uma trajetória em oito que atravessa os números
      if (!teleop) {
        const t = (now - t0) / 1000;
        target.x = W / 2 + Math.sin(t * 0.55) * W * 0.42;
        target.y = H / 2 + Math.sin(t * 1.1) * H * 0.3;
      }

      target.x = Math.min(W - R, Math.max(R, target.x));
      target.y = Math.min(H - R, Math.max(R, target.y));
      const max = teleop ? W * 0.018 : W * 0.008;
      let dvx = (target.x - bot.x) * 0.12, dvy = (target.y - bot.y) * 0.12;
      const sp = Math.hypot(dvx, dvy);
      if (sp > max) { dvx *= max / sp; dvy *= max / sp; }
      bot.vx += (dvx - bot.vx) * 0.18;
      bot.vy += (dvy - bot.vy) * 0.18;
      bot.x += bot.vx;
      bot.y += bot.vy;
      if (Math.hypot(bot.vx, bot.vy) > 0.4) {
        const want = Math.atan2(bot.vy, bot.vx);
        let d = want - bot.a;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        bot.a += d * 0.12;
      }

      let out = 0;
      for (const p of pieces) {
        const dx = p.x - bot.x, dy = p.y - bot.y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) {
          const nx = dx / d, ny = dy / d;
          p.x = bot.x + nx * R;
          p.y = bot.y + ny * R;
          p.vx += nx * 1.6 + bot.vx * 0.6;
          p.vy += ny * 1.6 + bot.vy * 0.6;
        }
        p.vx += (p.hx - p.x) * 0.004;
        p.vy += (p.hy - p.y) * 0.004;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy) > gap * 2) out++;
      }

      drawField();
      drawPieces();
      drawBot();

      if (now - hudAt > 120) {
        hudAt = now;
        if (mode.current) mode.current.textContent = teleop ? "Teleoperado" : "Autônomo";
        if (clock.current) {
          const left = Math.max(0, 15 - Math.floor((now - t0) / 1000));
          clock.current.textContent = teleop ? "você no controle" : `0:${String(left).padStart(2, "0")}`;
          if (!teleop && left === 0) t0 = now;
        }
        if (loose.current) loose.current.textContent = String(out);
      }
      if (visible) raf = requestAnimationFrame(step);
    };

    const toLocal = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const steer = (e: PointerEvent) => {
      Object.assign(target, toLocal(e));
      teleop = true;
      lastInput = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.buttons) steer(e);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (!(k in KEYS)) return;
      e.preventDefault();
      keys.add(k);
      teleop = true;
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);

    const init = () => {
      readColors();
      build();
      if (reduce) {
        drawField();
        drawPieces();
        drawBot();
        return;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    let ready = false;
    document.fonts.ready.then(() => {
      ready = true;
      init();
    });

    const ro = new ResizeObserver(() => ready && init());
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && ready && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(box);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", steer);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("blur", () => keys.clear());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", steer);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <figure className="w-full">
      <div ref={wrap} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-surface sm:aspect-[16/7]">
        <canvas
          ref={canvas}
          tabIndex={0}
          role="img"
          aria-label="404. Um robô da Nine Tails empurra as peças que formam o número 404."
          className="heading absolute inset-0 size-full cursor-crosshair touch-pan-y focus-visible:outline-offset-[-4px]"
        />
        {/* Placar, como na transmissão */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-[11px]">
          <span className="rounded bg-fg/90 px-2 py-1 text-bg">
            <span ref={mode}>Autônomo</span> · <span ref={clock}>0:15</span>
          </span>
          <span className="rounded bg-fg/90 px-2 py-1 text-bg">
            Fora do lugar: <span ref={loose}>0</span>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        Assuma o controle: mova o mouse ou toque no campo. No teclado, clique no campo e use as setas.
      </figcaption>
    </figure>
  );
}
