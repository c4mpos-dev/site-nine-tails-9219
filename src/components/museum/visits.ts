"use client";

import { useSyncExternalStore } from "react";

/** Salas já visitadas (carimbos do ingresso), guardadas no navegador do visitante. */
const KEY = "museu-carimbos";
const EVENT = "museu:carimbo";

// Cópia em memória: sem armazenamento, o carimbo vale até recarregar a página
let memory = "";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

export function stamp(id: string) {
  const ids = new Set(read().split(",").filter(Boolean));
  if (ids.has(id)) return;
  ids.add(id);
  memory = [...ids].join(",");
  try {
    localStorage.setItem(KEY, memory);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Lista de salas carimbadas (string separada por vírgula, para o snapshot ser estável). */
export function useVisited(): string[] {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return raw.split(",").filter(Boolean);
}
