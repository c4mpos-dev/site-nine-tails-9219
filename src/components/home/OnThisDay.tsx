"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { zoom } from "@/lib/zoom";

export type Memory = {
  key: string;
  title: string;
  where: string;
  dates: string;
  result: string;
  /** Ano, mês (0–11) e dia de início. */
  y: number;
  m: number;
  d: number;
  photo?: { src: string; title: string; position?: string };
};

const DAY = 86_400_000;

// A data muda no máximo uma vez por dia; o servidor não sabe o dia de quem visita
const subscribe = () => () => {};
const today = () => new Date().toDateString();
const serverToday = () => null;

/**
 * Distância até o aniversário da data mais próximo de hoje: dias desde o último
 * (ou, se o próximo está a até 3 semanas, dias negativos até ele) e quantos anos ele marca.
 */
function anniversary(now: Date, m: Memory) {
  const t = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let y = now.getFullYear();
  if (Date.UTC(y, m.m, m.d) > t) y -= 1;
  const past = Math.round((t - Date.UTC(y, m.m, m.d)) / DAY);
  const next = Math.round((Date.UTC(y + 1, m.m, m.d) - t) / DAY);
  return next < past && next <= 21 ? { days: -next, years: y + 1 - m.y } : { days: past, years: y - m.y };
}

function phrase(days: number, years: number) {
  const anos = `${years} ${years === 1 ? "ano" : "anos"}`;
  if (years === 0) return days < 45 ? `Há ${days} dias` : `Há ${Math.round(days / 30.4)} meses`;
  if (days === 0) return `Hoje faz ${anos}`;
  if (days < 0) return `Daqui a ${-days} ${days === -1 ? "dia" : "dias"} faz ${anos}`;
  if (days <= 7) return `Faz ${anos}, nesta semana`;
  return `Faz ${anos} e ${days} dias`;
}

/** "Neste dia": a competição cujo aniversário está mais perto de hoje, com uma foto daquele evento. */
export function OnThisDay({ memories }: { memories: Memory[] }) {
  const day = useSyncExternalStore(subscribe, today, serverToday);
  if (!day) return <div aria-hidden className="h-[22rem] rounded-lg border border-line bg-surface sm:h-72" />;

  const now = new Date(day);
  const ranked = memories
    .filter((m) => m.y < now.getFullYear() || (m.y === now.getFullYear() && new Date(Date.UTC(m.y, m.m, m.d)) < now))
    .map((m) => ({ m, ...anniversary(now, m) }))
    .sort((a, b) => Math.abs(a.days) - Math.abs(b.days));
  const pick = ranked.find((r) => r.m.photo) ?? ranked[0];
  if (!pick) return null;
  const { m, days, years } = pick;

  return (
    <div className="grid overflow-hidden rounded-lg border border-line bg-surface sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {m.photo && (
        <div {...zoom(m.photo.src, m.photo.title)} className="zoomable relative min-h-56 bg-surface-2">
          <Image
            src={m.photo.src}
            alt={m.photo.title}
            fill
            sizes="(min-width:640px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: m.photo.position }}
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <p className="kicker">Neste dia na raposa</p>
        <p className="heading mt-2 text-3xl leading-tight sm:text-4xl">{phrase(days, years)}</p>
        <p className="mt-3 text-lg">
          <strong>{m.title}</strong>, em {m.where} ({m.dates}).
        </p>
        <p className="mt-1 text-muted">{m.result}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
          <Link href={`/competitions/${m.key}`} className="inline-flex items-center gap-1 text-accent hover:underline">
            Relembrar a competição <ArrowRight className="size-4" />
          </Link>
          <Link href="/museum" className="text-muted hover:text-fg">
            Ver mais momentos no museu
          </Link>
        </div>
      </div>
    </div>
  );
}
