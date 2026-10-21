import { useId } from "react";

/**
 * Os troféus da Nine Tails desenhados no formato real, a partir das fotos da equipe:
 * - FrcAward: o troféu de cristal da FRC 2023 com a placa da Charged Up (Rookie All Star e Rookie Inspiration).
 * - SesiTrophy: o troféu do Festival SESI de Robótica, base laranja em degraus com o contorno verde de "power".
 */
export type TrophyArt =
  | { kind: "frc"; award: string; crystal: [string, string]; plaque: string[]; frame: "walnut" | "black" }
  | { kind: "sesi"; lines: [string, string?]; event: string; onca?: boolean };

export function Trophy({ art, className }: { art: TrophyArt; className?: string }) {
  if (art.kind === "frc") return <FrcAward {...art} className={className} />;
  return <SesiTrophy {...art} className={className} />;
}

/** Marca oficial da FIRST (triângulo, anel e quadrado), colorida ou branca, com altura `h`. */
function FirstMark({ x, y, h, white }: { x: number; y: number; h: number; white?: boolean }) {
  return (
    <image
      href={white ? "/seasons/logos/frc-mark-white.svg" : "/seasons/logos/frc-mark.svg"}
      x={x}
      y={y}
      height={h}
      width={h * (107.5 / 64.2)}
    />
  );
}

/**
 * Prêmio da FRC 2023: o troféu de cristal (três colunas sobre base preta com plaqueta prateada)
 * e, atrás, a placa vertical com a arte da Charged Up. No Mundial a moldura é de madeira; na regional, preta.
 */
function FrcAward({
  award,
  crystal,
  plaque,
  frame,
  className,
}: {
  award: string;
  crystal: [string, string];
  plaque: string[];
  frame: "walnut" | "black";
  className?: string;
}) {
  const id = useId();
  const glass = `url(#${id}c)`;
  return (
    <svg viewBox="0 0 230 214" className={className} role="img" aria-label={`Troféu de cristal e placa do ${award}`}>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="0.35" stopColor="#d6e6f2" stopOpacity="0.18" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#b9cddb" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={frame === "walnut" ? "#6e4a33" : "#3a3a3e"} />
          <stop offset="1" stopColor={frame === "walnut" ? "#3b2619" : "#0c0c0e"} />
        </linearGradient>
      </defs>
      <ellipse cx="115" cy="206" rx="104" ry="5" fill="#000" opacity="0.25" />

      {/* Placa, em pé atrás do cristal */}
      <rect x="116" y="22" width="104" height="150" rx="3" fill={`url(#${id}w)`} />
      <rect x="120" y="26" width="96" height="142" rx="2" fill="none" stroke="#fff" strokeOpacity="0.12" />
      <rect x="125" y="31" width="86" height="132" fill="#fbfbfb" />
      <text x="168" y="42" textAnchor="middle" fontSize="7" fontWeight="900" fontFamily="Arial Black, Arial, sans-serif" fill="#111">
        FIRST <tspan fill="#7ac143">ENERGIZE</tspan>
      </text>
      <rect x="129" y="47" width="78" height="88" fill="#f4f7fa" stroke="#111" strokeWidth="0.8" />
      <polygon points="129,62 160,52 137,82" fill="#4fb3e3" />
      <polygon points="133,98 170,112 146,132" fill="#4fb3e3" />
      <polygon points="176,47 207,47 207,62 172,58" fill="#f2c300" />
      <polygon points="166,122 207,108 207,113" fill="#111" />
      <g transform="rotate(-6 168 90)">
        <rect x="137" y="82" width="62" height="15" rx="3" fill="#f7d417" stroke="#111" strokeWidth="1.1" />
        <text x="168" y="93.3" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#111" fontFamily="Arial Black, Arial, sans-serif">
          CHARGED UP
        </text>
      </g>
      <text x="196" y="104" textAnchor="end" fontSize="3.4" fontWeight="700" fill="#111" fontFamily="Arial, sans-serif">
        PRESENTED BY{" "}
        <tspan fill="#d71920" fontSize="4.2" fontStyle="italic">
          HAAS
        </tspan>
      </text>
      <FirstMark x={128.5} y={141.5} h={6.5} />
      <line x1="144" y1="140" x2="144" y2="158" stroke="#bbb" strokeWidth="0.5" />
      {plaque.map((l, i) => (
        <text key={l} x="147" y={145 + i * 5.4} fontSize={i === 0 ? 4.3 : 3.8} fontWeight={i === 0 ? 700 : 400} fill="#222" fontFamily="Arial, sans-serif">
          {l}
        </text>
      ))}

      {/* Troféu de cristal: base preta e três colunas */}
      <polygon points="22,170 150,170 160,178 12,178" fill="#2b2b2f" />
      <rect x="12" y="178" width="148" height="20" fill="#0d0d10" />
      <line x1="12" y1="178.5" x2="160" y2="178.5" stroke="#fff" strokeOpacity="0.25" />
      <rect x="26" y="181" width="120" height="14" fill="#d9dde2" />
      <FirstMark x={29} y={184.5} h={6} />
      <text x="88" y="187.5" textAnchor="middle" fontSize="4.6" fontWeight="700" fill="#111" fontFamily="Arial, sans-serif">
        {crystal[0]}
      </text>
      <text x="88" y="192.8" textAnchor="middle" fontSize="3.6" fill="#333" fontFamily="Arial, sans-serif">
        {crystal[1]}
      </text>

      <g stroke="#b7cbd9" strokeWidth="1" strokeLinejoin="round">
        {/* Prisma com ponta */}
        <polygon points="30,172 30,86 44,68 58,86 58,172" fill={glass} />
        <polyline points="44,68 44,172" fill="none" strokeOpacity="0.6" />
        <polygon points="30,86 44,68 44,86" fill="#fff" fillOpacity="0.5" />
        {/* Cilindro com o topo cortado em diagonal */}
        <path d="M68 172 V58 L94 50 V172 Z" fill={glass} />
        <ellipse cx="81" cy="54" rx="13" ry="4" transform="rotate(-17 81 54)" fill="#eaf3f9" fillOpacity="0.8" />
        <line x1="76" y1="62" x2="76" y2="170" stroke="#fff" strokeWidth="2" strokeOpacity="0.9" />
        {/* Barra quadrada sobre o pedestal */}
        <rect x="102" y="160" width="32" height="12" fill="#0d0d10" stroke="none" />
        <polygon points="106,160 106,42 130,42 130,160" fill={glass} />
        <polygon points="106,42 110,38 134,38 130,42" fill="#fff" fillOpacity="0.7" />
        <polygon points="130,42 134,38 134,156 130,160" fill="#c5d6e2" fillOpacity="0.7" />
        <line x1="114" y1="46" x2="114" y2="156" stroke="#fff" strokeWidth="1.6" strokeOpacity="0.85" />
      </g>
    </svg>
  );
}

