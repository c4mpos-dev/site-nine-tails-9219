/**
 * Fotos de temporada que NÃO são da equipe (para ilustrar os jogos da FRC).
 * Todas com licença livre; o crédito aparece na legenda e na página de créditos.
 */
export type Credit = { src: string; caption: string; author: string; license: string; source: string };

export const seasonPhotos: Record<string, Credit> = {
  "2023-charged-up-field": {
    src: "/seasons/2023-charged-up-field.webp",
    caption: "Campo do CHARGED UP: cones, cubos e a Charge Station (San Diego Regional 2023).",
    author: "Lily Chen / NAVWAR",
    license: "Domínio público",
    source: "https://commons.wikimedia.org/wiki/File:NAVWAR_2023_San_Diego_Regional.jpg",
  },
  "2024-crescendo-note": {
    src: "/seasons/2024-crescendo-note.webp",
    caption: "Uma note na garra de um robô da CRESCENDO.",
    author: "Dmhll",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:FRC_9450_robot_holding_note.jpg",
  },
  "2024-crescendo-field": {
    src: "/seasons/2024-crescendo-field.webp",
    caption: "Campo da CRESCENDO com Speaker, Amp e Stage.",
    author: "Rainclaw7",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Crescendo_Field_VAFAL.jpg",
  },
  "2024-crescendo-wide": {
    src: "/seasons/2024-crescendo-wide.webp",
    caption: "Partida da CRESCENDO.",
    author: "Dmhll",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:FIRST_Robotics_Competition_(FRC)_2024_Crescendo_Playing_Field.jpg",
  },
  "2025-reefscape-reef": {
    src: "/seasons/2025-reefscape-reef.webp",
    caption: "O Reef da REEFSCAPE, com os corais nos galhos e as algas no topo.",
    author: "NASA Armstrong Flight Research Center",
    license: "Domínio público",
    source:
      "https://commons.wikimedia.org/wiki/File:NASA_Supports_Next_Generation_of_Innovators_at_Robotics_Competition_(AFRC2025-0063-39).jpg",
  },
  "2025-reefscape-barge": {
    src: "/seasons/2025-reefscape-barge.webp",
    caption: "Robô escalando a Barge no fim da partida.",
    author: "ThatOneFilipinoExtremeist",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:FRC_6854_%27s_Robot_on_a_Barge.jpg",
  },
  "2025-reefscape-field": {
    src: "/seasons/2025-reefscape-field.webp",
    caption: "Campo da REEFSCAPE.",
    author: "Ismart733",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:FRC_field_2025MITVC.jpg",
  },
  "2026-rebuilt-field": {
    src: "/seasons/2026-rebuilt-field.webp",
    caption: "Campo da REBUILT, com o fuel espalhado pela quadra.",
    author: "Rebeltronic",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:2026_FRC_Field_ONCMP.jpeg",
  },
  "houston-grb": {
    src: "/seasons/houston-grb.webp",
    caption: "George R. Brown Convention Center, casa do Mundial em Houston.",
    author: "Brian Reading",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:George_R._Brown_Convention_Center_2.jpg",
  },
};

export const seasonLogos: Record<string, string> = {
  "charged-up": "/seasons/logos/charged-up.svg",
  crescendo: "/seasons/logos/crescendo.svg",
  reefscape: "/seasons/logos/reefscape.png",
  rebuilt: "/seasons/logos/rebuilt.png",
};
