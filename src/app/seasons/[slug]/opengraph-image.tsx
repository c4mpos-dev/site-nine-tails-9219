// Thumb da prévia de link de cada temporada (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";
import { notFound } from "next/navigation";
import { getSeason, seasons } from "@/content/seasons";
import { seasonPhotos } from "@/content/credits";
import { seasonTeamCover } from "@/content/gallery";

export const alt = "Temporada da Nine Tails #9219 na FRC";
export const size = OG;
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return seasons.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const season = getSeason((await params).slug);
  if (!season) notFound();
  // a mesma foto do topo da página: a equipe naquele ano, senão a foto do jogo
  const team = seasonTeamCover(season.slug);
  const stock = season.photos.length ? seasonPhotos[season.photos.at(-1)!] : undefined;
  const photo = team ? { src: team.src, position: team.position } : stock ? { src: stock.src } : undefined;
  return ogCard({ kicker: `Temporada ${season.year}`, title: season.game, lead: season.headline, photo });
}
