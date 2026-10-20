import type { TrophyArt } from "@/components/graphics/Trophies";

export type Award = {
  id: string;
  title: string;
  year: number;
  date: string;
  event: string;
  description: string;
  /** Desenho do troféu, no formato do troféu de verdade. */
  art: TrophyArt;
  photo?: string;
  photoPosition?: string;
};

/** Em ordem cronológica. */
export const awards: Award[] = [
  {
    id: "rookie-all-star",
    title: "Rookie All Star Award",
    year: 2023,
    date: "Mar 2023",
    event: "Brazil Regional, Brasília",
    description:
      "Prêmio para a rookie que é exemplo de uma equipe jovem e de impacto. Disputado com outras 27 equipes rookies, ele veio junto com a vaga (wildcard) para o Mundial de Houston.",
    art: {
      kind: "frc",
      award: "Rookie All Star Award",
      crystal: ["2023 ROOKIE ALL STAR AWARD", "BRAZIL REGIONAL"],
      plaque: ["2023 Rookie All Star Award", "Brazil Regional"],
      frame: "black",
    },
    photo: "/team/2023-brasilia-rookie-all-star-trofeu.webp",
    photoPosition: "50% 35%",
  },
  {
    id: "rookie-inspiration",
    title: "Rookie Inspiration Award",
    year: 2023,
    date: "Abr 2023",
    event: "FIRST Championship, Curie Division, Houston",
    description:
      "Concedido no Mundial à equipe rookie que mais inspirou com sua ação na comunidade. Entre rookies do mundo inteiro, a Nine Tails foi a escolhida.",
    art: {
      kind: "frc",
      award: "Rookie Inspiration Award",
      crystal: ["2023 ROOKIE INSPIRATION AWARD", "HOUSTON CHAMPIONSHIP - CURIE DIVISION"],
      plaque: ["2023 Rookie Inspiration Award", "FIRST® Houston Championship", "Curie Division"],
      frame: "walnut",
    },
    photo: "/team/2023-houston-rookie-inspiration.webp",
    photoPosition: "50% 40%",
  },
  {
    id: "engineering",
    title: "Engineering Award",
    year: 2023,
    date: "Ago 2023",
    event: "Festival SESI de Robótica, Off-Season Brasil, Rio de Janeiro",
    description:
      "Reconhece a equipe com o processo de design mais profissional e elegante. Foi conquistado com o The Answer, robô construído em menos de um mês.",
    art: { kind: "sesi", lines: ["Engineering", "Award"], event: "OFF-SEASON BRASIL 2023", edition: "2023" },
    photo: "/team/2023-rio-engineering-award.webp",
    photoPosition: "50% 45%",
  },
  {
    id: "finalista",
    title: "Aliança Finalista",
    year: 2024,
    date: "Ago 2024",
    event: "Festival SESI de Robótica, Off-Season Mato Grosso, Cuiabá",
    description:
      "Com o Predator, a equipe ficou em 3º no ranking, foi a 1ª escolha da Aliança 2 e chegou à grande final.",
    art: { kind: "sesi", lines: ["Aliança", "Finalista"], event: "OFF-SEASON MT 2024", edition: "2024" },
    photo: "/team/2024-cuiaba-alianca-robos.webp",
  },
  {
    id: "impacto",
    title: "Prêmio de Impacto",
    year: 2024,
    date: "Ago 2024",
    event: "Festival SESI de Robótica, Off-Season Mato Grosso, Cuiabá",
    description:
      "O prêmio que reconhece o impacto da equipe fora da quadra: o Nine Learns, as ações em escolas públicas e a cultura STEAM levada para a comunidade de Resende.",
    art: { kind: "sesi", lines: ["Prêmio de", "Impacto"], event: "OFF-SEASON MT 2024", edition: "2024" },
    photo: "/team/2024-cuiaba-premiacao.webp",
    photoPosition: "50% 40%",
  },
  {
    id: "mocao",
    title: "Moção de Aplausos",
    year: 2025,
    date: "2025",
    event: "Prefeitura de Itatiaia",
    description:
      "Reconhecimento oficial do poder público pelo trabalho da equipe em levar robótica e STEAM para a comunidade.",
    art: { kind: "certificate", lines: ["Moção de", "Aplausos"], issuer: "Itatiaia · RJ" },
  },
];
