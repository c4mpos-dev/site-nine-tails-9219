// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "Robô da Nine Tails na arena da Regional de São Paulo 2026";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Glossário",
    title: "Fala FRC?",
    lead: "Swerve, alliance, ranking point: os termos da FIRST Robotics Competition, explicados.",
    photo: {
      src: "/team/2026-sp-robo-arena.webp"
    }
  });
}