/**
 * O "power" do Festival SESI, como no logo: anel de fora e anel de dentro separados por um canal
 * transparente que entra à esquerda da barra, dá a volta inteira e sai à direita dela, no furo do centro.
 * Medidas tiradas da foto do troféu (raios em unidades do desenho, centro em 100,86).
 */
const CX = 100;
const CY = 86;
const R = { disc: 61, outer: 58, gap: 45, inner: 39.5, hole: 21 };
const BAR = { x: 91.5, w: 17, end: 80 };
const SLIT = 5.5;

const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(CX + r * Math.sin(a)).toFixed(1)} ${(CY - r * Math.cos(a)).toFixed(1)}`;
};
const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

/** Trilhas de circuito: um traço do meio do anel para fora, às vezes com um cotovelo, e um pad na ponta. */
type Trace = { d: string; pad: string };
function trace(r1: number, r2: number, deg: number, bend = 0): Trace {
  const end = bend ? at(r2, deg + bend) : at(r2, deg);
  return { d: `M${at(r1, deg)} L${at(r2, deg)}${bend ? ` L${end}` : ""}`, pad: end };
}
const TRACES: Trace[] = [
  // Anel de fora: traços curtos com cotovelos alternados
  ...range(24, 336, 9).map((deg, i) =>
    i % 3 === 0 ? trace(47, 55, deg, i % 2 ? 5 : -5) : i % 3 === 1 ? trace(56.5, 50.5 - (i % 4), deg) : trace(46.5, 51, deg, 3),
  ),
  // Anel de dentro, embaixo: o pente de traços paralelos com pad em cima
  ...range(150, 210, 5).map((deg) => trace(23, 31 + (deg % 10 ? 0 : 3), deg)),
  // Anel de dentro, nas laterais
  ...range(40, 140, 8).map((deg, i) => trace(38, 27 + (i % 3) * 2, deg, i % 2 ? 6 : 0)),
  ...range(220, 340, 8).map((deg, i) => trace(38, 27 + (i % 3) * 2, deg, i % 2 ? -6 : 0)),
];

function PowerMark({ id }: { id: string }) {
  const mask = `url(#${id}m)`;
  return (
    <>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b4f08a" />
          <stop offset="1" stopColor="#7fd65a" />
        </linearGradient>
        {/* Branco = acrílico verde; preto = recortes transparentes */}
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="244">
          <circle cx={CX} cy={CY} r={R.outer} fill="#fff" />
          <circle cx={CX} cy={CY} r={R.gap} fill="#000" />
          <circle cx={CX} cy={CY} r={R.inner} fill="#fff" />
          <circle cx={CX} cy={CY} r={R.hole} fill="#000" />
          <path
            d={`M${BAR.x} ${CY - R.outer + 6} V${BAR.end} a${BAR.w / 2} ${BAR.w / 2} 0 0 0 ${BAR.w} 0 V${CY - R.outer + 6} Z`}
            fill="#fff"
          />
          {/* Canal à esquerda da barra (de fora até o canal do meio) e à direita (do canal até o furo) */}
          <rect x={BAR.x - SLIT} y={CY - R.outer - 2} width={SLIT} height={R.outer - R.inner + 3} fill="#000" />
          <rect x={BAR.x + BAR.w} y={CY - R.gap - 1} width={SLIT} height={R.gap - R.hole + 3} fill="#000" />
        </mask>
        {/* As bordas dos anéis não passam por cima da barra */}
        <mask id={`${id}e`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="244">
          <rect width="200" height="244" fill="#fff" />
          <rect x={BAR.x + 1} y="0" width={BAR.w - 2} height={BAR.end} fill="#000" />
        </mask>
      </defs>

      {/* O disco de acrílico transparente */}
      <circle cx={CX} cy={CY} r={R.disc} fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
      <circle cx={CX} cy={CY} r={R.disc - 2} fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* O verde, com as trilhas e as bordas claras do recorte */}
      <g mask={mask}>
        <rect x={CX - R.outer} y={CY - R.outer} width={R.outer * 2} height={R.outer * 2} fill={`url(#${id}g)`} />
        <g stroke="#3f9a35" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
          {TRACES.map((t) => (
            <path key={t.d} d={t.d} />
          ))}
          <path d={`M${CX} ${CY - R.outer + 4} V${BAR.end - 4}`} />
        </g>
        <g fill="none" stroke="#3f9a35" strokeWidth="0.7" opacity="0.75">
          {TRACES.map((t) => {
            const [x, y] = t.pad.split(" ");
            return <circle key={t.d} cx={x} cy={y} r="0.95" />;
          })}
          <rect x={CX - 2.5} y={CY - 26} width="5" height="5" />
        </g>
        <g fill="none" stroke="#e7fbd5" strokeWidth="2" opacity="0.85">
          <g mask={`url(#${id}e)`}>
            <circle cx={CX} cy={CY} r={R.outer} />
            <circle cx={CX} cy={CY} r={R.gap} />
            <circle cx={CX} cy={CY} r={R.inner} />
            <circle cx={CX} cy={CY} r={R.hole} />
          </g>
          <path
            d={`M${BAR.x} ${CY - R.outer} V${CY - R.inner} M${BAR.x} ${CY - R.hole} V${BAR.end} a${BAR.w / 2} ${BAR.w / 2} 0 0 0 ${BAR.w} 0 V${CY - R.gap}`}
          />
          <path d={`M${BAR.x - SLIT} ${CY - R.outer} V${CY - R.gap}`} />
          <path d={`M${BAR.x + BAR.w + SLIT} ${CY - R.gap} V${CY - R.hole}`} />
        </g>
      </g>
    </>
  );
}

