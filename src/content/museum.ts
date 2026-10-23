/**
 * Museu da Raposa: o acervo da Nine Tails organizado em salas, uma por temporada.
 * Fotos novas em /public/museu (exportadas do Drive "Arquivos Nine Tails", lado maior 1600px);
 * as demais vêm de /public/team e /public/photos.
 *
 * Molduras:
 *  - moldura: quadro de madeira com passe-partout (fotos "sérias")
 *  - polaroid: foto instantânea levemente torta, com legenda escrita à mão (resenha)
 *  - fita: foto colada na parede com fita crepe
 *  - vitrine: objeto numa redoma de vidro, sobre pedestal
 *  - tela: foto larga, ocupa a parede inteira
 */
export type Frame = "moldura" | "polaroid" | "fita" | "vitrine" | "tela";

export type Piece = {
  src: string;
  /** Proporção largura/altura da foto. */
  r: number;
  title: string;
  note?: string;
  frame: Frame;
  /** Quando e onde, para a placa. */
  when?: string;
  position?: string;
};

export type Clip = { src: string; label: string; caption: string; aspect?: string };

export type Wing = { name: string; pieces: Piece[]; clip?: Clip };

export type Room = {
  id: string;
  number: string;
  title: string;
  game?: string;
  period: string;
  intro: string;
  /** Robôs e troféus expostos no centro da sala. */
  robots?: string[];
  awards?: string[];
  wings: Wing[];
};

const L = 4 / 3;
const P = 3 / 4;

