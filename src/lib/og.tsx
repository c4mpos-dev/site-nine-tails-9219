import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { cacheLife } from "next/cache";

/**
 * As thumbs das prévias de link (WhatsApp, Instagram, LinkedIn, Google).
 * Tudo é desenhado no build: fotos reais da equipe, as fontes e as cores do site, saída em JPEG
 * (o WhatsApp costuma ignorar imagem pesada, e um PNG com foto passa de 1 MB).
 */

export const OG = { width: 1200, height: 630 };

const C = { bg: "#ffffff", surface: "#f8f3fa", tint: "#ead9f2", fg: "#1e0726", muted: "#5e4a69", brand: "#9e19b8", accent: "#b558c7" };

const file = (p: string) => readFile(join(/* turbopackIgnore: true */ process.cwd(), p));

let fontsP: Promise<{ name: string; data: Buffer; weight: 500 | 700 | 800; style: "normal" }[]> | undefined;
const fonts = () =>
  (fontsP ??= Promise.all([
    file("assets/og/BigShoulders-ExtraBold.ttf").then((data) => ({ name: "Display", data, weight: 800 as const, style: "normal" as const })),
    file("assets/og/Bricolage-Medium.ttf").then((data) => ({ name: "Sans", data, weight: 500 as const, style: "normal" as const })),
    file("assets/og/Bricolage-Bold.ttf").then((data) => ({ name: "Sans", data, weight: 700 as const, style: "normal" as const })),
  ]));

const dataUri = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;

/** Recorta uma foto de /public no tamanho exato, respeitando o enquadramento ("50% 40%") usado no site. */
async function photo(src: string, w: number, h: number, position = "50% 50%") {
  const img = sharp(join(/* turbopackIgnore: true */ process.cwd(), "public", src));
  const { width = w, height = h } = await img.metadata();
  const scale = Math.max(w / width, h / height);
  const sw = Math.round(width * scale), sh = Math.round(height * scale);
  const [px, py] = position.split(" ").map((v) => parseFloat(v) / 100);
  const left = Math.round((sw - w) * (px ?? 0.5)), top = Math.round((sh - h) * (py ?? 0.5));
  const buf = await img.resize(sw, sh).extract({ left, top, width: w, height: h }).jpeg({ quality: 88 }).toBuffer();
  return dataUri(buf, "image/jpeg");
}

/** Robô recortado (fundo transparente), cabendo numa caixa. */
async function cutout(src: string, w: number, h: number) {
  const buf = await sharp(join(/* turbopackIgnore: true */ process.cwd(), "public", src)).resize(w, h, { fit: "inside" }).png().toBuffer();
  const m = await sharp(buf).metadata();
  return { src: dataUri(buf, "image/png"), w: m.width ?? w, h: m.height ?? h };
}

let emblemP: Promise<string> | undefined;
const emblem = () => (emblemP ??= file("src/app/icon.png").then((b) => dataUri(b, "image/png")));

