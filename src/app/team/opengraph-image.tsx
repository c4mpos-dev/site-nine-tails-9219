// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A equipe Nine Tails no box da Regional de São Paulo 2025";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Equipe",
    title: "Quem faz a raposa",
    lead: "Estudantes da Escola Firjan SENAI SESI Resende, mentores e ex-integrantes.",
    photo: {
      src: "/team/2025-sp-box-equipe.webp",
      position: "50% 40%"
    }
  });
}
