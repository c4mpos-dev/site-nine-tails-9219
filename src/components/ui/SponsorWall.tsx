import Image from "next/image";
import { sponsors, type Sponsor } from "@/content/sponsors";
import { cn } from "@/lib/cn";

/**
 * Logo oficial do patrocinador numa placa branca (as marcas são feitas para fundo claro, nos dois temas).
 * Quem ainda não tem arquivo de logo aparece com o nome escrito, na mesma placa.
 */
function Plate({ s, big }: { s: Sponsor; big?: boolean }) {
  return (
    <li title={s.name} className={cn("grid place-items-center rounded-md border border-line bg-white px-4", big ? "h-24 sm:h-28" : "h-20")}>
      {s.logo ? (
        <div className={cn("relative w-full", big ? "h-12 sm:h-14" : "h-12")}>
          <Image src={s.logo} alt={s.name} fill sizes={big ? "220px" : "160px"} quality={90} className="object-contain" />
        </div>
      ) : (
        <span className="text-balance text-center text-sm font-bold uppercase leading-tight tracking-wide text-[#2a1838]">{s.name}</span>
      )}
    </li>
  );
}

const tiers: { key: Sponsor["tier"]; label: string }[] = [
  { key: "institution", label: "Instituição" },
  { key: "major", label: "Patrocinadores" },
  { key: "partner", label: "Parceiros" },
];

/** Mural de patrocinadores por categoria, com as logos oficiais. */
export function SponsorWall({ labels = true, className }: { labels?: boolean; className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {tiers.map((t) => (
        <div key={t.key}>
          {labels && <p className="mb-3 text-sm font-bold text-muted">{t.label}</p>}
          <ul className={cn("grid gap-3", t.key === "partner" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
            {sponsors
              .filter((s) => s.tier === t.key)
              .map((s) => (
                <Plate key={s.name} s={s} big={t.key !== "partner"} />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
