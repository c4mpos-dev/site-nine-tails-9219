/**
 * Motor do robô em mosaico (canvas 2D, sem dependências).
 *
 * O Tank Tails, montado com fotos da equipe e dos robôs, entra correndo pela esquerda, freia no centro
 * (as peças de trás se espremem na frenagem) e fica "andando": o braço sobe e desce e solta um
 * rastro de peças. `exit` (0 a 1, ligado à rolagem) faz ele arrancar e sair pela direita.
 *
 * Cada foto ganha uma edição: duotone roxo da raposa, retícula magenta, cor saturada com vinheta ou
 * preto e branco de jornal. O bumper usa as fotos dos robôs na cor da aliança, que troca a cada "partida".
 *
 * Tour: de tempos em tempos a câmera mergulha numa peça até ela ocupar a tela, uma cortina revela a
 * foto original por baixo da edição, a legenda aparece e a câmera volta para o robô, que segue andando.
 * Clicar numa peça abre ela na hora; clicar de novo fecha.
 *
 * Remix de "Shadowfax", de Kris Puckett (x.com/krispuckett), achado no Designeer.
 */

type G = CanvasRenderingContext2D;
type Look = "brand" | "halftone" | "pop" | "ink" | "red" | "blue";
type Variant = {
  big: HTMLCanvasElement; thumb: HTMLCanvasElement; img: HTMLImageElement; caption: string; look: Look; photo: number;
  /** Versão grande, carregada só quando a foto vai ser aberta. */
  hiBig?: HTMLCanvasElement; hiImg?: HTMLImageElement; loading?: boolean;
};
type Tile = { c: number; r: number; x: number; y: number; k: number; cur: number; v: number; bumper: number };
type Phase = "walk" | "in" | "hold" | "out";

/** `img` é a miniatura usada nas peças; `hi` é o endereço da foto grande, para quando ela abre na tela. */
export type MosaicPhoto = { img: HTMLImageElement; hi?: string; caption: string; robot?: boolean };
export type MosaicOptions = {
  body: string;
  /** Liga o tour automático (desligado com "reduzir movimento"). */
  tour: boolean;
  /** Avisa quando a câmera entra (true) ou começa a sair (false) de uma foto: o painel por cima some e volta. */
  onFocus?: (focused: boolean) => void;
};
/** O canvas pode ter qualquer proporção: `resize` recentraliza o robô depois de mudar width/height. */
export type MosaicHandle = {
  /** Avança `dt` segundos e desenha. */
  frame: (dt: number, exit?: number) => void;
  /** Redesenha sem avançar o tempo (rolagem com a animação pausada, mudança de tamanho). */
  render: (exit?: number) => void;
  resize: () => void;
  /** Clique em coordenadas do canvas: abre a peça sob o ponto, ou fecha a foto aberta. Devolve true se fez algo. */
  click: (x: number, y: number) => boolean;
  /** Põe o robô parado no lugar, já montado (para "reduzir movimento"). */
  still: () => void;
  destroy: () => void;
};

const C = 28, R = 17, P = 34, TS = 28;
const BG = "#f8f3fa";
/** Fundo das peças em retícula: o roxo da equipe, para a peça não sumir no fundo claro. */
const HALF_BG = "#6a117b";
/** BIG: lado das peças perto da câmera; HI: lado da foto aberta (ela ocupa ~60% de 1080). */
const BIG = 384, HI = 768, THUMB = 64;
/** Linhas da grade que formam a base com bumper (as rodas ficam logo abaixo). */
const BUMPER_ROWS = [13, 14, 15];
/** Tempos do tour, em segundos. */
const WALK = 3.4, IN = 1.5, HOLD = 3.6, OUT = 1.2;
/** Na foto aberta, a peça ocupa esta fração da altura do quadro. */
const FILL = 0.6;

