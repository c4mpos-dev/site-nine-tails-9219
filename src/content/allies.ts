import { teams } from "@/content/teams";

/** Nomes das equipes que mais dividiram aliança com a Nine Tails (fonte: The Blue Alliance). */
export const teamNames: Record<number, { name: string; city: string }> = {
  7033: { name: "Manna Doctors Machines", city: "Curitiba, PR" },
  1860: { name: "Alphabots", city: "São José dos Campos, SP" },
  5800: { name: "Magic Island Robotics", city: "Florianópolis, SC" },
  1772: { name: "The Brazilian Trail Blazers", city: "Gravataí, RS" },
  9050: { name: "Tucanus", city: "Nova Friburgo, RJ" },
  9305: { name: "MonT", city: "Montenegro, RS" },
  6404: { name: "Brazilian Storm", city: "São José dos Campos, SP" },
  9166: { name: "TecRobot", city: "São Leopoldo, RS" },
  7567: { name: "SESI SENAI Octopus", city: "Bauru, SP" },
  9175: { name: "Brain Machine", city: "Catalão, GO" },
  7563: { name: "SESI SENAI Megazord", city: "Jundiaí, SP" },
  1156: { name: "Under Control", city: "Novo Hamburgo, RS" },
  9169: { name: "Agrotech", city: "Várzea Grande, MT" },
  9110: { name: "SESI SENAI Atomiic", city: "São João del-Rei, MG" },
  9218: { name: "Alpha", city: "Rio de Janeiro, RJ" },
  9047: { name: "SESI SC Techmaker", city: "Blumenau, SC" },
};

const UF: Record<string, string> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA", Ceará: "CE", "Distrito Federal": "DF",
  "Espírito Santo": "ES", Goiás: "GO", Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR", Pernambuco: "PE", Piauí: "PI",
  "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", Rondônia: "RO", Roraima: "RR",
  "Santa Catarina": "SC", "São Paulo": "SP", Sergipe: "SE", Tocantins: "TO",
};

/** Nome e cidade de qualquer equipe: a lista curada acima tem prioridade, o resto vem do TBA. */
export function teamInfo(n: number): { name: string; city: string } | undefined {
  if (teamNames[n]) return teamNames[n];
  const t = teams[n];
  if (!t) return undefined;
  const city = t.city.replace(/, ([^,]+)$/, (m, state: string) => (UF[state] ? `, ${UF[state]}` : m));
  // Tira o número repetido no apelido ("1860 Alphabots", "Tucanus #9050").
  const name = t.name.replace(`${n} `, "").replace(` #${n}`, "").trim();
  return { name, city };
}

/** Números 9990+ são equipes de demonstração usadas para completar alianças em off-seasons. */
export const isDemoTeam = (n: number) => n >= 9990 && n <= 9999;

/** Os eventos das partidas, ligados às temporadas. */
export const matchEvents: Record<string, { season: string; name: string; short: string }> = {
  "2023-brasilia": { season: "2023-charged-up", name: "Brazil Regional", short: "Brasília 2023" },
  "2023-houston": { season: "2023-charged-up", name: "Mundial · Curie Division", short: "Houston 2023" },
  "2023-rio": { season: "2023-charged-up", name: "Off-Season Brazil", short: "Rio 2023" },
  "2024-brasilia": { season: "2024-crescendo", name: "Brazil Regional", short: "Brasília 2024" },
  "2024-cuiaba": { season: "2024-crescendo", name: "Off-Season MT", short: "Cuiabá 2024" },
  "2025-brasilia": { season: "2025-reefscape", name: "Regional Brasília", short: "Brasília 2025" },
  "2025-sao-paulo": { season: "2025-reefscape", name: "Regional São Paulo", short: "São Paulo 2025" },
  "2025-porto-alegre": { season: "2025-reefscape", name: "Off-Season RS", short: "Porto Alegre 2025" },
  "2026-sao-paulo": { season: "2026-rebuilt", name: "Regional SESI Educação", short: "São Paulo 2026" },
  "2026-osasco": { season: "2026-rebuilt", name: "Regional SESI Osasco", short: "Osasco 2026" },
};
