/**
 * Alumni: quem já passou pela Nine Tails. Cada um vira um crachá em /alumni.
 * Preencha só o que a própria pessoa autorizou; campo vazio não aparece.
 * Redes sociais: `instagram` é só o usuário, sem @; `linkedin` é o link completo.
 */
/** O que os alumni fazem pela equipe e pela FIRST depois de sair. Lista geral, sem dizer quem faz o quê. */
export const paths = [
  { label: "Voltam como mentores", text: "Orientam uma área da equipe durante a temporada." },
  { label: "Cuidam do site", text: "Constroem e mantêm este site da equipe." },
  { label: "Ajudam quando a equipe chama", text: "Aparecem na oficina ou nos eventos quando precisa de mão." },
  { label: "Voluntários e juízes da FIRST", text: "Trabalham nos eventos da FIRST no Brasil, do outro lado da quadra." },
  { label: "Seguem carreira", text: "Levam o que aprenderam na raposa para a faculdade e o trabalho." },
];

export type Alumnus = {
  name: string;
  /** Área em que atuou na equipe. */
  area?: "Mecânica" | "Elétrica" | "Programação" | "Social & Marketing";
  /** Pelo que era responsável na equipe. */
  did?: string;
  /** Ano de entrada e de saída da equipe como integrante. */
  years?: [number, number?];
  /** O que faz hoje: curso, cargo, empresa. */
  now?: string;
  /** Uma linha descontraída sobre a pessoa na equipe, do jeito que a turma lembra dela. */
  vibe?: string;
  /** Foto (em /public), com o enquadramento do rosto. */
  photo?: { src: string; position?: string };
  /** @ do Instagram, sem o @. */
  instagram?: string;
  /** Link completo do LinkedIn. */
  linkedin?: string;
};

export const alumni: Alumnus[] = [
  { name: "Ana Luíza", years: [2023], now: "Publicidade", instagram: "", linkedin: "" },
  { name: "Cauã Campos", years: [2023], now: "Engenharia de Software", instagram: "", linkedin: "" },
  { name: "Davi Garutti", years: [2023], now: "Engenharia", instagram: "", linkedin: "" },
  { name: "Erick Maia", years: [2023], now: "Tradução e documentação", instagram: "", linkedin: "" },
  { name: "Gabriel Lauer", years: [2023], did: "CAD do robô", now: "Voluntário", instagram: "", linkedin: "" },
  { name: "Gabriel Rosa", years: [2023], now: "Treinamentos técnicos", instagram: "", linkedin: "" },
  { name: "Gabriel Vilela", years: [2023], now: "Mentor de engenharia", instagram: "", linkedin: "" },
  { name: "Iago", years: [2023], area: "Programação", now: "Mentor de programação", instagram: "", linkedin: "" },
  { name: "Jessé Nunes", years: [2023], area: "Mecânica", now: "Mentor de mecânica", instagram: "", linkedin: "" },
  { name: "Mirella Costa", years: [2023], now: "Voluntária FIRST", instagram: "", linkedin: "" },
  { name: "Vinicios Gimenez", years: [2023], now: "Engenharia · Juiz da FLL", instagram: "", linkedin: "" },
];
