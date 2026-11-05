import Link from "next/link";
import type { EventResult } from "@/content/seasons";
import { reach } from "@/lib/matchStats";

const kindLabel = { regional: "Regional", championship: "Mundial", offseason: "Off-season" };

/** Campanha da temporada em tabela: até onde a raposa foi em cada evento e o que trouxe de lá. */
export function EventTable({ events }: { events: EventResult[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-bold">Evento</th>
            <th className="px-4 py-3 font-bold">Campanha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {events.map((e) => {
            const playoffs = reach(e.result) > 0;
            return (
              <tr key={e.key} className="align-top">
                <td className="px-4 py-4">
                  <Link href={`/competitions/${e.key}`} className="font-bold text-fg hover:text-accent">
                    {e.name} <span className="text-accent">→</span>
                  </Link>
                  <p className="text-xs text-muted">
                    {kindLabel[e.kind]} · {e.location} · {e.dates}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className={playoffs ? "font-bold text-fg" : "text-muted"}>{playoffs ? e.result : "Fase de qualificações"}</p>
                  {e.alliance && <p className="text-xs text-muted">{e.alliance}</p>}
                  {/* Ranking só quando ficou entre os 10 primeiros */}
                  {e.rank && e.rank <= 10 && <p className="text-xs text-muted">{e.rank}º no ranking das qualificações</p>}
                  {e.awards?.map((a) => (
                    <p key={a} className="mt-1 flex items-center gap-2 text-xs font-bold text-accent">
                      <span className="size-1.5 rotate-45 bg-accent" />
                      {a}
                    </p>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
