// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "Alunos de escola pública com os projetos feitos na visita da Nine Tails";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Impacto",
    title: "6.222 crianças",
    lead: "Nine Learns, professores formados e times fundados na rede pública de Resende.",
    photo: {
      src: "/team/2025-maua-escola-visita.webp",
      position: "50% 55%"
    }
  });
}
