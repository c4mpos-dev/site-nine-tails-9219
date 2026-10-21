export type Sponsor = { name: string; tier: "institution" | "major" | "partner"; logo?: string; url?: string };

/**
 * Fonte: lista oficial de patrocinadores no FIRST/TBA (nome da equipe).
 * Logos oficiais em /public/sponsors: Wikimedia Commons (Rockwell, JLR, Nissan, Michelin, Stellantis, Knightec, UERJ, Firjan)
 * e sites das empresas (TACHI-S, Clube Turismo, CyberX). Quem não tem `logo` aparece com o nome escrito.
 */
export const sponsors: Sponsor[] = [
  { name: "Firjan SENAI SESI Resende", tier: "institution", logo: "/sponsors/firjan.png" },
  { name: "Rockwell Automation", tier: "major", logo: "/sponsors/rockwell.svg" },
  { name: "Jaguar Land Rover", tier: "major", logo: "/sponsors/jlr.svg" },
  { name: "Nissan", tier: "major", logo: "/sponsors/nissan.svg" },
  { name: "Michelin", tier: "major", logo: "/sponsors/michelin.svg" },
  { name: "Stellantis", tier: "major", logo: "/sponsors/stellantis.svg" },
  { name: "TACHI-S Brasil", tier: "major", logo: "/sponsors/tachi-s.png" },
  { name: "Knightec Group", tier: "major", logo: "/sponsors/knightec.svg" },
  { name: "UERJ — FAT", tier: "partner", logo: "/sponsors/uerj.png" },
  { name: "Racitec Hidráulica", tier: "partner" },
  { name: "ORION Comunicação Visual", tier: "partner" },
  { name: "METTA", tier: "partner" },
  { name: "MATKA Consultoria", tier: "partner" },
  { name: "P&A Uniformes", tier: "partner" },
  { name: "Wolf Store", tier: "partner" },
  { name: "Vatel Elétrica", tier: "partner" },
  { name: "Clube Turismo Resende", tier: "partner", logo: "/sponsors/clube-turismo.png" },
  { name: "Pro Rio Automação", tier: "partner" },
  { name: "VR Energia", tier: "partner" },
  { name: "CyberX", tier: "partner", logo: "/sponsors/cyberx.png" },
  { name: "TecnoTOP Automação", tier: "partner" },
  { name: "Pão de Milho Panificadora", tier: "partner" },
  { name: "Equipilates", tier: "partner" },
];
