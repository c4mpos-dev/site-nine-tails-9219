import Image from "next/image";
import { cn } from "@/lib/cn";

const box = {
  sm: "h-20 w-32 p-2",
  md: "h-28 w-full p-4",
};

/**
 * Logo do jogo numa placa branca de tamanho fixo. As logos têm formatos diferentes (faixa larga
 * ou selo quadrado), então cada uma cabe inteira na mesma caixa, centralizada, sem esticar.
 */
export function SeasonLogo({ src, game, size = "sm", className }: { src: string; game: string; size?: keyof typeof box; className?: string }) {
  return (
    <div className={cn("rounded-md bg-white", box[size], className)}>
      <div className="relative h-full w-full">
        <Image src={src} alt={`Logo ${game}`} fill sizes={size === "sm" ? "128px" : "260px"} quality={90} className="object-contain" />
      </div>
    </div>
  );
}
