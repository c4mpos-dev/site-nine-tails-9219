import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Manifesto do site: nome e ícone quando alguém salva o site na tela inicial do celular. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description: "Equipe de FIRST Robotics Competition de Resende (RJ).",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9e19b8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
