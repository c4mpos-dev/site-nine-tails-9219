import Link from "next/link";
import Image from "next/image";
import type { Robot } from "@/content/robots";
import { getSeason } from "@/content/seasons";
import { awards } from "@/content/awards";
import { RobotBlueprint } from "./RobotBlueprint";

/** Tabela do hangar: todos os robôs lado a lado, para comparar temporada, tração, competições e prêmios. */
export function RobotTable({ robots }: { robots: Robot[] }) {
  const th = "px-4 py-3 text-left font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted";
  return (
    <div className="overflow-x-auto rounded-lg border border-line [scrollbar-width:thin]">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-surface">
          <tr className="border-b border-line">
            <th scope="col" className={th}>Robô</th>
            <th scope="col" className={th}>Temporada</th>
            <th scope="col" className={th}>Tração</th>
            <th scope="col" className={th}>Competições</th>
            <th scope="col" className={th}>Prêmios</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {robots.map((r) => {
            const season = getSeason(r.seasonSlug);
            const won = awards.filter((a) => r.awards?.includes(a.id));
            return (
              <tr key={r.slug} className="align-top transition-colors hover:bg-surface">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <Link href={`/robots/${r.slug}`} className="group flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line group-hover:ring-accent">
                      {r.thumb || r.photo ? (
                        <Image
                          src={r.thumb?.src ?? r.photo!}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                          style={{ objectPosition: r.thumb?.position ?? r.photoPosition ?? "center" }}
                        />
                      ) : (
                        <RobotBlueprint drivetrain={r.drivetrain} className="absolute inset-0 m-auto h-7 w-8 text-brand" />
                      )}
                    </span>
                    <span>
                      <span className="heading block text-xl transition-colors group-hover:text-accent">{r.name}</span>
                      <span className="text-xs text-muted">{r.order}</span>
                    </span>
                  </Link>
                </th>
                <td className="px-4 py-3">
                  <span className="font-bold">{r.year}</span>
                  {season && <span className="block text-muted">{season.game}</span>}
                </td>
                <td className="px-4 py-3">{r.drivetrain}</td>
                <td className="px-4 py-3">
                  {r.events.map((e) => (
                    <span key={e} className="block">{e}</span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {won.length > 0 ? (
                    won.map((a) => (
                      <span key={a.id} className="block font-bold text-accent">{a.title}</span>
                    ))
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
