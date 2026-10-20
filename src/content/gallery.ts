/**
 * Fotos da própria equipe (vindas do Drive "Arquivos Nine Tails").
 * Para adicionar: converta para .webp, salve em /public/team e inclua aqui.
 */
export type TeamPhoto = { src: string; caption: string; position?: string };

export const teamPhotos: Record<string, TeamPhoto[]> = {
  "2023-charged-up": [
    { src: "/team/2023-houston-tank-tails.webp", caption: "Tank Tails em campo no Mundial de Houston.", position: "50% 60%" },
    { src: "/team/2023-brasilia-rookie-all-star.webp", caption: "Regional Brasil, em Brasília: a vaga para o Mundial." },
    { src: "/team/2023-houston-placa.webp", caption: "A placa do Rookie Inspiration Award, divisão Curie." },
    { src: "/team/2023-houston-abraco.webp", caption: "Houston, 2023." },
    { src: "/team/2023-tank-tails-construcao.webp", caption: "Tank Tails sendo montado na oficina.", position: "50% 70%" },
    { src: "/team/2023-houston-equipe.webp", caption: "Nos corredores do George R. Brown Center." },
  ],
  "2024-crescendo": [
    { src: "/team/2024-cuiaba-finalistas.webp", caption: "Finalistas no Off-Season do Mato Grosso, em Cuiabá.", position: "50% 55%" },
    { src: "/team/2024-cuiaba-pit.webp", caption: "O box da Nine Tails em Cuiabá." },
    { src: "/team/2024-cuiaba-premiacao.webp", caption: "Premiação do Festival SESI de Robótica.", position: "50% 45%" },
    { src: "/team/2024-cuiaba-pit-visitas.webp", caption: "Visitantes conhecendo o Nine Learns no box." },
  ],
  "2025-reefscape": [
    { src: "/team/2025-brasilia-arak-campo.webp", caption: "Arak em campo na Regional de Brasília.", position: "50% 60%" },
    { src: "/team/2025-arak.webp", caption: "Arak, o robô da Reefscape." },
    { src: "/team/2025-sp-campo.webp", caption: "Regional de São Paulo." },
    { src: "/team/2025-brasilia-palco.webp", caption: "Torneio SESI de Robótica, em Brasília.", position: "50% 30%" },
    { src: "/team/2025-sp-arena.webp", caption: "A arena da Regional de São Paulo." },
  ],
};

export const seasonTeamCover = (slug: string): TeamPhoto | undefined => teamPhotos[slug]?.[0];

/** Topo da home: a equipe inteira, uma foto por temporada (em ordem). Falta a de 2026. */
export type HeroPhoto = { year: string; game: string; src: string; alt: string; caption: string; position?: string };
export const heroTeamPhotos: HeroPhoto[] = [
  {
    year: "2023",
    game: "Charged Up",
    src: "/photos/hero-1.webp",
    alt: "A primeira formação da Nine Tails em frente à Escola Firjan SENAI Resende",
    caption: "A primeira formação, em frente à escola.",
    position: "50% 35%",
  },
  {
    year: "2024",
    game: "Crescendo",
    src: "/team/2024-equipe.webp",
    alt: "Equipe Nine Tails reunida na comemoração do Off-Season do Mato Grosso",
    caption: "Comemorando a final do Off-Season do Mato Grosso.",
    position: "50% 45%",
  },
  {
    year: "2025",
    game: "Reefscape",
    src: "/team/2025-equipe.webp",
    alt: "Equipe Nine Tails com a bandeira da Firjan na Regional de Brasília",
    caption: "Regional de Brasília, com a bandeira da Firjan.",
    position: "50% 60%",
  },
];
