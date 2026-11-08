// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "Integrantes da Nine Tails comemorando em Houston";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Conquistas",
    title: "Cinco troféus",
    lead: "Rookie All Star, Rookie Inspiration no Mundial de Houston e Engineering Award.",
    photo: {
      src: "/team/2023-houston-abraco.webp"
    }
  });
}