/** Corta o texto numa palavra, para caber nas linhas da thumb. */
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:.\s]+$/, "")}…`);

/** Largura média de uma letra da Big Shoulders em caixa alta, em em (com folga). */
const EM = 0.47;

/**
 * Título grande do tamanho que cabe: a palavra mais comprida inteira na largura disponível,
 * e o título todo em até duas linhas.
 */
const fitTitle = (t: string, avail: number, max = 150) => {
  const longest = Math.max(...t.split(" ").map((w) => w.length));
  return Math.floor(Math.min(max, avail / (longest * EM), ((2 * avail) / (t.length * EM)) * 1.15));
};

/** Desenha a thumb e devolve o JPEG pronto. */
async function render(node: React.ReactElement) {
  const png = await new ImageResponse(node, { ...OG, fonts: await fonts() }).arrayBuffer();
  return new Uint8Array(await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
}

const respond = (jpg: Uint8Array) =>
  new Response(jpg as Uint8Array<ArrayBuffer>, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable" } });

async function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
      <img src={await emblem()} width={62} height={57} alt="" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Display", fontSize: 34, lineHeight: 1, color: C.fg, textTransform: "uppercase", letterSpacing: 1 }}>Nine Tails #9219</div>
        <div style={{ fontFamily: "Sans", fontWeight: 500, fontSize: 19, color: C.muted, marginTop: 4 }}>FIRST Robotics Competition · Resende, RJ</div>
      </div>
    </div>
  );
}

const Kicker = ({ children }: { children: string }) => (
  <div style={{ display: "flex", fontFamily: "Sans", fontWeight: 700, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: C.brand }}>{children}</div>
);

export type CardProps = { kicker: string; title: string; lead?: string; photo?: { src: string; position?: string }; brand?: boolean };

/** Thumb padrão: o texto à esquerda, numa folha lavanda, e a foto real sangrando à direita. */
async function cardJpeg({ kicker, title, lead, photo: p, brand = true }: CardProps) {
  "use cache";
  // as fotos e as fontes são lidas do disco: o cache deixa a thumb pronta no build (cacheComponents)
  cacheLife("max");
  const PW = 600;
  const img = p ? await photo(p.src, PW, OG.height, p.position) : null;
  // largura do texto: a folha (1200 − foto − faixa) menos as margens
  const fs = fitTitle(title, OG.width - PW - 14 - 120);
  return render(
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.surface }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: OG.width - PW - 14, padding: "58px 54px 50px 66px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker>{kicker}</Kicker>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: fs, lineHeight: 0.9, color: C.fg, textTransform: "uppercase", marginTop: 18 }}>{title}</div>
          {lead && <div style={{ display: "flex", fontFamily: "Sans", fontWeight: 500, fontSize: 26, lineHeight: 1.3, color: C.muted, marginTop: 24 }}>{clip(lead, 96)}</div>}
        </div>
        {brand ? await Brand() : <div style={{ display: "flex" }} />}
      </div>
      {/* a faixa da marca entre o texto e a foto */}
      <div style={{ display: "flex", width: 10, background: C.brand }} />
      <div style={{ display: "flex", width: 4, background: C.accent }} />
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img>
        <img src={img} width={PW} height={OG.height} alt="" />
      ) : (
        <div style={{ display: "flex", width: PW, background: C.tint }} />
      )}
    </div>,
  );
}

/** A prancheta do hangar, igual à da página de robôs: quadriculado roxo e a linha do chão. */
const Grid = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      backgroundImage: "linear-gradient(rgba(158,25,184,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(158,25,184,0.09) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />
);

export type RobotCardProps = { kicker: string; name: string; lead?: string; cutout: string };

/** Thumb de um robô: ele recortado na prancheta, com o nome gigante vazado atrás, como no hangar do site. */
async function robotJpeg({ kicker, name, lead, cutout: src }: RobotCardProps) {
  "use cache";
  // as fotos e as fontes são lidas do disco: o cache deixa a thumb pronta no build (cacheComponents)
  cacheLife("max");
  const bot = await cutout(src, 560, 500);
  return render(
    <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: C.tint }}>
      <Grid />
      <div style={{ position: "absolute", left: 0, right: 0, top: 496, height: 2, display: "flex", background: "rgba(181,88,199,0.45)" }} />
      <div
        style={{
          position: "absolute",
          right: -10,
          top: 40,
          display: "flex",
          fontFamily: "Display",
          // nome comprido (The Answer, Garuttinho) encolhe para caber inteiro atrás do robô
          fontSize: Math.min(300, Math.floor(1000 / (name.length * EM))),
          lineHeight: 1,
          textTransform: "uppercase",
          color: "rgba(158,25,184,0.10)",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
      <img src={bot.src} width={bot.w} height={bot.h} alt="" style={{ position: "absolute", right: 40 + (560 - bot.w) / 2, top: 520 - bot.h }} />
      <div style={{ position: "absolute", left: 66, top: 58, bottom: 50, width: 520, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker>{kicker}</Kicker>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: fitTitle(name, 520), lineHeight: 0.9, color: C.fg, textTransform: "uppercase", marginTop: 18 }}>{name}</div>
          {lead && <div style={{ display: "flex", fontFamily: "Sans", fontWeight: 500, fontSize: 26, lineHeight: 1.3, color: C.muted, marginTop: 22, width: 470 }}>{clip(lead, 90)}</div>}
        </div>
        {await Brand()}
      </div>
    </div>,
  );
}

/** Thumb do hangar: todos os robôs lado a lado no chão da quadra. */
async function hangarJpeg({ kicker, title, lead, cutouts }: { kicker: string; title: string; lead: string; cutouts: string[] }) {
  "use cache";
  // as fotos e as fontes são lidas do disco: o cache deixa a thumb pronta no build (cacheComponents)
  cacheLife("max");
  const bots = await Promise.all(cutouts.map((c) => cutout(c, 205, 275)));
  return render(
    <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", background: C.tint, padding: "54px 66px 46px" }}>
      <Grid />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
          <Kicker>{kicker}</Kicker>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 112, lineHeight: 0.9, color: C.fg, textTransform: "uppercase", marginTop: 14 }}>{title}</div>
          <div style={{ display: "flex", fontFamily: "Sans", fontWeight: 500, fontSize: 25, lineHeight: 1.3, color: C.muted, marginTop: 16 }}>{clip(lead, 96)}</div>
        </div>
        {await Brand()}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 566, height: 2, display: "flex", background: "rgba(181,88,199,0.45)" }} />
      <div style={{ position: "absolute", left: 24, right: 24, top: 286, height: 290, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {bots.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img>
          <img key={i} src={b.src} width={b.w} height={b.h} alt="" />
        ))}
      </div>
    </div>,
  );
}

export const ogCard = async (props: CardProps) => respond(await cardJpeg(props));
export const ogRobot = async (props: RobotCardProps) => respond(await robotJpeg(props));
export const ogHangar = async (props: Parameters<typeof hangarJpeg>[0]) => respond(await hangarJpeg(props));