const mk = (w: number, h = w) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eo = (t: number) => 1 - Math.pow(1 - t, 4);
const hash = (a: number, b = 0) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const ctx2d = (c: HTMLCanvasElement) => c.getContext("2d", { willReadFrequently: true }) as G;
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/* ---------- as edições ---------- */
/** Mapa de gradiente em três paradas: sombra, meio-tom e luz. */
const DUO: Record<"brand" | "ink" | "red" | "blue", [string, string, string]> = {
  brand: ["#1e0726", "#9e19b8", "#ffd9f8"],
  ink: ["#0d0711", "#5e5266", "#f6f1f7"],
  red: ["#2b0606", "#d8232a", "#ffe6df"],
  blue: ["#04193a", "#0a5cc2", "#e0edff"],
};
/** Ordem das edições nas fotos do corpo; o bumper usa só vermelho e azul. */
const BODY_LOOKS: Look[] = ["brand", "pop", "halftone", "brand", "ink", "pop"];

function cover(img: HTMLImageElement, n: number) {
  const c = mk(n), g = ctx2d(c);
  const s = Math.max(n / img.naturalWidth, n / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  g.drawImage(img, (n - w) / 2, (n - h) / 2, w, h);
  return c;
}

function edit(img: HTMLImageElement, look: Look, n = BIG) {
  const c = cover(img, n), g = ctx2d(c);
  const id = g.getImageData(0, 0, n, n), d = id.data;
  const f = n / BIG; // a retícula, o filete e as linhas crescem junto com a foto
  const lum = (i: number) => (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;

  if (look === "halftone") {
    // Retícula: pontos lilás do tamanho da luz, sobre o roxo da equipe
    const L = new Float32Array(n * n);
    for (let i = 0; i < L.length; i++) L[i] = lum(i * 4);
    g.fillStyle = HALF_BG; g.fillRect(0, 0, n, n);
    const step = 7 * f;
    g.fillStyle = "#e8c6f0";
    for (let y = 0, row = 0; y < n; y += step, row++) for (let x = row % 2 ? step / 2 : 0; x < n; x += step) {
      const v = L[Math.min(n - 1, Math.floor(y + step / 2)) * n + Math.min(n - 1, Math.floor(x + step / 2))];
      const r = Math.sqrt(clamp((v - 0.08) * 1.25)) * step * 0.62;
      if (r < 0.4) continue;
      g.beginPath(); g.arc(x + step / 2, y + step / 2, r, 0, Math.PI * 2); g.fill();
    }
    return c;
  }

  if (look === "pop") {
    // Cor real, mais saturada e com contraste; depois uma vinheta roxa e um filete rosa
    for (let i = 0; i < d.length; i += 4) {
      const l = lum(i) * 255;
      for (let k = 0; k < 3; k++) d[i + k] = clamp((l + (d[i + k] - l) * 1.4 - 128) * 1.12 + 132, 0, 255);
    }
    g.putImageData(id, 0, 0);
    const v = g.createRadialGradient(n / 2, n / 2, n * 0.3, n / 2, n / 2, n * 0.72);
    v.addColorStop(0, "rgba(74,0,97,0)"); v.addColorStop(1, "rgba(74,0,97,.75)");
    g.fillStyle = v; g.fillRect(0, 0, n, n);
    g.strokeStyle = "rgba(181,88,199,.9)"; g.lineWidth = 6 * f; g.strokeRect(10 * f, 10 * f, n - 20 * f, n - 20 * f);
    return c;
  }

  // Duotone (e o preto e branco de jornal, que é um duotone neutro com mais contraste)
  const [a, b, w] = DUO[look].map(rgb);
  const k = look === "ink" ? 1.45 : 1.2;
  for (let i = 0; i < d.length; i += 4) {
    const l = clamp((lum(i) - 0.5) * k + 0.52);
    const [p, q, t] = l < 0.5 ? [a, b, l * 2] : [b, w, (l - 0.5) * 2];
    d[i] = lerp(p[0], q[0], t); d[i + 1] = lerp(p[1], q[1], t); d[i + 2] = lerp(p[2], q[2], t);
  }
  g.putImageData(id, 0, 0);
  if (look === "ink") {
    // linhas finas de impressão por cima
    g.fillStyle = "rgba(0,0,0,.16)";
    for (let y = 0; y < n; y += 3 * f) g.fillRect(0, y, n, f);
  }
  return c;
}

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

export function createMosaic(canvas: HTMLCanvasElement, photos: MosaicPhoto[], opt: MosaicOptions): MosaicHandle {
  const ctx = canvas.getContext("2d") as G;

  /* ---------- variantes: cada foto com a sua edição; as dos robôs também em vermelho e azul ---------- */
  const variant = (p: MosaicPhoto, look: Look, photo: number): Variant => {
    const big = edit(p.img, look);
    const thumb = mk(THUMB), tg = ctx2d(thumb);
    tg.beginPath(); tg.roundRect(0, 0, THUMB, THUMB, 13); tg.clip();
    tg.drawImage(big, 0, 0, THUMB, THUMB);
    return { big, thumb, img: p.img, caption: p.caption, look, photo };
  };
  const VARS: Variant[] = photos.map((p, i) => variant(p, BODY_LOOKS[i % BODY_LOOKS.length], i));
  const robotsOnly = photos.map((p, i) => [p, i] as const).filter(([p]) => p.robot);
  const pool = robotsOnly.length ? robotsOnly : photos.map((p, i) => [p, i] as const);
  const RED = pool.map(([p, i]) => VARS.push(variant(p, "red", i)) - 1);
  const BLUE = pool.map(([p, i]) => VARS.push(variant(p, "blue", i)) - 1);
  let ally = 0; // 0 vermelha, 1 azul

  const POSES = ([[24, 0], [30, 0.3], [36, 0], [30, -0.3]] as const).map((p) => poseMask(p[0], p[1]));
  const pose0 = [...POSES[0]].map((k) => [k % C, Math.floor(k / C)] as const);

  /* ---------- peças do mosaico, com a silhueta centralizada no quadro ---------- */
  const keys = new Set<number>(); POSES.forEach((set) => set.forEach((k) => keys.add(k)));
  let minC = C, maxC = 0, minR = R, maxR = 0;
  for (const k of keys) { const c = k % C, r = Math.floor(k / C); minC = Math.min(minC, c); maxC = Math.max(maxC, c); minR = Math.min(minR, r); maxR = Math.max(maxR, r); }
  // RUN: distância de fora da tela até o centro; RATIO: pixels do canvas por pixel da tela
  let W = canvas.width, H = canvas.height, OX = 0, OY = 0, RUN = 0, RATIO = 1, MARGIN = 48;
  const body = photos.length;
  const TILES: Tile[] = [...keys].map((k) => {
    const c = k % C, r = Math.floor(k / C);
    return {
      c, r, x: 0, y: 0, k, cur: POSES[0].has(k) ? 1 : 0,
      v: Math.floor(hash(c, r) * body),
      bumper: BUMPER_ROWS.includes(r) ? Math.floor(hash(c + 1, r + 7) * RED.length) : -1,
    };
  });
  const look = (tl: Tile) => (tl.bumper < 0 ? tl.v : (ally ? BLUE : RED)[tl.bumper]);

  /** Centraliza a silhueta no canvas e acompanha a margem do conteúdo da página (max-w-6xl). */
  function layout() {
    W = canvas.width; H = canvas.height;
    OX = W / 2 - ((minC + maxC + 1) / 2) * P + (P - TS) / 2;
    OY = H / 2 - ((minR + maxR + 1) / 2) * P + (P - TS) / 2 + 10; // um pouco abaixo do centro: o título fica em cima
    RUN = W / 2 + 700;
    const css = canvas.getBoundingClientRect().width || W;
    RATIO = W / css;
    MARGIN = Math.max(16, (css - 1152) / 2 + 24) * RATIO;
    for (const tl of TILES) { tl.x = OX + tl.c * P; tl.y = OY + tl.r * P; }
  }
  layout();
  const LEFT: [number, number][] = [];
  for (let r = 0; r < R; r++) { let m = 99; for (const [c, rr] of pose0) if (rr === r && c < m) m = c; if (m < 99) LEFT.push([r, m]); }

  /* ---------- roteiro do tour: uma peça por foto, sempre visível em todas as poses, em ordem embaralhada ---------- */
  const steady = TILES.filter((tl) => tl.bumper < 0 && POSES.every((ps) => ps.has(tl.k)));
  const byPhoto = new Map<number, Tile>();
  for (const tl of steady) if (!byPhoto.has(tl.v) || hash(tl.c, tl.r + 3) > 0.5) byPhoto.set(tl.v, tl);
  const ORDER = [...byPhoto.values()].sort((a, b) => hash(a.v, 11) - hash(b.v, 11));
  let next = 0;

  /* ---------- estado ---------- */
  const ENTER = 1.6; // duração da corrida de entrada
  let t = 0, exit = 0, phase: Phase = "walk", p = 0, first = true;
  let focus: Tile | null = null;

  const eio = (q: number) => (q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2);
  const eIn = (q: number) => q * q * q;
  const setPhase = (ph: Phase, at = 0) => {
    const was = phase;
    phase = ph; p = at;
    if (ph === "in" && was === "walk") opt.onFocus?.(true);
    if (ph === "out" || (ph === "walk" && (was === "in" || was === "hold"))) opt.onFocus?.(false);
  };
  /** Quanto a câmera está mergulhada na peça: 0 no robô inteiro, 1 com a foto na tela. */
  const depth = () => (phase === "in" ? eio(clamp(p / IN)) : phase === "hold" ? 1 : phase === "out" ? 1 - eio(clamp(p / OUT)) : 0);

  const updateCur = (poseIdx: number, dt: number) => {
    const snap = dt < 0 || dt > 0.2, k = 1 - Math.exp(-dt * 28);
    for (const tl of TILES) { const target = POSES[poseIdx].has(tl.k) ? 1 : 0; tl.cur = snap ? target : lerp(tl.cur, target, k); }
  };

  /** Deslocamento e esticão horizontal de cada coluna: entrada com frenagem e saída com arrancada. */
  function motion(c: number) {
    const lag = (C - 1 - c) * 0.012;                      // a traseira chega depois: espreme na frenagem
    const pin = clamp((t - lag) / ENTER), ein = eo(pin);
    const qo = clamp((exit - (C - 1 - c) * -0.004) * 1.15); // a frente sai antes
    const eout = eIn(qo);
    const dx = -RUN * (1 - ein) + RUN * 1.2 * eout;
    const speed = 4 * Math.pow(1 - pin, 3) + 3 * qo * qo;  // velocidade aproximada, para o esticão
    return { dx, stretch: 1 + speed * 0.9 };
  }
  const bobOf = (tl: Tile) => Math.sin(t * 22 + tl.c * 0.55) * 1.4;

  /* ---------- câmera: tela = T + s · (mundo − f), com f no centro da peça em foco ---------- */
  let S = 1, FX = 0, FY = 0, TX = 0, TY = 0;
  function camera() {
    const k = depth();
    if (!focus || k === 0) { S = 1; FX = TX = 0; FY = TY = 0; return 0; }
    // um zoom lento enquanto a foto fica na tela
    const kb = phase === "hold" ? 1 + 0.03 * (p / HOLD) : phase === "out" ? 1 + 0.03 * k : 1;
    S = Math.pow((H * FILL) / TS, k) * kb;
    FX = focus.x + motion(focus.c).dx + TS / 2; FY = focus.y + TS / 2 + bobOf(focus);
    TX = lerp(FX, W / 2, k); TY = lerp(FY, H / 2 - H * 0.03, k);
    return k;
  }
  const sx = (x: number) => TX + S * (x - FX);
  const sy = (y: number) => TY + S * (y - FY);

  // canto arredondado: proporcional na miniatura, contido na foto grande
  const corner = (size: number) => Math.min(size * 0.2, 28 * RATIO + size * 0.02);

  /** Desenha uma peça (ou um pedaço do rastro) num retângulo do mundo; perto da câmera usa a foto grande. */
  function piece(v: Variant, x: number, y: number, w: number, h: number) {
    const X = sx(x), Y = sy(y), Wd = w * S, Hd = h * S;
    if (X > W || Y > H || X + Wd < 0 || Y + Hd < 0) return;
    if (Hd < 90) { ctx.drawImage(v.thumb, X, Y, Wd, Hd); return; }
    ctx.save(); ctx.beginPath(); ctx.roundRect(X, Y, Wd, Hd, corner(Hd)); ctx.clip(); ctx.drawImage(Hd > BIG && v.hiBig ? v.hiBig : v.big, X, Y, Wd, Hd); ctx.restore();
  }

  function drawTiles(k: number, alpha: number) {
    for (const tl of TILES) {
      if (tl.cur < 0.02) continue;
      const { dx, stretch } = motion(tl.c);
      const sz = TS * tl.cur, w = sz * stretch;
      const x = tl.x + dx + (TS - sz) / 2 + sz - w;
      const y = tl.y + (TS - sz) / 2 + bobOf(tl);
      // com a câmera dentro de uma foto, as vizinhas recuam
      ctx.globalAlpha = alpha * (focus && tl !== focus ? 1 - 0.8 * k : 1);
      piece(VARS[look(tl)], x, y, w, sz);
    }
    ctx.globalAlpha = 1;
  }
  function drawTrail(amt: number) {
    if (amt <= 0.01) return;
    for (let i = 0; i < 40; i++) {
      const [r, m] = LEFT[i % LEFT.length], ph = (((t * 0.9 + hash(i, 4)) % 1) + 1) % 1;
      const { dx } = motion(m);
      const sz = TS * (0.85 - 0.7 * ph), x = OX + m * P + dx - 14 - ph * 400, y = OY + r * P + (TS - sz) / 2 + (hash(i, 6) - 0.5) * 14;
      ctx.globalAlpha = (1 - ph) * 0.85 * amt;
      piece(VARS[Math.floor(hash(i, 9) * body)], x, y, sz * (1 + ph * 0.6), sz);
    }
    ctx.globalAlpha = 1;
  }

  /** A foto em foco: a edição por cima e, numa cortina que corre da esquerda, a foto original por baixo. */
  function drawReveal(k: number) {
    if (!focus || k < 0.5) return;
    const reveal = phase === "hold" ? eio(clamp((p - 0.35) / 1.1)) : phase === "out" ? 1 : 0;
    if (reveal <= 0) return;
    const v = VARS[look(focus)], img = v.hiImg ?? v.img;
    const X = sx(focus.x + motion(focus.c).dx), Y = sy(focus.y + bobOf(focus)), D = TS * S;
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.save();
    ctx.globalAlpha = phase === "out" ? k : 1;
    ctx.beginPath(); ctx.roundRect(X, Y, D, D, corner(D)); ctx.clip();
    ctx.beginPath(); ctx.rect(X, Y, D * reveal, D); ctx.clip();
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, X, Y, D, D);
    ctx.restore();
    if (reveal < 1) { ctx.fillStyle = "#e8c6f0"; ctx.fillRect(X + D * reveal - 3, Y, 6, D); }
  }

  /** Quebra o texto em linhas que caibam na largura. */
  function wrap(text: string, max: number) {
    const out: string[] = []; let line = "";
    for (const word of text.split(" ")) {
      const nx = line ? `${line} ${word}` : word;
      if (ctx.measureText(nx).width > max && line) { out.push(line); line = word; } else line = nx;
    }
    out.push(line);
    return out;
  }
  const spacing = (px: number) => { if ("letterSpacing" in ctx) (ctx as G & { letterSpacing: string }).letterSpacing = `${px}px`; };

  /** Legenda da foto aberta, embaixo à esquerda, alinhada com o conteúdo da página. */
  function drawCaption() {
    if (!focus || (phase !== "hold" && phase !== "out")) return;
    const a = phase === "hold" ? clamp((p - 0.8) / 0.5) : 1 - clamp(p / 0.35);
    if (a <= 0) return;
    const v = VARS[look(focus)], u = RATIO;
    ctx.globalAlpha = a;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.font = `600 ${24 * u}px ${opt.body}`;
    const lines = wrap(v.caption, Math.min(W * 0.6, 620 * u));
    const lh = 32 * u, y0 = H - 40 * u - (lines.length - 1) * lh;
    // Caixa lisa atrás da legenda, para ler em cima da foto
    const pad = 16 * u, boxW = Math.max(...lines.map((l) => ctx.measureText(l).width), 160 * u) + pad * 2;
    ctx.fillStyle = "rgba(248,243,250,.94)";
    ctx.beginPath(); ctx.roundRect(MARGIN - pad, y0 - 38 * u - 12 * u - pad, boxW, H - (y0 - 38 * u - 12 * u - pad) - 40 * u + pad + 8 * u, 10 * u); ctx.fill();
    ctx.fillStyle = "#1e0726";
    lines.forEach((l, i) => ctx.fillText(l, MARGIN, y0 + i * lh));
    ctx.font = `800 ${12 * u}px ${opt.body}`; ctx.fillStyle = "#9e19b8";
    spacing(2 * u);
    ctx.fillText(`FOTO ${String(v.photo + 1).padStart(2, "0")} DE ${photos.length}`, MARGIN, y0 - 38 * u);
    spacing(0);
    ctx.globalAlpha = 1;
  }

  function render(ex = exit) {
    exit = ex;
    const k = camera();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    // rastro: forte na corrida e na arrancada, leve parado, some com a câmera dentro da foto
    const pin = clamp(t / ENTER);
    drawTrail((0.55 + 0.45 * Math.max(1 - pin, clamp(exit * 3))) * (1 - k));
    drawTiles(k, 1);
    drawReveal(k);
    drawCaption();
  }

  /** Carrega a foto grande de uma peça e refaz a edição nela. Enquanto não chega, a câmera usa a pequena. */
  let dead = false;
  function sharpen(v: Variant) {
    const src = photos[v.photo].hi;
    if (!src || v.hiImg || v.loading) return;
    v.loading = true;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => { if (dead) return; v.hiImg = img; v.hiBig = edit(img, v.look, HI); };
    img.src = src;
  }
  /** Abre uma peça; já adianta a foto grande da próxima do tour. */
  function open(tl: Tile) {
    focus = tl;
    sharpen(VARS[look(tl)]);
    if (ORDER.length) sharpen(VARS[look(ORDER[next % ORDER.length])]);
    setPhase("in");
  }

  function frame(dt: number, ex = 0) {
    exit = ex;
    // rolando a página, o tour para e o robô sai pela direita
    if (exit > 0.02 && phase !== "walk") { setPhase("walk"); focus = null; }
    p += dt;
    if (phase === "walk") {
      t += dt;
      updateCur(t < ENTER ? 0 : Math.floor((t - ENTER) * 7) % 4, dt);
      const wait = first ? ENTER + 2.2 : WALK;
      if (opt.tour && exit <= 0.02 && p >= wait && ORDER.length) {
        first = false;
        open(ORDER[next++ % ORDER.length]);
      }
    } else if (phase === "in" && p >= IN) setPhase("hold");
    else if (phase === "hold" && p >= HOLD) setPhase("out");
    else if (phase === "out" && p >= OUT) {
      // volta para o robô: é outra partida, e o bumper troca de aliança
      setPhase("walk"); focus = null; ally = 1 - ally;
    }
    render(exit);
  }

  function click(x: number, y: number) {
    if (phase === "in" || phase === "hold") {
      setPhase("out", phase === "in" ? OUT * (1 - depth()) : 0);
      return true;
    }
    if (phase !== "walk" || t < ENTER || exit > 0.02) return false;
    // a peça mais perto do clique, desde que ele caia no robô (até meia peça de folga)
    let best: Tile | null = null, bd = (P * 0.9) ** 2;
    for (const tl of TILES) {
      if (tl.cur < 0.5) continue;
      const d = (tl.x + motion(tl.c).dx + TS / 2 - x) ** 2 + (tl.y + bobOf(tl) + TS / 2 - y) ** 2;
      if (d < bd) { bd = d; best = tl; }
    }
    if (!best) return false;
    first = false;
    open(best);
    return true;
  }

  return {
    frame,
    render,
    resize: layout,
    click,
    still: () => { t = 3; updateCur(1, -1); },
    destroy: () => { dead = true; for (const v of VARS) { v.big.width = 0; v.thumb.width = 0; if (v.hiBig) v.hiBig.width = 0; } },
  };
}
