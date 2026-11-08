// Thumb da prévia de link de cada competição (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";
import { notFound } from "next/navigation";
import { competitions, getCompetition } from "@/lib/events";
import { seasonTeamCover } from "@/content/gallery";

export const alt = "Competição da Nine Tails #9219 na FRC";
export const size = OG;
export const contentType = "image/jpeg";

const kindLabel = { regional: "Regional", championship: "Mundial", offseason: "Off-season" };

export function generateStaticParams() {
  return competitions.map((c) => ({ key: c.key }));
}

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const c = getCompetition((await params).key);
  if (!c) notFound();
  // a mesma capa da página: a foto larga do museu, senão o robô, senão a equipe na temporada
  const wide = c.photos.find((p) => p.r >= 1.3);
  const team = seasonTeamCover(c.season.slug);
  const photo = wide
    ? { src: wide.src, position: wide.position }
    : c.robot?.photo
      ? { src: c.robot.photo, position: c.robot.photoPosition }
      : team && { src: team.src, position: team.position };
  return ogCard({
    kicker: `${kindLabel[c.event.kind]} · ${c.season.year}`,
    title: c.event.shortName,
    // onde e quando, e o prêmio quando teve
    lead: [`${c.event.location} · ${c.event.dates}`, c.event.awards?.find((a) => !a.startsWith("Wildcard"))].filter(Boolean).join(". "),
    photo: photo || undefined,
  });
}
