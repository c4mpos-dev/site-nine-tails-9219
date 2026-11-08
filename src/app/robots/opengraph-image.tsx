// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogHangar } from "@/lib/og";
import { robots } from "@/content/robots";

export const alt = "Os seis robôs da Nine Tails #9219 lado a lado";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogHangar({
    kicker: "O hangar",
    title: "Seis robôs",
    lead: "Do tank drive ao swerve: cada temporada, um robô construído do zero.",
    cutouts: robots.flatMap((r) => (r.cutout ? [r.cutout] : [])),
  });
}
