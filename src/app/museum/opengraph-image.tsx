// Thumb da prévia de link desta página (desenhada no build por src/lib/og.tsx)
import { OG, ogCard } from "@/lib/og";

export const alt = "A placa do Rookie Inspiration Award, no Mundial de Houston 2023";
export const size = OG;
export const contentType = "image/jpeg";

export default function Image() {
  return ogCard({
    kicker: "Museu da Raposa",
    title: "O acervo",
    lead: "Fotos, troféus, robôs e objetos de cada temporada, sala por sala.",
    photo: {
      src: "/team/2023-houston-placa.webp"
    }
  });
}
