export type Area = {
  slug: string;
  name: string;
  description: string;
  /** O que a área faz no dia a dia, sem nomes: as pessoas mudam a cada temporada. */
  tasks: string[];
  /** Foto da área trabalhando, não de quem estava nela numa temporada. */
  photo: string;
  position?: string;
};

export const areas: Area[] = [
  {
    slug: "mecanica",
    name: "Mecânica",
    description: "Projeta e constrói o chassi, os mecanismos e a estrutura do robô, do CAD até a última rebitada.",
    tasks: ["CAD do robô e dos mecanismos", "Protótipos para testar ideias", "Corte, usinagem e montagem", "Manutenção nos pits entre partidas"],
    photo: "/team/2023-the-answer-construcao.webp",
    position: "70% 50%",
  },
  {
    slug: "eletrica",
    name: "Elétrica",
    description: "Dá vida ao robô: faz a distribuição de energia, os motores, os sensores e cada ligação que precisa funcionar sob pressão.",
    tasks: [
      "Distribuição de energia e baterias",
      "Motores, controladores e sensores",
      "Cabeamento e organização do painel",
      "Diagnóstico rápido em competição",
    ],
    photo: "/team/2026-oficina-chassi.webp",
    position: "50% 50%",
  },
  {
    slug: "programacao",
    name: "Programação",
    description: "Cuida do controle, do autônomo e da automação, unindo mecânica e elétrica em movimentos precisos.",
    tasks: ["Código do robô e controles da drive team", "Rotinas do autônomo", "Leitura de sensores e câmeras", "Testes e ajustes em quadra"],
    photo: "/team/2023-the-answer-eletrica.webp",
    position: "55% 50%",
  },
  {
    slug: "marketing",
    name: "Social & Marketing",
    description: "É a voz da equipe: ações sociais, documentação, patrocínios, mídia e a cultura STEAM na comunidade.",
    tasks: ["Documentação e inscrição nos prêmios", "Redes sociais, fotos e vídeos", "Busca de patrocínios", "Ações sociais e eventos STEAM"],
    photo: "/team/2024-cuiaba-estande-visitas.webp",
    position: "45% 50%",
  },
];

export type Person = {
  name: string;
  role: string;
  area?: string;
};

/** Mentores da temporada Crescendo (2024). */
export const mentors: Person[] = [
  { name: "Leandro Victor", role: "Mentor de Engenharia", area: "Indicado ao Woodie Flowers" },
  { name: "Bruno", role: "Mentor de Social & Marketing" },
  { name: "Iago", role: "Mentor de Programação", area: "Alumni" },
  { name: "Gabriel", role: "Mentor de Engenharia", area: "Alumni" },
];
