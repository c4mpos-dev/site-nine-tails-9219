// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "O robô The Answer em partida";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Recordes",
    title: "Os números da arena",
    lead: "Maiores placares, sequências de vitórias e o aproveitamento de cada temporada.",
    photo: {
      src: "/team/2023-the-answer-partida.webp",
      position: "50% 78%"
    }
  });
}
