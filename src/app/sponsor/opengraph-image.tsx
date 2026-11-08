// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A equipe Nine Tails com o robô na Regional de São Paulo 2026";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Apoie a equipe",
    title: "Patrocine a raposa",
    lead: "Invista em educação STEAM e na próxima geração de engenheiros de Resende.",
    photo: {
      src: "/team/2026-sp-equipe-robo.webp",
      position: "50% 45%"
    }
  });
}
