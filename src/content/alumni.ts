/**
 * Alumni: quem já passou pela Nine Tails. Cada um vira uma carta em /alumni.
 * Redes sociais: preencha `instagram` (só o usuário, sem @) e `linkedin` (link completo).
 * Vazio não aparece. Só com autorização da própria pessoa.
 */
export type Alumnus = {
  name: string;
  /** Linha curta que aparece na frente da carta. */
  role: string;
  /** Área em que atuou na equipe. */
  area?: "Mecânica" | "Elétrica" | "Programação" | "Social & Marketing" | "Mentoria";
  /** Pelo que era responsável na equipe. */
  did?: string;
  /** Ano de entrada e de saída (sem saída: ainda por perto, como mentor ou voluntário). */
  years?: [number, number?];
  /** O que faz hoje. */
  now?: string;
  /** @ do Instagram, sem o @. */
  instagram?: string;
  /** Link completo do LinkedIn. */
  linkedin?: string;
  /** Uma memória da equipe, na voz da pessoa. */
  memory?: string;
};

export const alumni: Alumnus[] = [
  { name: "Ana Luíza", role: "Voluntária FIRST · Publicidade", instagram: "", linkedin: "" },
  { name: "Cauã Campos", role: "Engenharia de Software", instagram: "", linkedin: "" },
  { name: "Davi Garutti", role: "Engenharia", instagram: "", linkedin: "" },
  { name: "Erick Maia", role: "Tradução e documentação", instagram: "", linkedin: "" },
  { name: "Gabriel Lauer", role: "CAD do robô · Voluntário", instagram: "", linkedin: "" },
  { name: "Gabriel Rosa", role: "Treinamentos técnicos", instagram: "", linkedin: "" },
  { name: "Gabriel Vilela", role: "Mentor de engenharia", instagram: "", linkedin: "" },
  { name: "Jessé Nunes", role: "Mentor de mecânica", instagram: "", linkedin: "" },
  { name: "Mirella Costa", role: "Voluntária FIRST", instagram: "", linkedin: "" },
  { name: "Vinicios Gimenez", role: "Juiz FLL · Engenharia", instagram: "", linkedin: "" },
];
