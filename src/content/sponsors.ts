export type Sponsor = { name: string; tier: "institution" | "major" | "partner"; logo?: string; url?: string };

/** Fonte: lista oficial de patrocinadores no FIRST/TBA. Logos em /public/sponsors quando disponíveis. */
export const sponsors: Sponsor[] = [
  { name: "Firjan SENAI SESI Resende", tier: "institution" },
  { name: "Rockwell Automation", tier: "major" },
  { name: "Jaguar Land Rover", tier: "major" },
  { name: "Nissan", tier: "major" },
  { name: "Michelin", tier: "major" },
  { name: "Stellantis", tier: "major" },
  { name: "TACHI-S Brasil", tier: "major" },
  { name: "Knightec Group", tier: "major" },
  { name: "UERJ — FAT", tier: "partner" },
  { name: "Racitec Hidráulica", tier: "partner" },
  { name: "ORION Comunicação Visual", tier: "partner" },
  { name: "METTA", tier: "partner" },
  { name: "MATKA Consultoria", tier: "partner" },
  { name: "P&A Uniformes", tier: "partner" },
  { name: "Wolf Store", tier: "partner" },
  { name: "Vatel Elétrica", tier: "partner" },
  { name: "Clube Turismo Resende", tier: "partner" },
  { name: "Pro Rio Automação", tier: "partner" },
  { name: "VR Energia", tier: "partner" },
  { name: "CyberX", tier: "partner" },
  { name: "TecnoTOP Automação", tier: "partner" },
  { name: "Pão de Milho Panificadora", tier: "partner" },
  { name: "Equipilates", tier: "partner" },
];
