export type Project = {
  name: string;
  tag: string;
  description: string;
  metric?: string;
};

export const projects: Project[] = [
  {
    name: "Nine Learns",
    tag: "Educação",
    description:
      "Oficinas de robótica que unem engenharia, matemática e artes para alunos da rede pública. Usam materiais recicláveis e de baixo custo, então qualquer escola consegue replicar.",
    metric: "6.222 crianças",
  },
  {
    name: "Nine Learns Kids",
    tag: "Primeira infância",
    description:
      "Versão para os pequenos: STEAM de um jeito lúdico e alfabetizador, aplicada em escolas municipais e CIEPs de Resende.",
    metric: "+1.300 crianças",
  },
  {
    name: "Formação de professores",
    tag: "Rede pública",
    description:
      "Em parceria com o SESI e a Prefeitura de Resende, a equipe capacitou professores da rede municipal para dar aulas de robótica com kits LEGO.",
    metric: "30 professores",
  },
  {
    name: "Little Girls in FIRST",
    tag: "Meninas na STEAM",
    description:
      "Oficinas de robótica para meninas, para inspirar as futuras líderes da ciência e da engenharia.",
  },
  {
    name: "Math Kids",
    tag: "Matemática",
    description:
      "Matemática ensinada com teatro e robôs, para crianças se apaixonarem pelos números brincando.",
  },
  {
    name: "Colour Tails",
    tag: "Livro de colorir",
    description:
      "Livro de colorir com o universo da FIRST e da robótica, distribuído em hospitais, escolas e em todas as ações da equipe.",
  },
  {
    name: "Robôs que constroem esperança",
    tag: "Saúde",
    description:
      "Oficinas de robótica e apresentações musicais para as crianças do Hospital da Criança de Resende.",
  },
  {
    name: "Empowering Meeting",
    tag: "Evento",
    description:
      "Evento próprio da equipe, com workshops para equipes e estudantes. Já teve duas edições.",
    metric: "2 edições",
  },
  {
    name: "Roots & Robots",
    tag: "Internacional",
    description:
      "Projeto em parceria com equipes internacionais (Roto-Raptors #3737, Innovation Taters e Generic Goats) que une robótica e meio ambiente.",
  },
  {
    name: "Plantio de mudas",
    tag: "Sustentabilidade",
    description:
      "Desafio de plantar mil mudas. O primeiro plantio foi feito com o apoio da instituição AMAR.",
    metric: "Meta: 1.000",
  },
];

export const schools = [
  { name: "Colégio Antonina Ramos Freire", date: "24/11/2023", impact: 2500 },
  { name: "Colégio Getúlio Vargas", date: "01/12/2023", impact: 2362 },
  { name: "Escola Firjan SESI Resende", date: "07/12/2023", impact: 855 },
  { name: "CIEP Surubi", date: "12/12/2023", impact: 255 },
  { name: "CIEP São Caetano", date: "13/12/2023", impact: 250 },
];

export const foundedTeams = [
  { name: "Little Fish Lego", program: "TBR", place: "CIEP Surubi" },
  { name: "Time do Colégio Noel de Carvalho", program: "Robótica", place: "Resende" },
];

/** Países que receberam o Nine Learns, por continente. */
export const reach = [
  { continent: "América", countries: ["EUA", "México", "Barbados", "Rep. Dominicana"], teams: 36 },
  { continent: "Ásia", countries: ["Japão", "Vietnã", "Israel", "Taiwan"], teams: 6 },
  { continent: "Europa", countries: ["Turquia", "Polônia", "Holanda", "França", "Azerbaijão"], teams: 7 },
  { continent: "África", countries: ["África do Sul", "Líbia"], teams: 2 },
  { continent: "Oceania", countries: ["Austrália"], teams: 4 },
];

export const coopertition = [
  { team: "LamBot", number: 3478, place: "San Luis Potosí, México" },
  { team: "CABOTS", number: 6896, place: "Sonora, México" },
  { team: "MecHackTeam", number: 9030, place: "Baku, Azerbaijão" },
  { team: "Exploding Bacon", number: 1902, place: "Orlando, EUA" },
  { team: "General Angels", number: 2230, place: "Herzliya, Israel" },
  { team: "EPIC Robotz", number: 4415, place: "Cerritos, EUA" },
  { team: "Mechadogs", number: 5123, place: "Yonkers, EUA" },
  { team: "Cyber Rain", number: 9611, place: "Brasil" },
  { team: "Robot's District", number: 9484, place: "Brasília, Brasil" },
  { team: "Steampunk Monkeys", number: 9049, place: "Curitiba, Brasil" },
  { team: "Alpha Technology", number: 9218, place: "Rio de Janeiro, Brasil" },
  { team: "Brain Machine", number: 9175, place: "Goiás, Brasil" },
  { team: "Mont", number: 9305, place: "Rio Grande do Sul, Brasil" },
  { team: "Under Control", number: 1156, place: "Rio Grande do Sul, Brasil" },
];

export const communityActions = [
  "Desfile de aniversário de Resende",
  "Feira de profissões na Beira Rio",
  "Feira de tecnologia na UERJ",
  "Setembro Amarelo: prevenção ao suicídio",
  "Campanhas de doação de sangue",
  "Natal Alegria",
  "Voluntários (anjos) na FLL, FTC e TBR",
  "Family Day na Michelin e na DHL",
  "FLIT — Feira Literária de Itatiaia",
  "Kickoff do Vale com equipes da região",
  "Colônia de férias STEAM (Nine Camp)",
  "Apresentação da WorldSkills para escolas",
];
