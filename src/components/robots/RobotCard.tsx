import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Robot } from "@/content/robots";
import { RobotBlueprint } from "./RobotBlueprint";

export function RobotCard({ robot }: { robot: Robot }) {
  return (
    <Link href={`/robos/${robot.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-2">
        {robot.photo ? (
          <Image
            src={robot.photo}
            alt={`Robô ${robot.name}`}
            fill
            sizes="(min-width:1024px) 30vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <RobotBlueprint drivetrain={robot.drivetrain} className="absolute inset-0 m-auto h-[80%] w-[80%] text-brand opacity-80" />
        )}
        <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 text-xs font-bold text-white">{robot.year}</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="heading text-2xl transition-colors group-hover:text-accent">{robot.name}</h3>
          <p className="text-sm text-muted">{robot.drivetrain}</p>
        </div>
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
      </div>
    </Link>
  );
}
