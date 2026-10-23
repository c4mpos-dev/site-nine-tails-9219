"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { SearchItem } from "@/lib/searchIndex";
import { cn } from "@/lib/cn";
import { startRouteTransition } from "@/components/layout/RouteTransition";

/** Minúsculas e sem acento, para "cuiaba" achar "Cuiabá". */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Prepared = SearchItem & { nt: string; ns: string; nx: string };

/** Desempate: com a mesma relevância, competição/robô/temporada vêm antes de uma foto do museu. */
const weight: Record<SearchItem["k"], number> = {
  competição: 3,
  robô: 3,
  temporada: 3,
  prêmio: 2,
  página: 2,
  pessoa: 2,
  termo: 1,
  diário: 1,
  patrocinador: 1,
  museu: 0,
  equipe: 0,
};

function rank(items: Prepared[], q: string) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { it: Prepared; score: number }[] = [];
  for (const it of items) {
    let score = 0;
    for (const w of words) {
      if (it.nt.startsWith(w) || it.nt.includes(` ${w}`)) score += 6;
      else if (it.nt.includes(w)) score += 4;
      else if (it.ns.includes(w)) score += 2;
      else if (it.nx.includes(w)) score += 1;
      else {
        score = 0;
        break;
      }
    }
    if (score) scored.push({ it, score: score + weight[it.k] });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.it.t.length - b.it.t.length)
    .slice(0, 40)
    .map((x) => x.it);
}

const ideas = ["Houston", "Predator", "swerve", "Rookie Inspiration", "Cuiabá", "alumni", "cone", "Osasco"];

/** Busca no site inteiro: robôs, competições, prêmios, pessoas, fotos do museu, termos. Abre com Ctrl+K ou "/". */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Prepared[] | null>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  // Fecha e limpa, para a próxima busca começar do zero
  const close = () => {
    setOpen(false);
    setQ("");
    setSel(0);
  };

  // Atalhos: Ctrl/Cmd+K em qualquer lugar; "/" fora de campos de texto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Ao abrir: carrega o índice (uma vez), foca o campo e trava a rolagem da página
  useEffect(() => {
    if (!open) return;
    if (!items)
      import("@/lib/searchIndex").then(({ searchIndex }) =>
        setItems(searchIndex.map((it) => ({ ...it, nt: norm(it.t), ns: norm(it.s), nx: norm(it.x ?? "") }))),
      );
    input.current?.focus();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open, items]);

  const results = useMemo(() => (items ? rank(items, q) : []), [items, q]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (it: SearchItem) => {
    close();
    startRouteTransition(it.h);
    router.push(it.h);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[sel]) go(results[sel]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar no site"
        className={cn(
          "flex items-center gap-2 rounded-md text-muted transition-colors hover:bg-surface hover:text-fg",
          "size-10 justify-center xl:w-auto xl:justify-start xl:border xl:border-line xl:px-3",
          className,
        )}
      >
        <Search className="size-[18px]" />
        <span className="hidden text-sm xl:inline">Buscar</span>
        <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] xl:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-3 pt-[10vh] backdrop-blur-sm" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar no site"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="flex max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-line bg-bg shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-5 shrink-0 text-muted" />
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                placeholder="Robô, competição, pessoa, prêmio, foto…"
                aria-label="O que você procura?"
                aria-controls="busca-resultados"
                aria-activedescendant={results[sel] ? `busca-${sel}` : undefined}
                className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Fechar busca"
                className="grid size-8 shrink-0 place-items-center rounded text-muted hover:bg-surface hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            {q.trim() === "" ? (
              <div className="p-4">
                <p className="text-sm text-muted">Esqueceu algum detalhe? Procure por um robô, uma cidade, um prêmio, um nome ou um momento.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ideas.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setQ(i);
                        setSel(0);
                        input.current?.focus();
                      }}
                      className="rounded-full border border-line px-3 py-1 text-sm hover:border-accent hover:text-accent"
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            ) : !items ? (
              <p className="p-4 text-sm text-muted">Carregando…</p>
            ) : results.length === 0 ? (
              <p className="p-4 text-sm text-muted">Nada encontrado para “{q}”.</p>
            ) : (
              <ul ref={list} id="busca-resultados" role="listbox" className="overflow-y-auto p-2">
                {results.map((it, i) => (
                  <li key={`${it.h}-${it.t}`} id={`busca-${i}`} role="option" aria-selected={i === sel} data-i={i}>
                    <button
                      type="button"
                      onClick={() => go(it)}
                      onMouseMove={() => setSel(i)}
                      className={cn("flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left", i === sel && "bg-surface")}
                    >
                      <span className="mt-0.5 w-20 shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent">{it.k}</span>
                      <span className="min-w-0">
                        <span className="block font-bold text-fg">{it.t}</span>
                        <span className="block truncate text-sm text-muted">{it.s}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
