/** "Fala FRC?": o vocabulário da competição, explicado para quem está chegando. */
export type GlossaryTerm = { id: string; term: string; group: string; def: string };

export const glossary: GlossaryTerm[] = [
  { id: "frc", term: "FRC", group: "A competição", def: "FIRST Robotics Competition: a maior competição de robótica do ensino médio do mundo, com robôs de até 57 kg construídos em poucas semanas." },
  { id: "kickoff", term: "Kickoff", group: "A competição", def: "O dia, em janeiro, em que a FIRST revela o jogo da temporada para todas as equipes ao mesmo tempo. A partir daí começa a corrida para construir o robô." },
  { id: "regional", term: "Regional", group: "A competição", def: "Evento oficial onde dezenas de equipes competem. Os melhores colocados e alguns prêmios dão vaga para o Mundial." },
  { id: "offseason", term: "Off-season", group: "A competição", def: "Torneio fora da temporada oficial, depois das regionais. Ótimo para testar ideias novas e treinar a equipe." },
  { id: "mundial", term: "Mundial (Championship)", group: "A competição", def: "O FIRST Championship, em Houston: reúne as equipes classificadas do mundo inteiro, divididas em divisões como a Curie." },
  { id: "rookie", term: "Rookie", group: "A competição", def: "Equipe no seu primeiro ano de FRC. A Nine Tails foi rookie em 2023." },
  { id: "alianca", term: "Aliança", group: "Em quadra", def: "Cada partida tem duas alianças, vermelha e azul, com três robôs cada. Os parceiros mudam a cada partida das qualificações." },
  { id: "qualificacoes", term: "Qualificações", group: "Em quadra", def: "A primeira fase do evento: várias partidas com alianças sorteadas, que definem o ranking das equipes." },
  { id: "pick", term: "Escolha (pick)", group: "Em quadra", def: "Nos playoffs, as melhores colocadas viram capitãs e escolhem as parceiras. Ser a 1ª escolha de uma aliança significa ser a primeira equipe convidada pela capitã." },
  { id: "playoffs", term: "Playoffs", group: "Em quadra", def: "A fase eliminatória, com alianças fixas, em formato de dupla eliminação até a final." },
  { id: "autonomo", term: "Autônomo", group: "Em quadra", def: "Os primeiros 15 segundos da partida, em que o robô joga sozinho, só com a programação, sem nenhum piloto." },
  { id: "endgame", term: "Endgame", group: "Em quadra", def: "Os segundos finais da partida, quando normalmente o robô sobe, escala ou se equilibra para fazer pontos extras." },
  { id: "drive-team", term: "Drive team", group: "Em quadra", def: "Quem fica na estação de controle durante a partida: pilotos, operador, técnico e o humano que entrega as peças." },
  { id: "swerve", term: "Swerve drive", group: "O robô", def: "Tração em que cada roda gira e muda de direção sozinha. O robô anda para qualquer lado sem precisar virar o corpo." },
  { id: "tank", term: "Tank drive", group: "O robô", def: "Tração de tanque: um lado de rodas de cada vez. É simples e robusta, mas só anda para frente e para trás." },
  { id: "omni", term: "Rodas omni", group: "O robô", def: "Rodas com roletes em volta, que deixam o robô deslizar de lado. É um meio-termo entre o tank e o swerve." },
  { id: "bumper", term: "Bumper", group: "O robô", def: "O para-choque acolchoado em volta do robô, vermelho ou azul conforme a aliança, com o número da equipe." },
  { id: "cad", term: "CAD", group: "O robô", def: "O projeto do robô feito no computador, peça por peça, antes de ir para a oficina." },
  { id: "pit", term: "Pit (box)", group: "Fora da quadra", def: "O espaço da equipe no evento, onde o robô é consertado entre as partidas e onde a equipe recebe visitantes." },
  { id: "coopertition", term: "Coopertition", group: "Fora da quadra", def: "Cooperação + competição: ajudar outras equipes, inclusive adversárias, enquanto compete." },
  { id: "gp", term: "Gracious Professionalism", group: "Fora da quadra", def: "O valor central da FIRST: competir com intensidade e, ao mesmo tempo, com respeito e gentileza." },
  { id: "rookie-all-star", term: "Rookie All Star", group: "Prêmios", def: "Prêmio para a rookie que é exemplo de equipe jovem com impacto. Em regionais, garante vaga no Mundial." },
  { id: "rookie-inspiration", term: "Rookie Inspiration", group: "Prêmios", def: "Prêmio para a rookie que mais inspira pela atuação na comunidade." },
  { id: "engineering-award", term: "Engineering Award", group: "Prêmios", def: "Reconhecimento pelo processo de engenharia e design do robô." },
  { id: "wildcard", term: "Wildcard", group: "Prêmios", def: "Vaga extra para o Mundial, distribuída conforme o desempenho e os prêmios no evento." },
  { id: "deans-list", term: "Dean's List", group: "Prêmios", def: "Prêmio individual para estudantes que se destacam em liderança e dedicação." },
  { id: "woodie-flowers", term: "Woodie Flowers", group: "Prêmios", def: "Prêmio para mentores que inspiram os estudantes, em homenagem a um dos criadores da FRC." },
  { id: "tba", term: "The Blue Alliance", group: "Fora da quadra", def: "Site que registra todos os eventos, partidas e resultados da FRC. É de onde vêm os nossos placares." },
];

export const getTerm = (id: string) => glossary.find((g) => g.id === id);
