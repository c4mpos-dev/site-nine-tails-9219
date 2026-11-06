import { cn } from "@/lib/cn";

/**
 * Rótulo acima dos títulos: caixa alta, espaçado, na cor da raposa.
 * (Antes tinha um traço animado na frente; saiu porque não dizia nada e deixava o rótulo desalinhado do título.)
 */
export function Kicker({ children, className, center }: { children: React.ReactNode; className?: string; line?: string; center?: boolean }) {
  return <p className={cn("kicker", center && "text-center", className)}>{children}</p>;
}
