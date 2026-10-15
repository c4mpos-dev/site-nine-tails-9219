/**
 * Pictogramas dos prêmios, desenhados em traço simples.
 * Cada um lembra a forma do troféu de verdade + um detalhe da raposa.
 */
type P = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

/** Rookie All Star: placa com estrela. */
export function RookieAllStarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <g {...stroke}>
        <rect x="14" y="8" width="52" height="66" rx="4" />
        <path d="M40 22 L45 33 L57 34 L48 42 L51 54 L40 47 L29 54 L32 42 L23 34 L35 33 Z" />
        <path d="M24 64 H56" />
        <path d="M8 74 H72 V84 H8 Z" />
        <path d="M18 84 V94 H62 V84" />
      </g>
    </svg>
  );
}

/** Rookie Inspiration: taça do Mundial com a chama da inspiração. */
export function RookieInspirationIcon({ className }: P) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M22 14 H58 V30 C58 44 50 52 40 52 C30 52 22 44 22 30 Z" />
        <path d="M22 20 H12 C12 32 16 38 24 40 M58 20 H68 C68 32 64 38 56 40" />
        <path d="M40 52 V66" />
        <path d="M28 66 H52 L56 76 H24 Z" />
        <path d="M16 76 H64 V92 H16 Z" />
        <path d="M40 22 C36 28 36 32 40 38 C44 32 44 28 40 22 Z" />
      </g>
    </svg>
  );
}

/** Engineering Award: engrenagem sobre a base. */
export function EngineeringIcon({ className }: P) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <g {...stroke}>
        {teeth.map((a) => (
          <rect key={a} x="36" y="6" width="8" height="10" rx="1.5" transform={`rotate(${a} 40 34)`} />
        ))}
        <circle cx="40" cy="34" r="20" />
        <circle cx="40" cy="34" r="8" />
        <path d="M40 54 V66" />
        <path d="M26 66 H54 L58 76 H22 Z" />
        <path d="M14 76 H66 V92 H14 Z" />
      </g>
    </svg>
  );
}

/** Finalista: medalha com fita. */
export function FinalistIcon({ className }: P) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M24 6 L36 40 M56 6 L44 40" />
        <path d="M18 6 H62" />
        <circle cx="40" cy="64" r="24" />
        <circle cx="40" cy="64" r="15" />
        <path d="M36 58 L41 55 V73 M36 73 H46" />
      </g>
    </svg>
  );
}

/** Moção / honraria: pergaminho. */
export function HonorIcon({ className }: P) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M18 14 H58 C62 14 64 18 64 22 V80 C64 86 60 90 54 90 H22" />
        <path d="M18 14 C12 14 10 20 14 24 H22 V84 C22 88 18 90 16 90 C12 90 10 86 12 82" />
        <path d="M30 34 H54 M30 44 H54 M30 54 H46" />
        <circle cx="48" cy="70" r="7" />
      </g>
    </svg>
  );
}
