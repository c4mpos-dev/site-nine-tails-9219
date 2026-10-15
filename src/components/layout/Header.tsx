"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
