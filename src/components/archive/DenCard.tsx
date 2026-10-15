"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useSyncExternalStore } from "react";
import { TOCA_KEY } from "./FoxSecret";

const read = () => {
  try {
    return localStorage.getItem(TOCA_KEY) === "1";
  } catch {
    return false;
  }
};

/** Cartão da toca no arquivo: trancado até a pessoa achar o easter egg. */
export function DenCard() {
  const found = useSyncExternalStore(
    () => () => {},
    read,
    () => false,
  );

  if (found) {
    return (
      <Link href="/toca" className="group flex h-full flex-col rounded-lg border border-accent/60 p-6 transition-colors hover:bg-surface">
        <p className="kicker">Encontrada</p>
        <h2 className="heading mt-2 text-3xl group-hover:text-accent">A toca da raposa</h2>
        <p className="mt-2 flex-1 text-muted">Kit de marcas e coisas que só a raposa sabe. Você já sabe o caminho.</p>
        <span className="text-link mt-4 self-start">Entrar →</span>
      </Link>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed border-line p-6">
      <p className="kicker flex items-center gap-2">
        <Lock className="size-3.5" /> Trancada
      </p>
      <h2 className="heading mt-2 text-3xl text-muted">???</h2>
      <p className="mt-2 flex-1 text-muted">
        Existe uma página que não aparece em menu nenhum. A pista está no rodapé, e tem a ver com o nome da equipe.
      </p>
    </div>
  );
}
