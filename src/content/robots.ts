export type Robot = {
  slug: string;
  name: string;
  year: number;
  seasonSlug: string;
  order: string;
  drivetrain: string;
  tagline: string;
  description: string;
  features: string[];
  events: string[];
  /** Prêmios ligados a este robô (ids de src/content/awards.ts). */
  awards?: string[];
  /** Eventos com partidas no TBA (chaves de matchEvents em src/content/allies.ts). */
  matchEvents?: string[];
  photo?: string;
  /** Enquadramento da foto (object-position). */
  photoPosition?: string;
  /** Foto fechada no robô, para miniaturas redondas (cai para `photo` se não houver). */
  thumb?: { src: string; position?: string };
  /** Comparação "da oficina à arena" (slider). */
  beforeAfter?: { before: string; after: string; beforePosition?: string; afterPosition?: string };
  /** Trecho em loop (mp4 sem som em /clips, com pôster .webp de mesmo nome). */
  clip?: { src: string; caption: string; aspect?: string };
};

export const robots: Robot[] = [
  {
    slug: "tank-tails",
    name: "Tank Tails",
    year: 2023,
    seasonSlug: "2023-charged-up",
    order: "Robô #1",
    drivetrain: "Tank drive",
    tagline: "O primeiro. O que levou a raposa até Houston.",
    description:
      "Primeiro robô da história da Nine Tails, construído em poucos meses pela equipe rookie. Pontuava cones e cubos nos três níveis da grade e se equilibrava na Charge Station no fim da partida. Ficou no top 10 da Regional do Brasil e competiu na divisão Curie do Mundial.",
    features: [
      "Pontuação de cones e cubos em Low, Mid e High",
      "Equilíbrio na Charge Station no endgame",
      "Top 10 na Regional do Brasil (9º)",
    ],
    events: ["Regional Brasil 2023", "Mundial de Houston — Curie"],
    awards: ["rookie-all-star", "rookie-inspiration"],
    matchEvents: ["2023-brasilia", "2023-houston"],
    photo: "/team/2023-houston-tank-tails.webp",
    thumb: { src: "/team/2023-tank-tails-oficina-3-4.webp", position: "50% 62%" },
    beforeAfter: {
      before: "/team/2023-tank-tails-construcao.webp",
      after: "/team/2023-houston-tank-tails.webp",
      beforePosition: "50% 65%",
      afterPosition: "50% 60%",
    },
    clip: { src: "/clips/tank-tails.mp4", caption: "Em campo na Regional do Brasil, no Mané Garrincha, março de 2023." },
  },
  {
    slug: "the-answer",
    name: "The Answer",
    year: 2023,
    seasonSlug: "2023-charged-up",
    order: "Robô #2",
    drivetrain: "Omnidirecional",
    tagline: "A resposta, construída em menos de um mês.",
    description:
      "Criado para o Off-Season do Rio de Janeiro com base no que a equipe aprendeu com o Tank Tails. Ficou mais rápido e mais estável e ganhou um autônomo capaz de entregar cone ou cubo no nível High. Foi reconhecido com o Engineering Award, que premia o processo de design mais profissional e elegante do evento.",
    features: [
      "Projeto e construção em menos de 1 mês",
      "Autônomo com entrega no High",
      "Foco em velocidade e estabilidade",
    ],
    events: ["Off-Season Brasil 2023 (RJ)"],
    awards: ["engineering"],
    matchEvents: ["2023-rio"],
    photo: "/team/2023-the-answer-partida-2.webp",
    beforeAfter: {
      before: "/team/2023-the-answer-eletrica.webp",
      after: "/team/2023-the-answer-partida.webp",
      beforePosition: "50% 50%",
    },
    clip: { src: "/clips/the-answer.mp4", caption: "Ligando os LEDs na oficina, semanas antes do Off-Season do Rio.", aspect: "aspect-[3/4]" },
  },
  {
    slug: "garuttinho",
    name: "Garuttinho",
    year: 2024,
    seasonSlug: "2024-crescendo",
    order: "Robô #3",
    drivetrain: "Rodas omnidirecionais",
    tagline: "Agilidade para estrear como veterana.",
    description:
      "Primeiro robô da temporada Crescendo, projetado para a Regional do Brasil em Brasília. Usava rodas omnidirecionais, como o The Answer, para ter agilidade e versatilidade em campo. Os limites de estabilidade e precisão que ele mostrou viraram a base do projeto seguinte.",
    features: [
      "Rodas omnidirecionais",
      "Lançamento de notes no Speaker e no Amp",
      "Base de aprendizado para o Predator",
    ],
    events: ["Regional Brasil 2024"],
    matchEvents: ["2024-brasilia"],
    photo: "/team/2024-garuttinho.webp",
    clip: { src: "/clips/garuttinho.mp4", caption: "Correntes, motores e a placa da raposa: um passeio pela lateral do robô." },
  },
  {
    slug: "predator",
    name: "Predator",
    year: 2024,
    seasonSlug: "2024-crescendo",
    order: "Robô #4",
    drivetrain: "Swerve drive",
    tagline: "O primeiro swerve da raposa.",
    description:
      "Segundo robô da Crescendo, feito para superar os limites do Garuttinho. Foi o primeiro robô da equipe com swerve drive, o que deu movimentação mais fluida, precisa e estável. Levou a Nine Tails até a grande final do Festival SESI de Robótica no Mato Grosso.",
    features: [
      "Swerve drive",
      "3º lugar no ranking de qualificação",
      "Finalista do Off-Season MT",
    ],
    events: ["Off-Season MT 2024 (Cuiabá)"],
    awards: ["finalista"],
    photo: "/team/2024-predator.webp",
    photoPosition: "50% 46%",
    matchEvents: ["2024-cuiaba"],
  },
  {
    slug: "arak",
    name: "Arak",
    year: 2025,
    seasonSlug: "2025-reefscape",
    order: "Robô #5",
    drivetrain: "Swerve drive",
    tagline: "L4 no autônomo. Níveis automatizados no controle.",
    description:
      "Robô da temporada Reefscape, com swerve drive. A grande inovação foi um controle personalizado para o operador, que automatiza a entrega de coral nos níveis L1 a L4. No modo autônomo, o Arak consegue colocar um coral no L4, o que é um diferencial estratégico. Competiu nas regionais de Brasília e São Paulo e no Off-Season de Porto Alegre.",
    features: [
      "Swerve drive",
      "Controle customizado com níveis L1–L4 automatizados",
      "Coral no L4 durante o autônomo",
    ],
    events: ["Regional Brasília 2025", "Regional São Paulo 2025", "Off-Season RS 2025"],
    matchEvents: ["2025-brasilia", "2025-sao-paulo", "2025-porto-alegre"],
    photo: "/team/2025-arak.webp",
    clip: { src: "/clips/arak.mp4", caption: "Testando o swerve na oficina antes da Regional de Brasília." },
  },
];

export const getRobot = (slug: string) => robots.find((r) => r.slug === slug);
export const robotsBySeason = (seasonSlug: string) => robots.filter((r) => r.seasonSlug === seasonSlug);
