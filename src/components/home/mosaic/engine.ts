/**
 * Motor da abertura em mosaico (canvas 2D, sem dependências).
 *
 * O robô, feito de miniaturas de pôsteres da equipe, entra correndo pela esquerda, freia no centro
 * (as peças de trás se espremem na frenagem) e fica "andando": o braço sobe e desce e solta um
 * rastro de peças. `exit` (0 a 1, ligado à rolagem) faz ele arrancar e sair pela direita.
 *
 * Remix de "Shadowfax", de Kris Puckett (x.com/krispuckett), achado no Designeer.
 */

type G = CanvasRenderingContext2D;
type Pal = { bg: string; bg2?: string; ink: string; fg: string; accent?: string };
type Style = "digits" | "band" | "oval" | "speed" | "bleed" | "blocks";
type Spec = { st: Style; p: Pal; pic: string; h: string[]; sub?: string[] };
type Tile = {
  c: number; r: number; x: number; y: number; v: number; k: number; in0: boolean;
  h1: number; h2: number; h3: number; cur: number;
};
type Pic = { gray: HTMLCanvasElement; soft: HTMLCanvasElement };

export type MosaicOptions = {
  display: string;
  body: string;
};
/** O canvas pode ter qualquer proporção: `resize` recentraliza o robô depois de mudar width/height. */
export type MosaicHandle = { render: (t: number, exit?: number) => void; resize: () => void; destroy: () => void };

const C = 28, R = 17, P = 34, TS = 28;
const BG = "#14071a";

const mk = (w: number, h = w) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eo = (t: number) => 1 - Math.pow(1 - t, 4);
const hash = (a: number, b = 0) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const ctx2d = (c: HTMLCanvasElement) => c.getContext("2d", { willReadFrequently: false }) as G;

/* ---------- paletas: as cores da equipe e as cores das alianças da FRC ---------- */
const PAL = {
  brand: { bg: "#9e19b8", bg2: "#b02bcb", ink: "#4a0061", fg: "#ffffff" },
  light: { bg: "#ffffff", ink: "#1e0726", fg: "#1e0726", accent: "#9e19b8" },
  lightM: { bg: "#ffffff", ink: "#1e0726", fg: "#1e0726", accent: "#de0cc8" },
  dark: { bg: "#4a0061", bg2: "#5c0a78", ink: "#14071a", fg: "#ffffff" },
  red: { bg: "#d8232a", bg2: "#e43b3f", ink: "#2b0606", fg: "#fff5f2" },
  blue: { bg: "#0a5cc2", bg2: "#1a6ad0", ink: "#04193a", fg: "#f2f6ff" },
} satisfies Record<string, Pal>;

/* Só fatos do site: lema, prêmios, robôs e números. */
const SPECS: Spec[] = [
  { st: "digits", p: PAL.brand, pic: "robot", h: ["Evolução constante."] },
  { st: "band", p: PAL.light, pic: "ras", h: ["Rookie", "All Star."], sub: ["Regional Brasil, Brasília.", "Com três meses de equipe."] },
  { st: "oval", p: PAL.dark, pic: "ri", h: ["Rookie Inspiration.", "Houston, 2023."] },
  { st: "speed", p: PAL.blue, pic: "robot", h: ["6 robôs."], sub: ["Do tank drive", "ao swerve."] },
  { st: "bleed", p: PAL.dark, pic: "pharaoh", h: ["Pharaoh.", "2026, Rebuilt."] },
  { st: "blocks", p: PAL.light, pic: "answer", h: ["The Answer.", "Feito em menos de um mês."] },
  { st: "digits", p: PAL.red, pic: "arak", h: ["L4 no autônomo."] },
  { st: "oval", p: PAL.brand, pic: "impacto", h: ["Prêmio de Impacto.", "Cuiabá, 2024."] },
  { st: "speed", p: PAL.red, pic: "robot", h: ["122 partidas."], sub: ["Todas no", "The Blue Alliance."] },
  { st: "band", p: PAL.lightM, pic: "equipe", h: ["Nine", "Learns."], sub: ["6.222 crianças em 5 escolas", "públicas de Resende."] },
];