export const rooms: Room[] = [
  {
    id: "primeiros-dias",
    number: "01",
    title: "Primeiros dias",
    period: "Nov 2022 – Fev 2023",
    intro:
      "Antes do primeiro robô, a Nine Tails era um grupo de estudantes recém-selecionados numa sala da Firjan SENAI Resende, aprendendo o que era FRC, montando a marca e se conhecendo. Esta sala guarda o que sobrou desses dias: fotos tortas, objetos e a primeira foto oficial.",
    wings: [
      {
        name: "A sala da equipe",
        pieces: [
          { src: "/photos/hero-1.webp", r: L, title: "A primeira foto oficial", note: "Em frente à Firjan SENAI Resende.", frame: "tela", when: "Jan 2023", position: "50% 40%" },
          { src: "/team/2023-seletiva-prova.webp", r: 16 / 9, title: "A prova da seletiva", note: "80 inscritos para 15 vagas.", frame: "moldura", when: "Nov 2022" },
          { src: "/museu/23-inicio-quadro.webp", r: L, title: "Quadro branco da sala", note: "O nome desenhado à mão, com a lista de metas e ações ao lado.", frame: "vitrine", when: "Jan 2023" },
          { src: "/team/2023-seletiva-prova-2.webp", r: 16 / 9, title: "Cada carteira, um candidato", note: "A sala da seletiva, antes de existir equipe.", frame: "moldura", when: "Nov 2022" },
          { src: "/museu/23-inicio-chaveiro.webp", r: L, title: "Chaveiro de acrílico da raposa", note: "Um dos primeiros brindes da equipe.", frame: "vitrine", when: "Jan 2023" },
          { src: "/museu/23-inicio-coracao.webp", r: L, title: "dia 1 de equipe", frame: "polaroid", when: "31/01/2023" },
          { src: "/museu/23-inicio-cubo.webp", r: L, title: "a primeira peça da Charged Up", frame: "polaroid", when: "04/02/2023" },
          { src: "/museu/23-inicio-qrcode.webp", r: L, title: "Faixa com QR code", note: "\"Para apoiar a Nine Tails no início dessa jornada\": o pedido de apoio impresso.", frame: "vitrine", when: "Fev 2023" },
          { src: "/museu/23-inicio-cartao-bumper.webp", r: L, title: "Cartão de fornecedor de bumpers", note: "Material e números de bumper: tudo era novidade.", frame: "fita", when: "Jan 2023" },
          { src: "/museu/23-inicio-lanche.webp", r: L, title: "pausa pro lanche", frame: "polaroid", when: "04/02/2023" },
          { src: "/museu/23-inicio-careta.webp", r: L, title: "concentração total", frame: "polaroid", when: "31/01/2023" },
        ],
      },
    ],
  },
  {
    id: "charged-up",
    number: "02",
    title: "Charged Up",
    game: "CHARGED UP",
    period: "2023",
    intro:
      "A temporada rookie. Da Regional do Brasil, dentro do Mané Garrincha, ao Mundial de Houston, com uma volta para casa que ninguém esqueceu e um segundo robô feito em menos de um mês.",
    robots: ["tank-tails", "the-answer"],
    awards: ["rookie-all-star", "rookie-inspiration", "engineering"],
    wings: [
      {
        name: "Ala Brasília",
        pieces: [
          { src: "/museu/23-bsb-alianca.webp", r: L, title: "Com a aliança, antes das finais", note: "Regional do Brasil, no estádio Mané Garrincha.", frame: "tela", when: "Mar 2023" },
          { src: "/museu/23-bsb-placar.webp", r: L, title: "Placar: WINNER", note: "Uma das vitórias da campanha na Regional do Brasil.", frame: "moldura", when: "Mar 2023" },
          { src: "/museu/23-bsb-estadio.webp", r: P, title: "Ajustes no meio do estádio", frame: "moldura", when: "Mar 2023" },
          { src: "/museu/23-bsb-carrinho.webp", r: P, title: "robô no braço", frame: "polaroid", when: "Mar 2023" },
          { src: "/team/2023-brasilia-rookie-all-star-placa.webp", r: P, title: "Rookie All Star Award", note: "O cristal e a placa do prêmio que veio junto com a vaga para Houston.", frame: "moldura", when: "Mar 2023" },
        ],
      },
      {
        name: "Ala Houston",
        pieces: [
          { src: "/museu/23-hou-curie.webp", r: L, title: "Divisão Curie, lotada", note: "FIRST Championship, George R. Brown Convention Center.", frame: "tela", when: "Abr 2023" },
          { src: "/museu/23-hou-robo-bandeira.webp", r: P, title: "Tank Tails e a bandeira", frame: "moldura", when: "Abr 2023" },
          { src: "/museu/23-hou-bandeira-costas.webp", r: P, title: "o Brasil nos ombros", frame: "polaroid", when: "Abr 2023" },
          { src: "/team/2023-houston-placa.webp", r: 1.5, title: "Placa do Rookie Inspiration Award", note: "Divisão Curie.", frame: "vitrine", when: "Abr 2023" },
          { src: "/museu/23-hou-lanche-chao.webp", r: P, title: "almoço no chão do pavilhão", frame: "polaroid", when: "Abr 2023" },
          { src: "/museu/23-hou-pintura-bandeira.webp", r: P, title: "Pintando a bandeira", note: "Crianças pintando a bandeira do Brasil no pavilhão.", frame: "fita", when: "Abr 2023" },
          { src: "/museu/23-hou-selfie-bandeira.webp", r: P, title: "selfie com a bandeira", frame: "polaroid", when: "Abr 2023" },
          { src: "/museu/23-hou-selfie-trio.webp", r: L, title: "cansados e felizes", frame: "polaroid", when: "Abr 2023" },
          { src: "/museu/23-hou-careta.webp", r: L, title: "foto séria (não)", frame: "polaroid", when: "Abr 2023" },
          { src: "/museu/23-hou-carro.webp", r: L, title: "no carro, rumo ao pavilhão", frame: "polaroid", when: "Abr 2023" },
        ],
        clip: {
          src: "/clips/houston-rookie-inspiration.mp4",
          label: "A equipe pula e comemora com a placa do Rookie Inspiration Award em Houston.",
          caption: "Logo depois da premiação do Rookie Inspiration Award.",
          aspect: "aspect-[4/5]",
        },
      },
      {
        name: "Ala Space Center",
        pieces: [
          { src: "/museu/23-hou-nasa-traje.webp", r: P, title: "Um museu dentro do museu", note: "Traje espacial no Space Center Houston.", frame: "moldura", when: "Abr 2023" },
          { src: "/museu/23-hou-nasa-onibus-espacial.webp", r: P, title: "O ônibus espacial", frame: "moldura", when: "Abr 2023" },
          { src: "/museu/23-hou-nasa-selfie.webp", r: P, title: "turista oficial", frame: "polaroid", when: "Abr 2023" },
          { src: "/team/2023-houston-space-center.webp", r: 1.35, title: "Pioneiros no Space Center", frame: "moldura", when: "Abr 2023" },
        ],
      },
      {
        name: "Ala A volta",
        pieces: [
          { src: "/museu/23-volta-beijo-trofeu.webp", r: P, title: "o troféu chegou", frame: "polaroid", when: "Abr 2023" },
          { src: "/team/2023-houston-rookie-inspiration-ana-clara.webp", r: P, title: "Ana Clara e o Rookie Inspiration", note: "O cristal e a placa da divisão Curie, em casa.", frame: "moldura", when: "Abr 2023" },
          { src: "/museu/23-volta-selfie.webp", r: P, title: "de volta em casa", frame: "polaroid", when: "Abr 2023" },
          { src: "/museu/23-volta-festa.webp", r: L, title: "A festa de boas-vindas", frame: "moldura", when: "Abr 2023" },
          { src: "/museu/23-volta-faixa.webp", r: L, title: "\"Sejam bem-vindos\"", note: "Foco e determinação são princípios de campeões.", frame: "fita", when: "Abr 2023" },
        ],
      },
      {
        name: "Ala Rio de Janeiro",
        pieces: [
          { src: "/museu/23-answer-base.webp", r: P, title: "A base do The Answer", note: "Menos de um mês entre a primeira peça e o Off-Season.", frame: "moldura", when: "Jul 2023" },
          { src: "/museu/23-answer-montagem.webp", r: L, title: "Montagem", frame: "fita", when: "Jul 2023" },
          { src: "/museu/23-answer-fiacao.webp", r: P, title: "Fiação", frame: "moldura", when: "Jul 2023" },
          { src: "/team/2023-rio-engineering-award.webp", r: P, title: "Engineering Award", note: "Festival SESI de Robótica, Off-Season Brasil.", frame: "moldura", when: "Ago 2023" },
        ],
        clip: {
          src: "/clips/the-answer.mp4",
          label: "Os LEDs do robô The Answer acendendo na oficina.",
          caption: "Ligando os LEDs na oficina.",
          aspect: "aspect-[3/4]",
        },
      },
    ],
  },
  {
    id: "crescendo",
    number: "03",
    title: "Crescendo",
    game: "CRESCENDO",
    period: "2024",
    intro:
      "O primeiro ano como veterana: dois robôs, o primeiro swerve da equipe e uma final no Mato Grosso que terminou em abraço.",
    robots: ["garuttinho", "predator"],
    awards: ["finalista", "impacto"],
    wings: [
      {
        name: "Ala Brasília",
        pieces: [
          { src: "/team/2024-garuttinho.webp", r: 1.5, title: "Garuttinho em quadra", frame: "tela", when: "Mar 2024" },
          { src: "/museu/24-bsb-retrato.webp", r: 1.5, title: "Retrato no box", note: "Pela câmera da equipe.", frame: "moldura", when: "Mar 2024" },
          { src: "/museu/24-bsb-dupla.webp", r: 1.5, title: "Estratégia", frame: "moldura", when: "Mar 2024" },
          { src: "/museu/24-bsb-arquibancada.webp", r: 1.5, title: "Na arquibancada", frame: "fita", when: "Mar 2024" },
        ],
        clip: {
          src: "/clips/garuttinho.mp4",
          label: "A câmera passeia pela lateral do Garuttinho, mostrando correntes, motores e a placa da raposa.",
          caption: "Um passeio pela lateral do Garuttinho.",
        },
      },
      {
        name: "Ala Cuiabá",
        pieces: [
          { src: "/team/2024-cuiaba-alianca-finalista.webp", r: L, title: "A aliança finalista", note: "Com a 7033 e a 9994.", frame: "tela", when: "Ago 2024" },
          { src: "/team/2024-cuiaba-pit-predator.webp", r: L, title: "Predator no box", frame: "moldura", when: "Ago 2024" },
          { src: "/team/2024-cuiaba-estande-nine-learns.webp", r: L, title: "Estande do Nine Learns", frame: "moldura", when: "Ago 2024" },
          { src: "/team/2024-cuiaba-finalistas.webp", r: 0.56, title: "finalistas!", frame: "polaroid", when: "Ago 2024" },
          { src: "/team/2024-cuiaba-premiacao.webp", r: 0.56, title: "Premiação", frame: "moldura", when: "Ago 2024", position: "50% 45%" },
        ],
      },
      {
        name: "Ala A festa",
        pieces: [
          { src: "/museu/24-festa-equipe.webp", r: L, title: "A comemoração do Off-Season", frame: "tela", when: "Ago 2024" },
          { src: "/museu/24-festa-abraco-3.webp", r: P, title: "esse abraço", frame: "polaroid", when: "Ago 2024" },
          { src: "/museu/24-festa-abraco.webp", r: P, title: "obrigado por tudo", frame: "polaroid", when: "Ago 2024" },
          { src: "/museu/24-festa-abraco-2.webp", r: P, title: "Abraços na comemoração", frame: "moldura", when: "Ago 2024" },
        ],
      },
    ],
  },
  {
    id: "reefscape",
    number: "04",
    title: "Reefscape",
    game: "REEFSCAPE",
    period: "2025",
    intro:
      "Um robô com controle customizado, duas regionais, um off-season no Sul e muita troca com outras equipes: bottons, cordões, selfies e recados.",
    robots: ["arak"],
    wings: [
      {
        name: "Ala Brasília",
        pieces: [
          { src: "/team/2025-brasilia-arak-campo.webp", r: 0.56, title: "Arak em campo", frame: "moldura", when: "Mar 2025", position: "50% 60%" },
          { src: "/museu/25-bsb-cordoes.webp", r: P, title: "Cordões e bottons", note: "\"Cool girls build robots\": lembranças da FIRST Robotics Girls.", frame: "vitrine", when: "Mar 2025" },
          { src: "/museu/25-bsb-box.webp", r: P, title: "Ajustes no box", frame: "moldura", when: "Mar 2025" },
          { src: "/museu/25-bsb-selfie-equipes.webp", r: P, title: "amigas de outra equipe", frame: "polaroid", when: "Mar 2025" },
          { src: "/museu/25-bsb-arquibancada.webp", r: P, title: "A bandeira da Firjan na arquibancada", frame: "moldura", when: "Mar 2025" },
          { src: "/team/2025-brasilia-palco.webp", r: 0.56, title: "no palco do torneio", frame: "polaroid", when: "Mar 2025", position: "50% 30%" },
        ],
        clip: {
          src: "/clips/arak.mp4",
          label: "O Arak testando o swerve na oficina.",
          caption: "Testando o swerve antes de Brasília.",
        },
      },
      {
        name: "Ala São Paulo",
        pieces: [
          { src: "/team/2025-sp-arena.webp", r: 1.5, title: "A arena da Regional de São Paulo", frame: "tela", when: "Mar 2025" },
          { src: "/team/2025-arak-lateral.webp", r: 0.56, title: "Arak, de lado", frame: "moldura", when: "Mar 2025" },
          { src: "/team/2025-sp-campo.webp", r: 1.5, title: "Em quadra", frame: "moldura", when: "Mar 2025" },
        ],
      },
    ],
  },
  {
    id: "rebuilt",
    number: "05",
    title: "Rebuilt",
    game: "REBUILT",
    period: "2026",
    intro:
      "Uma temporada sobre arqueologia e reconstrução, e um robô com nome de faraó. Esta sala mostra o caminho inteiro: do protótipo de papelão à arena de São Paulo.",
    robots: ["pharaoh"],
    wings: [
      {
        name: "Ala Oficina",
        pieces: [
          { src: "/museu/26-prototipo-papelao.webp", r: P, title: "Protótipo de papelão", note: "O primeiro teste de tamanho, com fita e caixa.", frame: "fita", when: "Jan 2026" },
          { src: "/museu/26-prototipo-madeira.webp", r: P, title: "Depois, madeira", frame: "moldura", when: "Jan 2026" },
          { src: "/team/2026-oficina-prototipo.webp", r: P, title: "E MDF em tamanho real", frame: "moldura", when: "Jan 2026" },
          { src: "/museu/26-oficina-rodas.webp", r: P, title: "Rodas do intake", frame: "vitrine", when: "Jan 2026" },
          { src: "/team/2026-oficina-intake.webp", r: P, title: "O intake ganhando forma", frame: "moldura", when: "Fev 2026" },
          { src: "/museu/26-oficina-pecas.webp", r: P, title: "peça por peça", frame: "polaroid", when: "Fev 2026" },
        ],
      },
      {
        name: "Ala São Paulo",
        pieces: [
          { src: "/team/2026-sp-equipe-robo.webp", r: L, title: "A drive team com o Pharaoh", frame: "tela", when: "Mar 2026" },
          { src: "/museu/26-sp-costas.webp", r: P, title: "Os nomes nas costas", frame: "moldura", when: "Mar 2026" },
          { src: "/team/2026-sp-piloto.webp", r: P, title: "no controle", frame: "polaroid", when: "Mar 2026" },
          { src: "/museu/26-sp-box.webp", r: P, title: "Conversa no box", frame: "moldura", when: "Mar 2026" },
          { src: "/team/2026-sp-mascote.webp", r: P, title: "visita ilustre", frame: "polaroid", when: "Mar 2026" },
          { src: "/museu/26-sp-assistindo.webp", r: P, title: "De olho na partida", frame: "fita", when: "Mar 2026" },
        ],
      },
    ],
  },
];
