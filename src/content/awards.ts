export type Award = {
  title: string;
  year: number;
  event: string;
  tier: "gold" | "silver" | "honor";
  description: string;
  photo?: string;
};

export const awards: Award[] = [
  {
    title: "Rookie Inspiration Award",
    year: 2023,
    event: "FIRST Championship — Curie Division, Houston",
    tier: "gold",
    description:
      "Concedido no Mundial à equipe rookie que mais inspirou com sua ação na comunidade. Entre rookies do mundo inteiro, a Nine Tails foi a escolhida.",
    photo: "/team/2023-houston-placa.webp",
  },
  {
    title: "Rookie All Star Award",
    year: 2023,
    event: "Brazil Regional, Brasília",
    tier: "gold",
    description:
      "Prêmio para a rookie que é exemplo de uma equipe jovem e de impacto. Disputado com outras 27 equipes rookies, ele rendeu a vaga para o Mundial de Houston.",
    photo: "/team/2023-brasilia-rookie-all-star.webp",
  },
  {
    title: "Engineering Award",
    year: 2023,
    event: "Off-Season Brazil, Rio de Janeiro",
    tier: "gold",
    description:
      "Reconhece a equipe com o processo de design mais profissional e elegante. Foi conquistado com o The Answer, robô construído em menos de um mês.",
  },
  {
    title: "Finalista",
    year: 2024,
    event: "Festival SESI de Robótica — Off-Season MT, Cuiabá",
    tier: "silver",
    description:
      "Com o Predator, a equipe ficou em 3º no ranking, foi a 1ª escolha da Aliança 2 e chegou à grande final.",
    photo: "/team/2024-cuiaba-finalistas.webp",
  },
  {
    title: "Moção de Aplausos",
    year: 2025,
    event: "Prefeitura de Itatiaia",
    tier: "honor",
    description:
      "Reconhecimento oficial do poder público pelo trabalho da equipe em levar robótica e STEAM para a comunidade.",
  },
];
