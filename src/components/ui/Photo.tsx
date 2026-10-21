import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

/**
 * Foto com legenda opcional. Sem `src`, mostra um espaço reservado discreto
 * para a equipe colocar a foto depois. Com foto, amplia ao clicar.
 */
export function Photo({
  src,
  alt,
  caption,
  credit,
  className,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  eager,
  placeholder = "Foto em breve",
  position,
}: {
  src?: string;
  alt: string;
  caption?: string;
  credit?: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  eager?: boolean;
  placeholder?: string;
  /** object-position da foto, ex.: "50% 30%". */
  position?: string;
}) {
  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden rounded-lg bg-surface-2", src && "zoomable", aspect)} {...(src ? zoom(src, caption ?? alt) : {})}>
        {src ? (
          <Image
            quality={90}
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-line text-muted">
            <ImageIcon className="size-6" />
            <span className="text-sm">{placeholder}</span>
          </div>
        )}
      </div>
      {(caption || credit) && (
        <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 text-sm text-muted">
          {caption && <span>{caption}</span>}
          {credit && <span className="text-xs opacity-80">Foto: {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
