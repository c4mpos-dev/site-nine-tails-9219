"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nav, navMore, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  // O menu fica aberto só na rota em que foi aberto: ao navegar, fecha sozinho.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Nine Tails, página inicial">
          <Image src="/brand/emblem.webp" alt="" width={48} height={44} className="h-10 w-auto" />
          <span className="heading text-xl tracking-wide">
            Nine Tails <span className="text-accent">#{site.number}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-sm font-bold transition-colors",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-accent" />}
              </Link>
            );
          })}
          <MoreMenu pathname={pathname} />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="grid size-10 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg" />
          <Link
            href="/patrocine"
            className="hidden rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-strong sm:inline-block"
          >
            Apoie a equipe
          </Link>
          <button
            type="button"
            onClick={() => setOpenOn(open ? null : pathname)}
            className="grid size-10 place-items-center rounded-md text-fg hover:bg-surface lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menu móvel"
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg px-6 py-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[{ href: "/", label: "Início" }, ...nav, { href: "/patrocine", label: "Apoie a equipe" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "heading block border-b border-line py-4 text-3xl",
                  pathname === item.href ? "text-accent" : "text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
            <p className="kicker mt-8">Mais</p>
            <ul className="mt-2">
              {navMore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("block border-b border-line py-3", pathname === item.href ? "text-accent" : "text-fg")}
                  >
                    <span className="text-lg font-bold">{item.label}</span>
                    <span className="block text-sm text-muted">{item.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Menu "Mais": abre no clique (e no teclado), fecha ao clicar fora, com Esc ou ao navegar. */
function MoreMenu({ pathname }: { pathname: string }) {
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const ref = useRef<HTMLDivElement>(null);
  const active = navMore.some((i) => pathname.startsWith(i.href));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpenOn(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpenOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="menu-mais"
        className={cn(
          "relative flex items-center gap-1 py-1 text-sm font-bold transition-colors",
          active || open ? "text-fg" : "text-muted hover:text-fg",
        )}
      >
        Mais <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        {active && <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-accent" />}
      </button>
      {open && (
        <ul
          id="menu-mais"
          className="absolute right-0 top-full mt-5 w-72 overflow-hidden rounded-lg border border-line bg-surface-2 py-2 shadow-xl"
        >
          {navMore.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block px-4 py-2.5 hover:bg-surface">
                <span className={cn("text-sm font-bold", pathname === item.href ? "text-accent" : "text-fg")}>{item.label}</span>
                <span className="block text-xs text-muted">{item.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
