/**
 * Fotos da própria equipe (vindas do Drive "Arquivos Nine Tails").
 * Para adicionar: converta para .webp, salve em /public/team e inclua aqui.
 */
export type TeamPhoto = { src: string; caption: string; position?: string };

export const teamPhotos: Record<string, TeamPhoto[]> = {
  "2023-charged-up": [
    { src: "/team/2023-houston-tank-tails.webp", caption: "Tank Tails em campo no Mundial de Houston.", position: "50% 60%" },
    { src: "/team/2023-brasilia-arena-box.webp", caption: "Na arena da Regional Brasil, em Brasília: a campanha que valeu a vaga para o Mundial." },
    { src: "/team/2023-houston-placa.webp", caption: "A placa do Rookie Inspiration Award, divisão Curie." },
    { src: "/team/2023-oficina-treino.webp", caption: "Na oficina, durante o treino.", position: "50% 30%" },
    { src: "/team/2023-houston-equipe.webp", caption: "Nos corredores do George R. Brown Center." },
    { src: "/team/2023-houston-pos-premiacao.webp", caption: "Houston, logo depois da premiação." },
  ],
  "2024-crescendo": [
    { src: "/team/2024-cuiaba-alianca-finalista.webp", caption: "A aliança finalista do Off-Season do Mato Grosso, com a 7033 e a 9994." },
    { src: "/team/2024-predator.webp", caption: "Predator em quadra, com a bandeira da raposa.", position: "50% 46%" },
    { src: "/team/2024-cuiaba-finalistas.webp", caption: "Finalistas no Off-Season do Mato Grosso, em Cuiabá.", position: "50% 55%" },
    { src: "/team/2024-cuiaba-pit-predator.webp", caption: "Ajustes no Predator, no box." },
    { src: "/team/2024-garuttinho.webp", caption: "Garuttinho em quadra na Regional de Brasília." },
    { src: "/team/2024-cuiaba-pit.webp", caption: "O box da Nine Tails em Cuiabá." },
    { src: "/team/2024-cuiaba-premiacao.webp", caption: "Premiação do Festival SESI de Robótica.", position: "50% 45%" },
    { src: "/team/2024-cuiaba-pit-visitas.webp", caption: "Visitantes conhecendo o Nine Learns no box." },
  ],
  "2025-reefscape": [
    { src: "/team/2025-brasilia-arak-campo.webp", caption: "Arak em campo na Regional de Brasília.", position: "50% 60%" },
    { src: "/team/2025-equipe.webp", caption: "A equipe com a bandeira da Firjan em Brasília." },
    { src: "/team/2025-arak.webp", caption: "Arak, o robô da Reefscape." },
    { src: "/team/2025-sp-campo.webp", caption: "Regional de São Paulo." },
    { src: "/team/2025-brasilia-palco.webp", caption: "Torneio SESI de Robótica, em Brasília.", position: "50% 30%" },
    { src: "/team/2025-sp-arena.webp", caption: "A arena da Regional de São Paulo." },
  ],
  "2026-rebuilt": [
    { src: "/team/2026-sp-equipe-robo.webp", caption: "A drive team com o robô na arena da Regional de São Paulo.", position: "50% 45%" },
    { src: "/team/2026-sp-robo-quadra.webp", caption: "Em quadra, entre as bolas de fuel.", position: "50% 62%" },
    { src: "/team/2026-sp-piloto.webp", caption: "No controle, com a bandeira do Brasil na manga.", position: "50% 40%" },
    { src: "/team/2026-oficina-intake.webp", caption: "O intake de rodas verdes ganhando forma na oficina." },
    { src: "/team/2026-sp-entrada-quadra.webp", caption: "Levando o robô para a quadra.", position: "50% 62%" },
    { src: "/team/2026-oficina-chassi.webp", caption: "A base com os quatro módulos de tração e bumpers improvisados para os testes." },
    { src: "/team/2026-sp-mascote.webp", caption: "Encontro com o mascote no Festival SESI de Educação.", position: "50% 55%" },
    { src: "/team/2026-oficina-prototipo.webp", caption: "Testando o mecanismo num modelo de MDF em tamanho real.", position: "50% 60%" },
    { src: "/team/2026-sp-robo-arena.webp", caption: "O robô ao lado do campo, pronto para a próxima partida.", position: "50% 60%" },
    { src: "/team/2026-sp-drive-team.webp", caption: "A drive team na beira da quadra.", position: "50% 55%" },
  ],
};

export const seasonTeamCover = (slug: string): TeamPhoto | undefined => teamPhotos[slug]?.[0];

/** Topo da home: a equipe, uma foto por temporada (em ordem). */
export type HeroPhoto = { year: string; game: string; src: string; alt: string; caption: string; position?: string };
export const heroTeamPhotos: HeroPhoto[] = [
  {
    year: "2023",
    game: "Charged Up",
    src: "/team/2023-houston-equipe-bandeira.webp",
    alt: "A equipe Nine Tails em Houston com a placa do Rookie Inspiration Award e a bandeira do Brasil",
    caption: "Em Houston, com o Rookie Inspiration Award e a bandeira do Brasil.",
    position: "50% 62%",
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
    src: "/team/2025-sp-equipe-banner.webp",
    alt: "Equipe Nine Tails com as bandeiras da equipe e da Firjan na Regional de São Paulo",
    caption: "Regional de São Paulo, com as bandeiras da equipe e da Firjan.",
    position: "50% 40%",
  },
  {
    year: "2026",
    game: "REBUILT",
    src: "/team/2026-festival-sesi-equipe.webp",
    alt: "Equipe Nine Tails com as bandeiras da equipe, da Firjan e do Rio de Janeiro no Festival SESI de Educação",
    caption: "No Festival SESI de Educação, com as bandeiras da equipe, da Firjan e do Rio.",
    position: "50% 40%",
  },
];
