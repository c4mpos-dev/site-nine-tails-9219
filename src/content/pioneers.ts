/**
 * Os pioneiros: a primeira temporada da Nine Tails (CHARGED UP, 2023), contada em capítulos.
 * Fotos do Drive "Arquivos Nine Tails" › Charged UP - 2023.
 */
export type Chapter = {
  when: string;
  title: string;
  text: string;
  photos: Array<{ src: string; caption: string; position?: string }>;
  layout?: "wide" | "pair" | "trio" | "tall";
};

export const chapters: Chapter[] = [
  {
    when: "Nov 2022",
    title: "80 inscritos, 15 vagas",
    text: "Tudo começou com um processo seletivo na Firjan SENAI Resende. Primeiro uma avaliação geral, depois provas por área: mecânica, elétrica, programação e social/marketing. Quem passou virou a primeira formação de uma equipe que ainda nem tinha nome.",
    photos: [
      { src: "/team/2023-seletiva-prova.webp", caption: "Prova do processo seletivo." },
      { src: "/team/2023-seletiva-prova-3.webp", caption: "Cada área com a sua prova." },
    ],
    layout: "pair",
  },
  {
    when: "Jan 2023",
    title: "A primeira foto oficial",
    text: "Nome escolhido (a Kitsune, raposa de nove caudas), logo desenhado e camisa roxa com raios. Em janeiro saiu a primeira foto da equipe em frente à escola. No mesmo mês veio a primeira reunião com uma equipe estrangeira: a LamBot #3478, do México.",
    photos: [{ src: "/photos/hero-1.webp", caption: "Janeiro de 2023, em frente à Firjan SENAI Resende.", position: "50% 40%" }],
    layout: "wide",
  },
  {
    when: "Jan – Mar 2023",
    title: "Do zero ao Tank Tails",
    text: "Kickoff em janeiro, poucas semanas de oficina e um robô inteiro para construir sem nunca ter feito um. Assim nasceu o Tank Tails, que pontuava cones e cubos e se equilibrava na Charge Station.",
    photos: [
      { src: "/team/2023-oficina-treino.webp", caption: "Na oficina, durante o treino.", position: "50% 30%" },
      { src: "/museu/23-inicio-lanche.webp", caption: "Pausa para o lanche na oficina." },
    ],
    layout: "pair",
  },
  {
    when: "16 – 18 Mar 2023",
    title: "Brasília: a primeira regional",
    text: "Com três meses de equipe, a raposa entrou em quadra na Regional do Brasil. Terminou em 9º lugar, foi a 1ª escolha da Aliança 5 e, entre 27 rookies, ganhou o Rookie All Star e a vaga para o Mundial.",
    photos: [
      { src: "/team/2023-brasilia-rookie-all-star.webp", caption: "A equipe na arquibancada em Brasília." },
      { src: "/team/2023-brasilia-finais.webp", caption: "Ajustes no robô durante as finais.", position: "50% 55%" },
    ],
    layout: "pair",
  },
  {
    when: "19 – 22 Abr 2023",
    title: "Houston",
    text: "Um mês depois, o Tank Tails estava na divisão Curie do FIRST Championship, no Texas. Entre partidas, abraços e uma visita ao Space Center da NASA, a equipe voltou para casa com o Rookie Inspiration Award.",
    photos: [
      { src: "/team/2023-houston-tank-tails.webp", caption: "Tank Tails em campo, divisão Curie.", position: "50% 60%" },
      { src: "/team/2023-houston-space-center.webp", caption: "Visita ao Space Center Houston." },
      { src: "/team/2023-houston-placa.webp", caption: "O Rookie Inspiration Award." },
    ],
    layout: "trio",
  },
  {
    when: "Jul 2023",
    title: "Um robô em menos de um mês",
    text: "De volta ao Brasil, veio o convite para o Off-Season do Rio. A equipe decidiu construir outro robô do zero, corrigindo o que o Tank Tails ensinou. Fiação, programação e testes em ritmo de mutirão.",
    photos: [
      { src: "/team/2023-the-answer-eletrica.webp", caption: "Montando a elétrica do novo robô." },
      { src: "/team/2023-the-answer-eletrica-2.webp", caption: "Teste com o notebook ligado no robô." },
      { src: "/team/2023-the-answer-eletrica-3.webp", caption: "Ajustes finais." },
    ],
    layout: "tall",
  },
  {
    when: "2 – 5 Ago 2023",
    title: "The Answer",
    text: "No Off-Season do Rio de Janeiro, o The Answer fez 11 vitórias nas qualificações, terminou em 7º e foi a 1ª escolha da Aliança 4 nos playoffs. Para fechar a temporada de estreia, o Engineering Award, pelo melhor processo de engenharia do evento.",
    photos: [
      { src: "/team/2023-the-answer-partida.webp", caption: "The Answer em partida." },
      { src: "/team/2023-the-answer-partida-2.webp", caption: "Charge Station e a raposa em ação." },
      { src: "/team/2023-the-answer-partida-3.webp", caption: "Playoffs do Off-Season." },
    ],
    layout: "trio",
  },
];
