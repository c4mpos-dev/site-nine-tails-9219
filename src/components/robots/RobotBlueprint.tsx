/**
 * Planta (vista de cima) desenhada como rascunho de caderno, usada enquanto não há foto do robô.
 * Os módulos mudam conforme a tração.
 */
export function RobotBlueprint({ drivetrain, className }: { drivetrain: string; className?: string }) {
  const swerve = /swerve/i.test(drivetrain);
  const omni = /omni/i.test(drivetrain);
  const corners: Array<[number, number]> = [
    [70, 60],
    [230, 60],
    [70, 180],
    [230, 180],
  ];
  return (
    <svg viewBox="0 0 300 240" className={className} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      {/* Linhas de caderno */}
      {[30, 60, 90, 120, 150, 180, 210].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} strokeWidth="0.6" opacity="0.15" />
      ))}
      <rect x="40" y="30" width="220" height="180" rx="10" strokeWidth="3" />
      <rect x="30" y="20" width="240" height="200" rx="16" strokeWidth="7" opacity="0.2" />
      {swerve &&
        corners.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="20" strokeWidth="2.5" />
            <rect x={x - 6} y={y - 14} width="12" height="28" rx="3" strokeWidth="2" />
          </g>
        ))}
      {omni &&
        corners.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 8}
            y={y - 20}
            width="16"
            height="40"
            rx="4"
            strokeWidth="2.5"
            transform={`rotate(${x < 150 === y < 120 ? 45 : -45} ${x} ${y})`}
          />
        ))}
      {!swerve &&
        !omni &&
        [60, 240].map((x) =>
          [70, 120, 170].map((y) => <rect key={`${x}-${y}`} x={x - 8} y={y - 16} width="16" height="32" rx="4" strokeWidth="2.5" />),
        )}
      <rect x="120" y="95" width="60" height="50" rx="4" strokeWidth="2" />
      <path d="M150 20 L150 8 M144 12 L150 6 L156 12" strokeWidth="2" />
      <text x="162" y="14" fill="currentColor" stroke="none" fontSize="11" fontFamily="var(--font-sans)">
        frente
      </text>
    </svg>
  );
}
