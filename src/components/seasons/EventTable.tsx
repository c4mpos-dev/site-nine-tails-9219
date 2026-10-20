import type { EventResult } from "@/content/seasons";

const kindLabel = { regional: "Regional", championship: "Mundial", offseason: "Off-season" };

/** Placar da temporada em tabela, fácil de ler e de comparar. */
export function EventTable({ events }: { events: EventResult[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-bold">Evento</th>
            <th className="px-4 py-3 font-bold">Ranking</th>
            <th className="px-4 py-3 font-bold">Resultado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {events.map((e) => (
            <tr key={e.name} className="align-top">
              <td className="px-4 py-4">
                <p className="font-bold text-fg">{e.name}</p>
                <p className="text-xs text-muted">
                  {kindLabel[e.kind]} · {e.location} · {e.dates}
                </p>
              </td>
              <td className="heading px-4 py-4 text-2xl">{e.rank ? `${e.rank}º` : "—"}</td>
              <td className="px-4 py-4">
                <p className="text-fg">{e.result}</p>
                {e.alliance && <p className="text-xs text-muted">{e.alliance}</p>}
                {e.awards?.map((a) => (
                  <p key={a} className="mt-1 flex items-center gap-2 text-xs font-bold text-accent">
                    <span className="size-1.5 rotate-45 bg-accent" />
                    {a}
                  </p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
