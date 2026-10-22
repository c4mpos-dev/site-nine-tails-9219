"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/icons/Social";
import type { Alumnus } from "@/content/alumni";
import { cn } from "@/lib/cn";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const period = (y?: [number, number?]) => (!y ? "" : y[1] ? (y[1] === y[0] ? `${y[0]}` : `${y[0]}–${y[1]}`) : `desde ${y[0]}`);

/** Ícone de rede: link quando preenchido; apagado (com "a adicionar") quando vazio. */
function Net({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href)
    return (
      <span title={`${label}: a adicionar`} className="grid size-9 place-items-center rounded-md text-muted/40">
        {children}
      </span>
    );
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-9 place-items-center rounded-md text-accent hover:bg-surface-2">
      {children}
    </a>
  );
}

/**
 * Lista compacta dos alumni, uma linha por pessoa, com busca por nome, área ou o que faz hoje.
 * Pensada para crescer: dezenas de nomes continuam cabendo numa tela.
 */
export function AlumniDirectory({ alumni }: { alumni: Alumnus[] }) {
  const [q, setQ] = useState("");
  // Coluna "Época" só aparece quando alguém já tem os anos preenchidos
  const years = alumni.some((a) => a.years);
  const cols = years ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_7rem_5.5rem]" : "md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_5.5rem]";
  const list = useMemo(() => {
    const w = norm(q.trim());
    if (!w) return alumni;
    return alumni.filter((a) => norm([a.name, a.role, a.area, a.did, a.now, a.instagram].filter(Boolean).join(" ")).includes(w));
  }, [alumni, q]);

  return (
    <div>
      <label className="flex items-center gap-3 rounded-md border border-line bg-bg px-3 focus-within:border-accent sm:max-w-sm">
        <Search className="size-4 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, área ou profissão"
          aria-label="Buscar alumni"
          className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>

      {/* Cabeçalho das colunas, só no desktop */}
      <div className={cn("mt-6 hidden gap-4 border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:grid", cols)}>
        <span>Nome</span>
        <span>Na equipe / hoje</span>
        {years && <span>Época</span>}
        <span className="text-right">Redes</span>
      </div>

      <ul className="mt-2 divide-y divide-line md:mt-0">
        {list.map((a) => (
          <li key={a.name} className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3", cols)}>
            <span className="flex min-w-0 items-center gap-3">
              <span aria-hidden className="heading grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-sm text-accent">
                {initials(a.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold">{a.name}</span>
                {a.area && <span className="block text-xs text-muted">{a.area}</span>}
              </span>
            </span>
            <span className="col-start-1 row-start-2 pl-[3.25rem] text-sm text-muted md:col-start-auto md:row-start-auto md:pl-0">
              {a.did && <span className="block text-fg">{a.did}</span>}
              <span className={cn(a.did && "text-xs")}>{a.now ?? a.role}</span>
            </span>
            {years && <span className="hidden font-mono text-xs text-muted md:block">{period(a.years) || "—"}</span>}
            <span className="col-start-2 row-span-2 row-start-1 flex justify-end md:col-start-auto md:row-span-1 md:row-start-auto">
              <Net href={a.instagram ? `https://www.instagram.com/${a.instagram}/` : undefined} label={a.instagram ? `Instagram @${a.instagram}` : "Instagram"}>
                <InstagramIcon className="size-[18px]" />
              </Net>
              <Net href={a.linkedin || undefined} label={`LinkedIn de ${a.name}`}>
                <LinkedinIcon className="size-[18px]" />
              </Net>
            </span>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="py-6 text-sm text-muted">Ninguém encontrado para “{q}”.</p>}
    </div>
  );
}
