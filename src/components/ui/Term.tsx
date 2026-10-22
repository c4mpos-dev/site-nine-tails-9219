import Link from "next/link";
import { getTerm } from "@/content/glossary";

/**
 * Palavra de "FRC-ês" sublinhada com pontinhos: ao passar o mouse (ou focar),
 * mostra a explicação. Leva para o glossário completo ao clicar.
 */
export function Term({ id, children }: { id: string; children?: React.ReactNode }) {
  const t = getTerm(id);
  if (!t) return <>{children}</>;
  return (
    <span className="group/term relative inline">
      <Link
        href={`/glossary#${t.id}`}
        className="cursor-help underline decoration-accent decoration-dotted decoration-2 underline-offset-4"
        aria-describedby={`term-${t.id}`}
      >
        {children ?? t.term}
      </Link>
      <span
        id={`term-${t.id}`}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md border border-line bg-surface-2 p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-muted shadow-lg group-focus-within/term:block group-hover/term:block"
      >
        <span className="mb-1 block font-bold text-fg">{t.term}</span>
        {t.def}
      </span>
    </span>
  );
}
