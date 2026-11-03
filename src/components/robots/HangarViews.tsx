"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GalleryVerticalEnd, LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/cn";

const KEY = "nt:hangar-view";

const options = [
  { id: "sheets", label: "Fichas", icon: GalleryVerticalEnd },
  { id: "grid", label: "Galeria", icon: LayoutGrid },
  { id: "table", label: "Comparar", icon: Table2 },
] as const;

type View = (typeof options)[number]["id"];

/**
 * Troca o jeito de ver o hangar: fichas grandes, galeria de fotos ou tabela para comparar.
 * As três vistas chegam prontas do servidor; aqui só escolhemos qual mostrar e lembramos a escolha.
 */
export function HangarViews({ title, views }: { title: React.ReactNode; views: Record<View, React.ReactNode> }) {
  const [view, setView] = useState<View>("sheets");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (options.some((o) => o.id === saved)) setView(saved as View);
    } catch {}
  }, []);

  const pick = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {title}
        <div role="tablist" aria-label="Modo de exibição" className="inline-flex rounded-full border border-line bg-surface p-1">
          {options.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={view === o.id}
              onClick={() => pick(o.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors",
                view === o.id ? "text-white" : "text-muted hover:text-fg",
              )}
            >
              {view === o.id && <motion.span layoutId="hangar-view" className="absolute inset-0 rounded-full bg-brand" />}
              <o.icon className="relative size-4" aria-hidden />
              <span className="relative">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {views[view]}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
