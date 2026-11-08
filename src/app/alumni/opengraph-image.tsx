// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A primeira turma da Nine Tails com a bandeira do Brasil em Houston";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Alumni",
    title: "Quem já vestiu a camisa",
    lead: "O que cada um fazia na equipe e o que faz hoje.",
    photo: {
      src: "/team/2023-houston-equipe-bandeira.webp",
      position: "50% 36%"
    }
  });
}