/* ---------- silhueta do robô em grade ---------- */
function poseMask(angle: number, bob: number) {
  const u = 12, c = mk(C * u, R * u), g = ctx2d(c);
  g.scale(u, u); g.translate(0, bob); g.fillStyle = "#000"; g.strokeStyle = "#000";
  g.beginPath(); g.roundRect(1.4, 12.9, 14.4, 3.3, 0.8); g.fill();          // base com bumper
  g.fillRect(2.6, 16, 2.4, 0.9); g.fillRect(12, 16, 2.4, 0.9);              // rodas
  g.fillRect(3, 1, 2.2, 12); g.fillRect(2.4, 0.4, 3.6, 1.6);                // torre
  g.lineWidth = 1.25; g.beginPath(); g.moveTo(5, 1.6); g.lineTo(13.8, 13.2); g.stroke(); // diagonal
  g.fillRect(5, 10, 6, 3);                                                   // eletrônica
  const a = (angle * Math.PI) / 180, px = 6.2, py = 11.6, len = 16.5;
  const tx = px + Math.cos(a) * len, ty = py - Math.sin(a) * len;
  g.lineWidth = 2.9; g.beginPath(); g.moveTo(px, py); g.lineTo(tx, ty); g.stroke(); // braço
  g.save(); g.translate(tx, ty); g.rotate(-a); g.fillRect(-1.6, -1.8, 2.2, 3.6);
  g.rotate(0.62); g.scale(1.2, 1.2);                                         // cone do Charged Up
  g.beginPath(); g.moveTo(0.3, -0.7); g.lineTo(0.3, 0.7); g.lineTo(4.4, 2.3); g.lineTo(4.4, -2.3); g.closePath(); g.fill();
  g.fillRect(4.1, -2.8, 0.9, 5.6); g.restore();
  const d = g.getImageData(0, 0, c.width, c.height).data, set = new Set<number>();
  for (let r = 0; r < R; r++) for (let col = 0; col < C; col++) {
    let n = 0;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const x = Math.floor((col + (i + 0.5) / 4) * u), y = Math.floor((r + (j + 0.5) / 4) * u);
      if (d[(y * c.width + x) * 4 + 3] > 0) n++;
    }
    if (n >= 7) set.add(r * C + col);
  }
  return set;
}

