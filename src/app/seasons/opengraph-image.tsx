// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A drive team da Nine Tails na estação de pilotagem da Regional de Brasília 2024";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Temporadas",
    title: "De 2023 a 2027",
    lead: "Cada ano, um jogo novo e um robô construído do zero.",
    photo: {
      src: "/team/2024-brasilia-estacao-pilotos.webp",
      position: "50% 40%"
    }
  });
}
