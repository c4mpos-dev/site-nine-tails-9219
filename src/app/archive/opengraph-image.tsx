// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "O robô The Answer em partida";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Mais",
    title: "Tudo o que sobrou",
    lead: "Recordes, viagens, museu, alumni, o diário dos pioneiros e o glossário.",
    photo: {
      src: "/team/2023-the-answer-partida.webp",
      position: "50% 78%"
    }
  });
}
