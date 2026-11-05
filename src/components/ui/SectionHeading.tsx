import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { Kicker } from "./Kicker";

export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {kicker && <Kicker center={align === "center"}>{kicker}</Kicker>}
      <h2 className="heading mt-3 text-4xl sm:text-5xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  );
}
