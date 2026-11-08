// Thumb da prévia de link de cada robô (desenhada no build por src/lib/og.tsx)
import { OG, ogCard, ogRobot } from "@/lib/og";
import { getRobot, robots } from "@/content/robots";
import { getSeason } from "@/content/seasons";

export const alt = "Robô da Nine Tails #9219";
export const size = OG;
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const robot = getRobot((await params).slug)!;
  const game = getSeason(robot.seasonSlug)?.game;
  const kicker = `Robô ${robot.year}${game ? ` · ${game}` : ""}`;
  if (robot.cutout) return ogRobot({ kicker, name: robot.name, lead: `${robot.drivetrain}. ${robot.tagline}`, cutout: robot.cutout });
  return ogCard({ kicker, title: robot.name, lead: robot.tagline, photo: robot.photo ? { src: robot.photo, position: robot.photoPosition } : undefined });
}
