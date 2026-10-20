import { useId } from "react";

/**
 * Os troféus da Nine Tails desenhados no formato real, a partir das fotos da equipe:
 * - FrcAward: o troféu de cristal da FRC 2023 com a placa da Charged Up (Rookie All Star e Rookie Inspiration).
 * - SesiTrophy: o troféu do Festival SESI de Robótica, base laranja em degraus com o disco verde de "power".
 * - Certificate: a Moção de Aplausos, um certificado emoldurado.
 */
export type TrophyArt =
  | { kind: "frc"; award: string; crystal: [string, string]; plaque: string[]; frame: "walnut" | "black" }
  | { kind: "sesi"; lines: [string, string?]; event: string; edition: "2023" | "2024" }
  | { kind: "certificate"; lines: [string, string?]; issuer: string };

export function Trophy({ art, className }: { art: TrophyArt; className?: string }) {
  if (art.kind === "frc") return <FrcAward {...art} className={className} />;
  if (art.kind === "sesi") return <SesiTrophy {...art} className={className} />;
  return <Certificate {...art} className={className} />;
}

/** Logo da FRC (triângulo vermelho, círculo branco, quadrado azul), em miniatura. */
function FrcLogo({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="0,6 4,0 6,6" fill="#ed1c24" />
      <circle cx="8" cy="3.6" r="2.7" fill="#fff" stroke="#8a8a8a" strokeWidth="0.8" />
      <rect x="10" y="1" width="4.6" height="5" fill="#0066b3" />
    </g>
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
      <FrcLogo x={129} y={142} s={0.85} />
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
      <FrcLogo x={29} y={185} s={0.7} />
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

/** Troféu do Festival SESI de Robótica: base laranja em degraus, acrílico e o disco verde de power. */
function SesiTrophy({
  lines,
  event,
  edition,
  className,
}: {
  lines: [string, string?];
  event: string;
  edition: "2023" | "2024";
  className?: string;
}) {
  const id = useId();
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
        <radialGradient id={`${id}g`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#c3f08f" />
          <stop offset="1" stopColor="#7fcf45" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="236" rx="88" ry="6" fill="#000" opacity="0.25" />

      {edition === "2023" ? (
        <>
          {/* 2023: acrílico com o disco verde cheio, trilhas de circuito e o power em linhas claras */}
          <path d="M100 22 a68 68 0 1 1 -0.1 0 Z M70 140 H130 V168 H70 Z" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="100" cy="90" r="60" fill={`url(#${id}g)`} />
          <g stroke="#4e9a27" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75">
            <path d="M48 78 H60 L66 70 H74" />
            <path d="M46 98 H58 L64 106 H70" />
            <path d="M128 70 H138 L144 62 H150" />
            <path d="M130 108 H140 L146 116 H152" />
            <path d="M84 138 V128 L90 122" />
            <path d="M118 138 V130 L112 124" />
            <path d="M70 46 L78 54 V60" />
          </g>
          <g fill="#4e9a27" opacity="0.75">
            <circle cx="74" cy="70" r="2.2" />
            <circle cx="70" cy="106" r="2.2" />
            <circle cx="150" cy="62" r="2.2" />
            <circle cx="152" cy="116" r="2.2" />
            <circle cx="90" cy="122" r="2.2" />
            <circle cx="112" cy="124" r="2.2" />
          </g>
          <circle cx="100" cy="90" r="57" fill="none" stroke="#e9fbd6" strokeWidth="2.5" opacity="0.8" />
          <path d="M84 62 A34 34 0 1 0 116 62" fill="none" stroke="#5aa82f" strokeWidth="15" strokeLinecap="round" />
          <path d="M84 62 A34 34 0 1 0 116 62" fill="none" stroke="#eafcd9" strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="44" x2="100" y2="84" stroke="#5aa82f" strokeWidth="15" strokeLinecap="round" />
          <line x1="100" y1="44" x2="100" y2="84" stroke="#eafcd9" strokeWidth="10" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* 2024: só o anel verde vazado de power, com a onça-pintada dourada na frente */}
          <g fill="none" strokeLinecap="round">
            <path d="M80 42 A54 54 0 1 0 120 42" stroke="#1d8a3a" strokeWidth="17" />
            <path d="M80 42 A54 54 0 1 0 120 42" stroke="#2fbf55" strokeWidth="13" />
            <path d="M88 64 A32 32 0 1 0 112 64" stroke="#1d8a3a" strokeWidth="9" />
            <path d="M88 64 A32 32 0 1 0 112 64" stroke="#2fbf55" strokeWidth="6" />
            <line x1="100" y1="34" x2="100" y2="88" stroke="#1d8a3a" strokeWidth="15" />
            <line x1="100" y1="34" x2="100" y2="88" stroke="#2fbf55" strokeWidth="11" />
          </g>
          <path d="M66 70 A40 40 0 0 1 80 50" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
          {/* Onça dourada, em pé sobre o bloco */}
          <g>
            <path
              d="M70 132 q-3 -9 4 -12 l1 -6 l4 4 q5 -2 9 1 q12 -6 28 -2 q7 2 10 9 q5 -3 8 -10 q4 -6 6 -3 q1 3 -3 7 q-4 7 -10 10 v12 h-6 l-2 -9 h-16 l-2 9 h-6 l1 -9 q-5 0 -8 -2 l-2 11 h-6 l1 -12 q-7 -1 -10 -6 Z"
              fill={`url(#${id}j)`}
              stroke="#8a6410"
              strokeWidth="1"
            />
            <g fill="#6b4b0b">
              <circle cx="96" cy="121" r="1.6" />
              <circle cx="104" cy="119" r="1.4" />
              <circle cx="112" cy="122" r="1.7" />
              <circle cx="100" cy="127" r="1.3" />
              <circle cx="108" cy="128" r="1.5" />
              <circle cx="117" cy="126" r="1.3" />
              <circle cx="90" cy="125" r="1.2" />
            </g>
            <circle cx="75" cy="121" r="0.9" fill="#3a2a05" />
          </g>
        </>
      )}

      {/* Bloco de cima: o nome do prêmio */}
      <polygon points="64,170 136,170 132,138 68,138" fill={`url(#${id}o)`} />
      <polygon points="68,138 132,138 131,134 69,134" fill="#ff9a6e" />
      {edition === "2024" && <rect x="72" y="143" width="56" height="21" rx="1.5" fill="#d9b25a" stroke="#9c7313" strokeWidth="0.8" />}
      <text x="100" y={lines[1] ? 151 : 156} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={edition === "2024" ? "#3a2a05" : "#fff"} fontFamily="Arial, sans-serif">
        {lines[0]}
      </text>
      {lines[1] && (
        <text x="100" y="162" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={edition === "2024" ? "#3a2a05" : "#fff"} fontFamily="Arial, sans-serif">
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
      <text x="164" y="194" textAnchor="end" fontSize="5.8" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {event.split(" ").slice(0, -2).join(" ") || event}
      </text>
      <text x="164" y="201.5" textAnchor="end" fontSize="5.8" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {event.split(" ").slice(-2).join(" ")}
      </text>
      <g fontFamily="Arial, sans-serif" fontWeight="900" fill="#fff">
        <rect x="40" y="211" width="28" height="8" fill="#fff" />
        <text x="54" y="217.5" textAnchor="middle" fontSize="6" fill="#e2461d">
          SENAI
        </text>
        <g transform="translate(84 211)">
          <polygon points="0,7 4,0 6,7" fill="#fff" />
          <circle cx="8.5" cy="4" r="2.8" fill="none" stroke="#fff" strokeWidth="1" />
          <rect x="11" y="1" width="4.6" height="5.5" fill="#fff" />
          <text x="18" y="4" fontSize="3.6">
            FIRST
          </text>
          <text x="18" y="8" fontSize="2.8">
            ROBOTICS COMPETITION
          </text>
        </g>
        <rect x="132" y="211" width="24" height="8" fill="#fff" />
        <text x="144" y="217.5" textAnchor="middle" fontSize="6" fill="#e2461d">
          SESI
        </text>
      </g>
    </svg>
  );
}

/** Certificado emoldurado (Moção de Aplausos). */
function Certificate({ lines, issuer, className }: { lines: [string, string?]; issuer: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 212" className={className} role="img" aria-label={`${lines.join(" ")}, ${issuer}`}>
      <ellipse cx="80" cy="205" rx="66" ry="5" fill="#000" opacity="0.25" />
      <rect x="6" y="6" width="148" height="194" rx="3" fill="#2d1f17" />
      <rect x="14" y="14" width="132" height="178" fill="#fbf7ec" />
      <rect x="20" y="20" width="120" height="166" fill="none" stroke="#c9a94e" strokeWidth="1" />
      <text x="80" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3a2a20" fontFamily="Georgia, serif">
        {lines[0]}
      </text>
      {lines[1] && (
        <text x="80" y="64" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3a2a20" fontFamily="Georgia, serif">
          {lines[1]}
        </text>
      )}
      <g stroke="#b9ad97" strokeWidth="2" strokeLinecap="round">
        <path d="M34 84 H126" />
        <path d="M34 94 H126" />
        <path d="M34 104 H118" />
        <path d="M34 114 H126" />
        <path d="M34 124 H100" />
      </g>
      <text x="80" y="140" textAnchor="middle" fontSize="7" fill="#6b5a48" fontFamily="Georgia, serif">
        {issuer}
      </text>
      {/* Selo com fitas */}
      <path d="M72 168 L66 188 L74 184 L78 192 L80 170 Z M88 168 L94 188 L86 184 L82 192 L80 170 Z" fill="#9e19b8" />
      <circle cx="80" cy="164" r="12" fill="#d8b44a" stroke="#a5822a" strokeWidth="1.5" />
      <circle cx="80" cy="164" r="7" fill="none" stroke="#a5822a" strokeWidth="1" />
    </svg>
  );
}
