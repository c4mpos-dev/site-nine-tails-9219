"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const getTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

/** Alterna entre o tema claro (padrão) e o escuro, e lembra a escolha. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.setAttribute("data-theme", next);
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#14071a" : "#ffffff");
        try {
          localStorage.setItem("theme", next);
        } catch {}
      }}
      className={className}
      aria-label={next === "light" ? "Ativar tema claro" : "Ativar tema escuro"}
      title={next === "light" ? "Tema claro" : "Tema escuro"}
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

/** Script que aplica o tema salvo antes da primeira pintura (sem "piscar"). */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"#14071a":"#ffffff")}}catch(e){}})()`;
