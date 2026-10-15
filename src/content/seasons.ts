export type Motif = "charged-up" | "crescendo" | "reefscape" | "rebuilt" | "biocore";

export type EventResult = {
  name: string;
  shortName: string;
  location: string;
  dates: string;
  kind: "regional" | "championship" | "offseason";
  /** Posição no ranking de qualificação. */
  rank?: number;
  /** Vitórias-derrotas-empates. */
  record?: string;
  alliance?: string;
  result: string;
  awards?: string[];
};

export type Season = {
  year: number;
  slug: string;
  game: string;
  firstTheme: string;
  motif: Motif;
  /** Qual cauda da raposa essa temporada representa (1–9). */
  tail: number;
  status: "completed" | "upcoming";
  headline: string;
  summary: string;
  gameDescription: string;
  gamePieces: string[];
  /** Fotos reais do jogo (chaves de `seasonPhotos` em credits.ts). */
  photos: string[];
  robots: string[];
  events: EventResult[];
  highlights: string[];
};

export const seasons: Season[] = [
  {
    year: 2023,
    slug: "2023-charged-up",
    game: "CHARGED UP",
    firstTheme: "FIRST ENERGIZE",
    motif: "charged-up",
    photos: ["2023-charged-up-field"],
    tail: 1,
    status: "completed",
    headline: "De rookie ao Mundial de Houston.",
    summary:
      "Com poucos meses de existência, a Nine Tails estreou na Regional do Brasil, ficou entre os 10 melhores, levou o Rookie All Star e garantiu vaga no Mundial de Houston, onde voltou para casa com o Rookie Inspiration Award. Fechou o ano com o Engineering Award no Off-Season do Rio de Janeiro.",
    gameDescription:
      "Alianças de três robôs pontuam cones e cubos em uma grade de três níveis (Low, Mid e High) e terminam a partida equilibrando os robôs na Charge Station.",
    gamePieces: ["Cone", "Cubo", "Charge Station"],
    robots: ["tank-tails", "the-answer"],
    events: [
      {
        name: "Brazil Regional",
        shortName: "Regional Brasil",
        location: "Brasília, DF",
        dates: "16–18 mar 2023",
        kind: "regional",
        rank: 9,
        record: "7-5-0",
        alliance: "1ª escolha da Aliança 5",
        result: "Playoffs — Round 2",
        awards: ["Rookie All Star Award", "Wildcard para o Mundial"],
      },
      {
        name: "FIRST Championship — Curie Division",
        shortName: "Mundial — Curie",
        location: "Houston, Texas, EUA",
        dates: "19–22 abr 2023",
        kind: "championship",
        rank: 67,
        record: "3-7-0",
        result: "Qualificações",
        awards: ["Rookie Inspiration Award"],
      },
      {
        name: "Off-Season Brazil",
        shortName: "Off-Season RJ",
        location: "Rio de Janeiro, RJ",
        dates: "2–5 ago 2023",
        kind: "offseason",
        rank: 7,
        record: "11-5-0",
        alliance: "1ª escolha da Aliança 4",
        result: "Playoffs — Round 5",
        awards: ["Engineering Award"],
      },
    ],
    highlights: [
      "Selecionada entre 80 inscritos para 15 vagas",
      "21 vitórias no ano",
      "20 reuniões com equipes do mundo inteiro",
      "14 escolas municipais visitadas, com mais de 10 mil alunos",
    ],
  },
  {
    year: 2024,
    slug: "2024-crescendo",
    game: "CRESCENDO",
    firstTheme: "FIRST IN SHOW",
    motif: "crescendo",
    photos: ["2024-crescendo-note", "2024-crescendo-field", "2024-crescendo-wide"],
    tail: 2,
    status: "completed",
    headline: "O primeiro ano como veterana.",
    summary:
      "Primeiro ano como equipe veterana. Dois robôs na mesma temporada, a estreia do swerve drive e uma campanha que terminou na grande final do Off-Season do Mato Grosso. Fora das quadras, o Nine Learns levou robótica para mais de 6 mil crianças.",
    gameDescription:
      "Temporada com tema musical: os robôs lançam notes (anéis de espuma) no Speaker e no Amp, ativam o amplificador e escalam a corrente do Stage no fim da partida.",
    gamePieces: ["Note", "Speaker", "Amp", "Stage"],
    robots: ["garuttinho", "predator"],
    events: [
      {
        name: "Brazil Regional",
        shortName: "Regional Brasil",
        location: "Brasília, DF",
        dates: "28 fev – 2 mar 2024",
        kind: "regional",
        rank: 28,
        record: "3-6-1",
        alliance: "1ª escolha da Aliança 8",
        result: "Playoffs — Round 2",
      },
      {
        name: "Festival SESI de Robótica — Off-Season MT",
        shortName: "Off-Season MT",
        location: "Cuiabá, MT",
        dates: "6–8 ago 2024",
        kind: "offseason",
        rank: 3,
        record: "10-7-0",
        alliance: "1ª escolha da Aliança 2",
        result: "Finalista",
        awards: ["Finalista"],
      },
    ],
    highlights: [
      "Primeiro robô com swerve drive",
      "Finalista no Off-Season do Mato Grosso",
      "6.222 crianças impactadas pelo Nine Learns",
      "28 reuniões de coopertition",
    ],
  },
  {
    year: 2025,
    slug: "2025-reefscape",
    game: "REEFSCAPE",
    firstTheme: "FIRST DIVE",
    motif: "reefscape",
    photos: ["2025-reefscape-reef", "2025-reefscape-barge", "2025-reefscape-field"],
    tail: 3,
    status: "completed",
    headline: "Automação no fundo do mar.",
    summary:
      "Duas regionais, em Brasília e São Paulo, e um off-season em Porto Alegre com o Arak, o robô mais técnico da história da equipe até então. Ele tinha um controle personalizado que automatiza as entregas de coral do L1 ao L4.",
    gameDescription:
      "Tema oceânico: os robôs posicionam corais nos galhos do recife em quatro níveis (L1–L4), removem e pontuam algas no Processor e na Net, e terminam escalando a Barge.",
    gamePieces: ["Coral", "Alga", "Reef", "Barge"],
    robots: ["arak"],
    events: [
      {
        name: "Regional Brazil — Brasília",
        shortName: "Regional Brasília",
        location: "Brasília, DF",
        dates: "12–15 mar 2025",
        kind: "regional",
        rank: 18,
        record: "6-5-0",
        alliance: "1ª escolha da Aliança 8",
        result: "Playoffs — Round 3",
      },
      {
        name: "Regional Brazil — São Paulo",
        shortName: "Regional São Paulo",
        location: "São Paulo, SP",
        dates: "20–23 mar 2025",
        kind: "regional",
        rank: 23,
        record: "5-9-0",
        alliance: "1ª escolha da Aliança 7",
        result: "Playoffs — Round 2",
      },
      {
        name: "Torneio FRC Off-Season Brasil",
        shortName: "Off-Season RS",
        location: "Porto Alegre, RS",
        dates: "1–3 out 2025",
        kind: "offseason",
        rank: 16,
        record: "5-6-0",
        result: "Qualificações",
      },
    ],
    highlights: [
      "Coral no L4 durante o autônomo",
      "Controle customizado com níveis automatizados",
      "Projeto Roots & Robots com equipes internacionais",
      "Indicações ao Woodie Flowers e ao Dean's List",
    ],
  },
  {
    year: 2026,
    slug: "2026-rebuilt",
    game: "REBUILT",
    firstTheme: "FIRST AGE",
    motif: "rebuilt",
    photos: ["2026-rebuilt-field"],
    tail: 4,
    status: "completed",
    headline: "Reconstruir para ir mais longe.",
    summary:
      "Duas regionais em sequência em São Paulo, no Festival SESI de Educação e no SESI Osasco, com a equipe renovada por novos membros e uma moção de aplausos da Prefeitura de Itatiaia pelo trabalho na comunidade.",
    gameDescription:
      "Temporada com tema de arqueologia e reconstrução: as alianças coletam e lançam fuel no Hub e escalam a Tower para fechar a partida.",
    gamePieces: ["Fuel", "Hub", "Tower"],
    robots: [],
    events: [
      {
        name: "Regional Brazil — Festival SESI de Educação",
        shortName: "Regional SESI Educação",
        location: "São Paulo, SP",
        dates: "5–8 mar 2026",
        kind: "regional",
        rank: 45,
        record: "2-7-0",
        result: "Qualificações",
      },
      {
        name: "Regional Brazil — SESI Osasco",
        shortName: "Regional Osasco",
        location: "Osasco, SP",
        dates: "12–15 mar 2026",
        kind: "regional",
        alliance: "2ª escolha da Aliança 5",
        result: "Playoffs — Round 2",
      },
    ],
    highlights: [
      "Duas regionais em duas semanas",
      "5 novos membros na equipe",
      "Moção de Aplausos da Prefeitura de Itatiaia",
    ],
  },
  {
    year: 2027,
    slug: "2027-biocore",
    game: "BIOCORE",
    firstTheme: "FIRST CANOPY",
    motif: "biocore",
    photos: [],
    tail: 5,
    status: "upcoming",
    headline: "A próxima temporada já começou.",
    summary:
      "A temporada BIOCORE, com tema de biodiversidade, começa no kickoff de 9 de janeiro de 2027. A equipe já está se preparando para o próximo capítulo.",
    gameDescription:
      "Os detalhes do jogo serão revelados no kickoff. O tema convida as equipes a explorar os sistemas biológicos que sustentam a vida na Terra.",
    gamePieces: [],
    robots: [],
    events: [],
    highlights: ["Kickoff em 09/01/2027", "Temporada FIRST CANOPY"],
  },
];

export const getSeason = (slug: string) => seasons.find((s) => s.slug === slug);
export const completedSeasons = seasons.filter((s) => s.status === "completed");
