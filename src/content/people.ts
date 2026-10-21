export type Area = {
  slug: string;
  name: string;
  description: string;
  photo: string;
};

export const areas: Area[] = [
  {
    slug: "mecanica",
    name: "Mecânica",
    description: "Projeta e constrói o chassi, os mecanismos e a estrutura do robô, do CAD até a última rebitada.",
    photo: "/photos/area-mecanica.webp",
  },
  {
    slug: "eletrica",
    name: "Elétrica",
    description: "Dá vida ao robô: faz a distribuição de energia, os motores, os sensores e cada ligação que precisa funcionar sob pressão.",
    photo: "/photos/area-eletrica.webp",
  },
  {
    slug: "programacao",
    name: "Programação",
    description: "Cuida do controle, do autônomo e da automação, unindo mecânica e elétrica em movimentos precisos.",
    photo: "/photos/area-programacao.webp",
  },
  {
    slug: "marketing",
    name: "Social & Marketing",
    description: "É a voz da equipe: ações sociais, documentação, patrocínios, mídia e a cultura STEAM na comunidade.",
    photo: "/photos/area-mkt.webp",
  },
];

export type Person = {
  name: string;
  role: string;
  area?: string;
  /** Alumni: @ do Instagram (sem o @), só com autorização da pessoa. */
  instagram?: string;
  /** Alumni: link do LinkedIn, só com autorização da pessoa. */
  linkedin?: string;
  /** Alumni: anos em que esteve na equipe. */
  years?: string;
  /** Alumni: o que faz hoje. */
  now?: string;
};

/** Mentores da temporada Crescendo (2024). */
export const mentors: Person[] = [
  { name: "Leandro Victor", role: "Mentor de Engenharia", area: "Indicado ao Woodie Flowers" },
  { name: "Bruno", role: "Mentor de Social & Marketing" },
  { name: "Iago", role: "Mentor de Programação", area: "Alumni" },
  { name: "Gabriel", role: "Mentor de Engenharia", area: "Alumni" },
];

/** Elenco da temporada Crescendo (2024) — atualizar a cada temporada. */
export const roster: { season: string; members: Person[] } = {
  season: "Crescendo 2024",
  members: [
    { name: "Maria Eduarda", role: "Documentação", area: "Social & Marketing" },
    { name: "Maria Lucia", role: "Documentação", area: "Social & Marketing" },
    { name: "Rebeca", role: "Documentação e ações sociais", area: "Social & Marketing" },
    { name: "Thiago", role: "Mídia", area: "Social & Marketing" },
    { name: "Alice", role: "Manutenção", area: "Mecânica" },
    { name: "Carlos Eduardo", role: "Mecânica", area: "Mecânica" },
    { name: "Enzzo", role: "Mecânica e financeiro", area: "Mecânica" },
    { name: "Pedro Eduardo", role: "Construção", area: "Mecânica" },
    { name: "Pedro Siqueira", role: "Elétrica", area: "Elétrica" },
    { name: "Vitor Duque", role: "Elétrica", area: "Elétrica" },
    { name: "Arthur Novaes", role: "Programação", area: "Programação" },
    { name: "Vinícius Vilarinho", role: "Programação", area: "Programação" },
  ],
};

export const alumni: Person[] = [
  { name: "Ana Luíza", role: "Voluntária FIRST · Publicidade" },
  { name: "Cauã Campos", role: "Engenharia de Software" },
  { name: "Davi Garutti", role: "Engenharia" },
  { name: "Erick Maia", role: "Tradução e documentação" },
  { name: "Gabriel Lauer", role: "CAD do robô · Voluntário" },
  { name: "Gabriel Rosa", role: "Treinamentos técnicos" },
  { name: "Gabriel Vilela", role: "Mentor de engenharia" },
  { name: "Jessé Nunes", role: "Mentor de mecânica" },
  { name: "Mirella Costa", role: "Voluntária FIRST" },
  { name: "Vinicios Gimenez", role: "Juiz FLL · Engenharia" },
];
