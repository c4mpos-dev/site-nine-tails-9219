// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A equipe Nine Tails #9219 reunida no Festival SESI de Robótica 2026";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Equipe 9219 · FRC desde 2022",
    title: "Nine Tails",
    lead: "Seis robôs, cinco troféus e 6.222 crianças levadas à robótica, saindo de Resende.",
    photo: {
      src: "/team/2026-festival-sesi-equipe.webp",
      position: "50% 40%"
    },
    brand: false
  });
}
