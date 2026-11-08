// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "Pioneiros da Nine Tails no Space Center Houston";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Os pioneiros",
    title: "A primeira temporada",
    lead: "CHARGED UP, 2023: da seletiva ao Mundial de Houston, contada por quem estava lá.",
    photo: {
      src: "/team/2023-houston-space-center.webp",
      position: "50% 40%"
    }
  });
}