export function createMosaic(canvas: HTMLCanvasElement, images: Record<string, HTMLImageElement>, opt: MosaicOptions): MosaicHandle {
  const ctx = ctx2d(canvas);
  const DISPLAY = opt.display, BODY = opt.body;
  const hasLS = "letterSpacing" in ctx;

  /** Texto do pôster; encolhe a fonte até caber em 652px (a largura útil do pôster de 720). */
  function T(g: G, s: string, x: number, y: number, size: number, w: number, col: string, align: CanvasTextAlign = "left", ls = 0, font = DISPLAY, upper = true, maxW = 652) {
    g.font = `${w} ${size}px ${font}`;
    const width = g.measureText(upper ? s.toUpperCase() : s).width;
    if (width > maxW) g.font = `${w} ${Math.floor((size * maxW) / width)}px ${font}`;
    g.fillStyle = col; g.textAlign = align; g.textBaseline = "alphabetic";
    if (hasLS) (g as G & { letterSpacing: string }).letterSpacing = ls + "px";
    g.fillText(upper ? s.toUpperCase() : s, x, y);
    if (hasLS) (g as G & { letterSpacing: string }).letterSpacing = "0px";
  }

  const POSES = ([[24, 0], [30, 0.3], [36, 0], [30, -0.3]] as const).map((p) => poseMask(p[0], p[1]));
  const pose0 = [...POSES[0]].map((k) => [k % C, Math.floor(k / C)] as const);

  /* ---------- fotos: versão em cinza (quadrada) e versão com borda esfumada ---------- */
  const PICS: Record<string, Pic> = {};
  for (const [key, img] of Object.entries(images)) {
    // as fotos só viram miniaturas de 128px: 160px de origem bastam (e a conversão fica leve)
    const N = 160, gray = mk(N), g = ctx2d(gray);
    const s = Math.max(N / img.naturalWidth, N / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    g.drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
    const id = g.getImageData(0, 0, N, N), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      let l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      l = clamp((l - 128) * 1.28 + 138, 0, 255);
      d[i] = d[i + 1] = d[i + 2] = l;
    }
    g.putImageData(id, 0, 0);
    const soft = mk(N), sg = ctx2d(soft);
    sg.drawImage(gray, 0, 0);
    sg.globalCompositeOperation = "destination-in";
    const gr = sg.createRadialGradient(N / 2, N / 2, N * 0.14, N / 2, N / 2, N * 0.52);
    gr.addColorStop(0, "#000"); gr.addColorStop(0.62, "#000"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sg.fillStyle = gr; sg.fillRect(0, 0, N, N);
    PICS[key] = { gray, soft };
  }
  const n = mk(160), ng = ctx2d(n), nd = ng.createImageData(160, 160);
  for (let i = 0; i < nd.data.length; i += 4) { const v = 90 + Math.random() * 80; nd.data[i] = nd.data[i + 1] = nd.data[i + 2] = v; nd.data[i + 3] = 255; }
  ng.putImageData(nd, 0, 0);
  const NOISE = ctx.createPattern(n, "repeat") as CanvasPattern;

  const pic = (g: G, key: string, soft: boolean, x: number, y: number, w: number, mode: GlobalCompositeOperation = "source-over", alpha = 1) => {
    const p = PICS[key]; if (!p) return;
    g.save(); g.globalCompositeOperation = mode; g.globalAlpha = alpha; g.drawImage(soft ? p.soft : p.gray, x, y, w, w); g.restore();
  };
  const logo = (g: G, x: number, y: number, col: string, u = 1.5) => { g.fillStyle = col; for (const [c, r] of pose0) g.fillRect(x + c * u * 1.25, y + r * u * 1.25, u, u); };
  const header = (g: G, p: Pal) => {
    logo(g, 36, 30, p.fg, 1.5);
    T(g, "Nine Tails #9219", 36 + C * 1.9 + 12, 58, 26, 700, p.fg, "left", 0.5);
    g.globalAlpha = 0.72; T(g, "ninetails9219.com.br", 684, 56, 15, 600, p.fg, "right", 0.2, BODY, false); g.globalAlpha = 1;
  };

  function drawPoster(g: G, sp: Spec, lt: number, at: number) {
    const p = sp.p; g.save(); g.fillStyle = p.bg; g.fillRect(0, 0, 720, 720);
    if (sp.st === "digits") {
      const k = 1 + 0.12 * (1 - eo(clamp(lt / 0.55)));
      g.save(); g.translate(360, 420); g.scale(k, k); T(g, "9219", 0, 120, 380, 700, p.ink, "center", -6); g.restore();
      const x = 160 + Math.sin(at * 2.2) * 6;
      for (let i = 9; i >= 1; i--) pic(g, sp.pic, true, x - i * 28, 130, 520, "luminosity", 0.1);
      pic(g, sp.pic, true, x, 130, 520, "luminosity");
      header(g, p);
      T(g, sp.h[0], 34, 680, 92, 700, p.fg, "left", 0);
    } else if (sp.st === "band") {
      T(g, sp.h[0], 34, 138, 118, 700, p.ink); T(g, sp.h[1], 34, 248, 118, 700, p.ink);
      T(g, sp.sub![0], 36, 298, 26, 700, p.ink, "left", 0, BODY, false); T(g, sp.sub![1], 36, 332, 26, 700, p.ink, "left", 0, BODY, false);
      g.fillStyle = p.accent!;
      for (let col = 0; col < 36; col++) for (let row = 0; row < 11; row++) {
        let show = col < lt * 70; if (col > 22) show = show && hash(col, row) < (36 - col) / 14;
        if (show) g.fillRect(col * 20 + 2, 362 + row * 20 + 2, 16, 16);
      }
      pic(g, sp.pic, true, 190 + Math.sin(at * 2) * 5, 300, 470, "multiply");
      logo(g, 36, 640, p.ink, 1.5); T(g, "Nine Tails #9219", 36 + C * 1.9 + 12, 678, 26, 700, p.ink, "left", 0.5);
    } else if (sp.st === "oval") {
      const rv = eo(clamp(lt / 0.6)), sc = 0.88 + 0.12 * rv;
      g.save(); g.translate(360, 300); g.scale(sc, sc); g.globalAlpha = 0.3 + 0.7 * rv;
      g.beginPath(); g.ellipse(0, 0, 178, 222, 0, 0, Math.PI * 2); g.fillStyle = p.bg2!; g.fill();
      g.save(); g.clip(); pic(g, sp.pic, false, -232 + Math.sin(at * 1.6) * 4, -232, 464, "luminosity"); g.restore();
      g.strokeStyle = p.fg; g.lineWidth = 3; g.stroke();
      g.globalAlpha *= 0.55; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, 0, 190, 234, 0, 0, Math.PI * 2); g.stroke();
      g.restore();
      header(g, p);
      T(g, sp.h[0], 34, 618, 70, 700, p.fg); T(g, sp.h[1], 34, 690, 70, 700, p.fg);
    } else if (sp.st === "speed") {
      const lines = (cnt: number, a: number, thin: boolean) => {
        g.fillStyle = p.fg;
        for (let i = 0; i < cnt; i++) {
          const h1 = hash(i, 1), h2 = hash(i, 2), h3 = hash(i, 3), h4 = hash(i, 4);
          const y = 110 + h1 * 500, len = 180 + h2 * 380, th = (thin ? 1 : 2) + h3 * (thin ? 2 : 5);
          const x = (((h4 * 1400 - at * 900 * (0.6 + h1)) % 1400) + 1400) % 1400 - 300;
          g.globalAlpha = a * (0.5 + h3 * 0.5); g.fillRect(x, y, len, th);
        }
        g.globalAlpha = 1;
      };
      lines(46, 0.5, false);
      pic(g, sp.pic, true, 170, 170, 520, "luminosity");
      lines(12, 0.85, true);
      header(g, p);
      T(g, sp.h[0], 32, 250, 190, 700, p.fg, "left", -2);
      T(g, sp.sub![0], 686, 628, 46, 700, p.fg, "right"); T(g, sp.sub![1], 686, 680, 46, 700, p.fg, "right");
    } else if (sp.st === "bleed") {
      pic(g, sp.pic, false, -40 + Math.sin(at * 1.4) * 6, 0, 800);
      let gr = g.createLinearGradient(0, 360, 0, 720); gr.addColorStop(0, "rgba(74,0,97,0)"); gr.addColorStop(0.75, p.bg); gr.addColorStop(1, p.bg);
      g.fillStyle = gr; g.fillRect(0, 360, 720, 360);
      gr = g.createLinearGradient(0, 0, 0, 130); gr.addColorStop(0, "rgba(74,0,97,.8)"); gr.addColorStop(1, "rgba(74,0,97,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 720, 130);
      header(g, p);
      T(g, sp.h[0], 34, 590, 104, 700, p.fg); T(g, sp.h[1], 34, 684, 104, 700, p.fg);
    } else if (sp.st === "blocks") {
      g.fillStyle = p.accent!;
      for (let i = 0; i < 26; i++) {
        const h1 = hash(i, 7), h2 = hash(i, 8), h3 = hash(i, 9), h4 = hash(i, 10);
        const s = (26 + h2 * 70) * eo(clamp(lt * 2.2 - h4 * 1.2)); if (s <= 0) continue;
        g.fillRect(60 + h1 * 560 - s / 2, 150 + h3 * 330 - s / 2, s, s);
      }
      pic(g, sp.pic, true, 150 + Math.sin(at * 2) * 5, 120, 460, "multiply");
      header(g, p);
      T(g, sp.h[0], 34, 618, 80, 700, p.ink); T(g, sp.h[1], 34, 690, 52, 700, p.ink);
    }
    g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.16; g.fillStyle = NOISE; g.fillRect(0, 0, 720, 720);
    g.restore();
  }

  /* ---------- miniaturas de 128px com canto arredondado ---------- */
  const THUMB: HTMLCanvasElement[] = SPECS.map((sp) => {
    const t = mk(128), tg = ctx2d(t); tg.beginPath(); tg.roundRect(0, 0, 128, 128, 27); tg.clip();
    tg.scale(128 / 720, 128 / 720); drawPoster(tg, sp, 10, 0);
    return t;
  });
  // as fotos tratadas só servem para montar as miniaturas: solta a memória delas
  for (const key of Object.keys(PICS)) { PICS[key].gray.width = 0; PICS[key].soft.width = 0; delete PICS[key]; }

  /* ---------- peças do mosaico, com a silhueta centralizada no quadro ---------- */
  const keys = new Set<number>(); POSES.forEach((set) => set.forEach((k) => keys.add(k)));
  let minC = C, maxC = 0, minR = R, maxR = 0;
  for (const k of keys) { const c = k % C, r = Math.floor(k / C); minC = Math.min(minC, c); maxC = Math.max(maxC, c); minR = Math.min(minR, r); maxR = Math.max(maxR, r); }
  // RUN: distância de fora da tela até o centro
  let W = canvas.width, H = canvas.height, OX = 0, OY = 0, BASEY = 0, RUN = 0;
  let FLOOR: CanvasGradient | null = null; // degradê do chão, refeito só quando o tamanho muda
  const TILES: Tile[] = [...keys].map((k) => {
    const c = k % C, r = Math.floor(k / C), rf = r / R, h = hash(c, r);
    const pool = rf < 0.38 ? [1, 5, 9, 4, 2] : rf < 0.62 ? [0, 1, 2, 3, 5, 7, 9] : [0, 3, 6, 7, 8];
    return {
      c, r, x: 0, y: 0, v: pool[Math.floor(h * pool.length)], k, in0: POSES[0].has(k),
      h1: hash(c + 3, r), h2: hash(c, r + 5), h3: hash(c + 9, r + 2), cur: POSES[0].has(k) ? 1 : 0,
    };
  });
  /** Centraliza a silhueta no canvas. */
  function layout() {
    W = canvas.width; H = canvas.height;
    OX = W / 2 - ((minC + maxC + 1) / 2) * P + (P - TS) / 2;
    OY = H / 2 - ((minR + maxR + 1) / 2) * P + (P - TS) / 2 + 10; // um pouco abaixo do centro: o título fica em cima
    BASEY = OY + (maxR + 1) * P;
    RUN = W / 2 + 700;
    FLOOR = ctx.createLinearGradient(0, BASEY, 0, BASEY + 230); FLOOR.addColorStop(0, "rgba(20,7,26,.35)"); FLOOR.addColorStop(1, BG);
    for (const tl of TILES) { tl.x = OX + tl.c * P; tl.y = OY + tl.r * P; }
  }
  layout();
  const LEFT: [number, number][] = [];
  for (let r = 0; r < R; r++) { let m = 99; for (const [c, rr] of pose0) if (rr === r && c < m) m = c; if (m < 99) LEFT.push([r, m]); }

  /* ---------- desenho ---------- */
  const ENTER = 1.6; // duração da corrida de entrada
  let AM = 1, lastT = -1;

  const updateCur = (poseIdx: number, dt: number) => {
    const snap = dt < 0 || dt > 0.2, k = 1 - Math.exp(-dt * 28);
    for (const tl of TILES) { const target = POSES[poseIdx].has(tl.k) ? 1 : 0; tl.cur = snap ? target : lerp(tl.cur, target, k); }
  };
  const eIn = (q: number) => q * q * q;

  /** Deslocamento e esticão horizontal de cada coluna: entrada com frenagem e saída com arrancada. */
  function motion(c: number, t: number, exit: number) {
    const lag = (C - 1 - c) * 0.012;                      // a traseira chega depois: espreme na frenagem
    const pin = clamp((t - lag) / ENTER), ein = eo(pin);
    const qo = clamp((exit - (C - 1 - c) * -0.004) * 1.15); // a frente sai antes
    const eout = eIn(qo);
    const dx = -RUN * (1 - ein) + RUN * 1.2 * eout;
    const speed = 4 * Math.pow(1 - pin, 3) + 3 * qo * qo;  // velocidade aproximada, para o esticão
    return { dx, stretch: 1 + speed * 0.9 };
  }

  function drawTiles(g: G, t: number, exit: number) {
    for (const tl of TILES) {
      if (tl.cur < 0.02) continue;
      const { dx, stretch } = motion(tl.c, t, exit);
      const bob = Math.sin(t * 22 + tl.c * 0.55) * 1.4, sz = TS * tl.cur, w = sz * stretch;
      const x = tl.x + dx + (TS - sz) / 2;
      g.globalAlpha = AM; g.drawImage(THUMB[tl.v], x + sz - w, tl.y + (TS - sz) / 2 + bob, w, sz);
    }
    g.globalAlpha = AM;
  }
  function drawTrail(g: G, t: number, amt: number, exit: number) {
    if (amt <= 0) return;
    for (let i = 0; i < 40; i++) {
      const [r, m] = LEFT[i % LEFT.length], ph = (((t * 0.9 + hash(i, 4)) % 1) + 1) % 1;
      const { dx } = motion(m, t, exit);
      const sz = TS * (0.85 - 0.7 * ph), x = OX + m * P + dx - 14 - ph * 400, y = OY + r * P + (TS - sz) / 2 + (hash(i, 6) - 0.5) * 14;
      g.globalAlpha = (1 - ph) * 0.85 * amt; g.drawImage(THUMB[[0, 3, 6, 7, 8][i % 5]], x, y, sz * (1 + ph * 0.6), sz);
    }
    g.globalAlpha = 1;
  }

  function render(t: number, exit = 0) {
    const dt = lastT < 0 ? 1 : t - lastT; lastT = t;
    // correndo, o braço fica baixo; parado no centro, começa a subir e descer
    updateCur(t < ENTER ? 0 : Math.floor((t - ENTER) * 7) % 4, dt);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, 2 * BASEY); ctx.scale(1, -1); AM = 0.14; drawTiles(ctx, t, exit); AM = 1; ctx.restore();
    ctx.fillStyle = FLOOR!; ctx.fillRect(0, BASEY, W, H - BASEY);
    // rastro: forte na corrida e na arrancada, leve parado
    const pin = clamp(t / ENTER);
    drawTrail(ctx, t, 0.55 + 0.45 * Math.max(1 - pin, clamp(exit * 3)), exit);
    drawTiles(ctx, t, exit);
  }

  return { render, resize: layout, destroy: () => { for (const t of THUMB) t.width = 0; } };
}
