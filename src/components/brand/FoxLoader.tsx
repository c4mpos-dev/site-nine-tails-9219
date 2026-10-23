import Image from "next/image";
import { cn } from "@/lib/cn";

const TAILS = 9;

/**
 * As nove caudas em volta do emblema, acendendo uma de cada vez, como um anel de carregamento.
 * Só CSS: funciona em componente de servidor e para sozinho com "reduzir movimento".
 */
export function FoxLoader({ className, emblem = true }: { className?: string; emblem?: boolean }) {
  return (
    <div className={cn("relative aspect-square", className)} role="presentation">
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          {/* Como no emblema: cauda de aço com a ponta magenta e contorno escuro */}
          <linearGradient id="fox-tail" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="-44">
            <stop offset="0" stopColor="#cdd6dc" />
            <stop offset="0.55" stopColor="#cdd6dc" />
            <stop offset="0.75" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <g className="fox-ring">
          {Array.from({ length: TAILS }, (_, i) => (
            <g key={i} transform={`rotate(${(360 / TAILS) * i}) translate(0 -60)`}>
              <path
                className="fox-tail"
                style={{ animationDelay: `${i * 0.11}s` }}
                d="M-11 4C-16-14-8-32 10-44C4-30 14-14 11 4Q0 9-11 4Z"
                fill="url(#fox-tail)"
                stroke="#1b0d26"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      </svg>
      {emblem && (
        <div className="absolute inset-0 grid place-items-center">
          <Image src="/brand/emblem.webp" alt="" width={240} height={220} className="fox-emblem w-[50%]" />
        </div>
      )}
    </div>
  );
}
