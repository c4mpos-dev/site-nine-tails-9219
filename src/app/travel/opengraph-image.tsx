// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A equipe Nine Tails no Space Center Houston";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Painel de embarque",
    title: "Saindo de Resende",
    lead: "Todas as viagens de competição da equipe, de Brasília a Houston.",
    photo: {
      src: "/team/2023-houston-space-center.webp",
      position: "50% 40%"
    }
  });
}
