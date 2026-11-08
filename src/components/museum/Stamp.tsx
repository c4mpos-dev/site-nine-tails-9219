import { cn } from "@/lib/cn";

/** Carimbo redondo de tinta, como o de passaporte. */
export function Stamp({ number, label, year, className }: { number: string; label: string; year: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-24 place-items-center rounded-full border-[3px] border-current p-1 text-center font-mono uppercase leading-none mix-blend-multiply",
        className,
      )}
    >
      <span className="grid size-full place-content-center gap-1 rounded-full border border-dashed border-current">
        <span className="text-[8px] tracking-[0.2em]">Visitado</span>
        <span className="heading text-2xl">{number}</span>
        <span className="max-w-16 truncate text-[8px] tracking-wider">{label}</span>
        <span className="text-[8px] tracking-[0.2em]">{year}</span>
      </span>
    </span>
  );
}