/**
 * Troféu do Festival SESI de Robótica, igual nos off-seasons de 2023 (Rio) e 2024 (Mato Grosso):
 * o "power" verde com trilhas de circuito num disco de acrílico, sobre um bloco laranja com o nome do
 * prêmio e a base larga com o festival e os logos. O de Mato Grosso tem a onça-pintada dourada na frente.
 */
function SesiTrophy({
  lines,
  event,
  onca,
  className,
}: {
  lines: [string, string?];
  event: string;
  onca?: boolean;
  className?: string;
}) {
  const id = useId();
  const [eventTop, ...eventRest] = event.split(" ");
  return (
    <svg viewBox="0 0 200 244" className={className} role="img" aria-label={`Troféu ${lines.join(" ")}, ${event}`}>
      <defs>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a45" />
          <stop offset="1" stopColor="#e2461d" />
        </linearGradient>
        <linearGradient id={`${id}j`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d77a" />
          <stop offset="1" stopColor="#c9921f" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="236" rx="88" ry="6" fill="#000" opacity="0.25" />

      <PowerMark id={id} />

      {onca && (
        /* Onça-pintada dourada, andando na frente do anel, sobre o bloco */
        <g transform="translate(200 0) scale(-1 1) translate(100 139) scale(1.25) translate(-100 -144)">
          <path
            d="M70 132 q-3 -9 4 -12 l1 -6 l4 4 q5 -2 9 1 q12 -6 28 -2 q7 2 10 9 q5 -3 8 -10 q4 -6 6 -3 q1 3 -3 7 q-4 7 -10 10 v12 h-6 l-2 -9 h-16 l-2 9 h-6 l1 -9 q-5 0 -8 -2 l-2 11 h-6 l1 -12 q-7 -1 -10 -6 Z"
            fill={`url(#${id}j)`}
            stroke="#8a6410"
            strokeWidth="1"
          />
          {/* Rosetas */}
          <g fill="none" stroke="#6b4b0b" strokeWidth="0.8">
            <circle cx="84" cy="124" r="1.4" />
            <circle cx="89" cy="120" r="1.4" />
            <circle cx="94" cy="126" r="1.4" />
            <circle cx="98" cy="119" r="1.4" />
            <circle cx="103" cy="124" r="1.4" />
            <circle cx="108" cy="119" r="1.4" />
            <circle cx="112" cy="126" r="1.4" />
            <circle cx="116" cy="121" r="1.4" />
            <circle cx="120" cy="127" r="1.4" />
            <circle cx="92" cy="131" r="1.4" />
            <circle cx="101" cy="130" r="1.4" />
            <circle cx="110" cy="131" r="1.4" />
            <circle cx="118" cy="132" r="1.4" />
            <circle cx="86" cy="129" r="1.4" />
            <circle cx="124" cy="124" r="1.4" />
            <circle cx="105" cy="135" r="1.4" />
            <circle cx="96" cy="136" r="1.4" />
          </g>
          <circle cx="75" cy="121" r="0.9" fill="#3a2a05" />
        </g>
      )}

      {/* Bloco de cima: o nome do prêmio */}
      <polygon points="62,170 138,170 132,140 68,140" fill={`url(#${id}o)`} />
      <polygon points="68,140 132,140 131,136 69,136" fill="#ff9a6e" />
      <text x="100" y={lines[1] ? 153 : 158} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {lines[0]}
      </text>
      {lines[1] && (
        <text x="100" y="163.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
          {lines[1]}
        </text>
      )}

      {/* Base larga */}
      <polygon points="14,232 186,232 170,178 30,178" fill={`url(#${id}o)`} />
      <polygon points="30,178 170,178 168,170 32,170" fill="#ff9a6e" />
      {/* Texto da base: festival à esquerda, evento à direita, logos embaixo */}
      <text x="36" y="192" fontSize="6.6" fontWeight="900" fill="#fff" fontFamily="Arial Black, Arial, sans-serif">
        FESTIVAL SESI
      </text>
      <text x="36" y="199.5" fontSize="5.6" fontWeight="900" fill="#fff" fontFamily="Arial Black, Arial, sans-serif">
        DE ROBÓTICA
      </text>
      <text x="36" y="205" fontSize="3.4" fill="#fff" opacity="0.85" fontFamily="Arial, sans-serif">
        FIRST Robotics Competition
      </text>
      <text x="164" y="194" textAnchor="end" fontSize="5.4" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {eventTop}
      </text>
      <text x="164" y="201" textAnchor="end" fontSize="5.4" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {eventRest.join(" ")}
      </text>
      <g fontFamily="Arial, sans-serif" fontWeight="900" fill="#fff">
        <rect x="40" y="211" width="28" height="8" fill="#fff" />
        <text x="54" y="217.5" textAnchor="middle" fontSize="6" fill="#e2461d">
          SENAI
        </text>
        <FirstMark x={76} y={211} h={8} white />
        <text x="90.5" y="214.4" fontSize="3.8" fontStyle="italic">
          FIRST
        </text>
        <text x="90.5" y="218.4" fontSize="2.6">
          ROBOTICS COMPETITION
        </text>
        <rect x="134" y="211" width="24" height="8" fill="#fff" />
        <text x="146" y="217.5" textAnchor="middle" fontSize="6" fill="#e2461d">
          SESI
        </text>
      </g>
    </svg>
  );
}
