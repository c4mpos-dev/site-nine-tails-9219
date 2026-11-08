"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nav, navMore, site } from "@/content/site";
import { SiteSearch } from "./SiteSearch";
import { cn } from "@/lib/cn";

// Menu do celular: o painel desce como uma cortina e os links entram em cascata; ao fechar, sobe de volta
const ease = [0.22, 1, 0.36, 1] as const;
const panel: Variants = {
  closed: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3, ease, when: "afterChildren", staggerChildren: 0.015, staggerDirection: -1 } },
  open: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.45, ease, staggerChildren: 0.035, delayChildren: 0.08 } },
};
const row: Variants = {
  closed: { opacity: 0, x: -16, transition: { duration: 0.12 } },
  open: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
};

export function Header() {
  const pathname = usePathname();
  // O menu fica aberto só na rota em que foi aberto: ao navegar, fecha sozinho.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Nine Tails, página inicial">
            <Image src="/brand/emblem.webp" alt="" width={48} height={44} className="h-10 w-auto" />
            <span className="heading whitespace-nowrap text-lg tracking-wide sm:text-xl">
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
                  className={cn("relative py-1 text-sm font-bold transition-colors", active ? "text-fg" : "text-muted hover:text-fg")}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-accent" />}
                </Link>
              );
            })}
            <MoreMenu pathname={pathname} />
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <SiteSearch />
            <Link
              href="/sponsor"
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: open ? -90 : 90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: open ? 90 : -90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Fora do <header>: o backdrop-blur dele prenderia o "fixed" à altura do cabeçalho */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menu móvel"
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-bg px-6 py-6 lg:hidden"
            variants={panel}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {[{ href: "/", label: "Início" }, ...nav, { href: "/sponsor", label: "Apoie a equipe" }].map((item) => (
              <motion.div key={item.href} variants={row}>
                <Link href={item.href} className={cn("heading block border-b border-line py-4 text-3xl", pathname === item.href ? "text-accent" : "text-fg")}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.p variants={row} className="kicker mt-8">
              Mais
            </motion.p>
            <ul className="mt-2">
              {navMore.map((item) => (
                <motion.li key={item.href} variants={row}>
                  <Link href={item.href} className={cn("block border-b border-line py-3", pathname === item.href ? "text-accent" : "text-fg")}>
                    <span className="text-lg font-bold">{item.label}</span>
                    <span className="block text-sm text-muted">{item.note}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
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
        className={cn("relative flex items-center gap-1 py-1 text-sm font-bold transition-colors", active || open ? "text-fg" : "text-muted hover:text-fg")}
      >
        Mais <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        {active && <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-accent" />}
      </button>
      {open && (
        <ul id="menu-mais" className="absolute right-0 top-full mt-5 w-72 overflow-hidden rounded-lg border border-line bg-surface-2 py-2 shadow-xl">
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
