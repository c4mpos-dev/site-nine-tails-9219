export const site = {
  name: "Nine Tails",
  number: "9219",
  fullName: "Nine Tails #9219",
  url: "https://ninetails9219.com.br",
  tagline: "Evolução constante desde 2022.",
  description:
    "Equipe de FIRST Robotics Competition da Escola Firjan SENAI SESI Resende (RJ). Rookie All Star e Rookie Inspiration no Mundial de Houston em 2023, levando STEAM para milhares de crianças da rede pública.",
  founded: "2022-11-02",
  rookieYear: 2023,
  school: "Escola Firjan SENAI SESI Resende",
  city: "Resende",
  state: "Rio de Janeiro",
  country: "Brasil",
  email: "ninetails9219@gmail.com",
  socials: {
    instagram: "https://www.instagram.com/ninetails9219/",
    youtube: "https://www.youtube.com/@ninetails9219",
    tiktok: "https://www.tiktok.com/@ninetailsfrc",
    linkedin: "https://www.linkedin.com/in/nine-tails-undefined-959280261",
  },
  links: {
    tba: "https://www.thebluealliance.com/team/9219",
    first: "https://www.firstinspires.org/",
  },
} as const;

export const nav = [
  { href: "/temporadas", label: "Temporadas" },
  { href: "/robos", label: "Robôs" },
  { href: "/conquistas", label: "Conquistas" },
  { href: "/impacto", label: "Impacto" },
  { href: "/equipe", label: "Equipe" },
] as const;

/** Páginas extras, abertas no menu "Mais" (e listadas em /arquivo). */
export const navMore = [
  { href: "/museu", label: "Museu da Raposa", note: "O acervo da equipe, sala por sala" },
  { href: "/recordes", label: "Recordes e alianças", note: "As 122 partidas em números" },
  { href: "/pioneiros", label: "Os pioneiros", note: "O diário da primeira temporada" },
  { href: "/embarque", label: "Viagens", note: "Todas as competições, de Brasília a Houston" },
  { href: "/glossario", label: "Glossário", note: "O vocabulário da FRC explicado" },
  { href: "/toca", label: "Kit da marca", note: "Logos para baixar e curiosidades" },
] as const;

/** Números de destaque — fonte: portfólio "all book tails" (fev/2024) + TBA. */
export const stats = [
  { value: 25000, suffix: "+", label: "pessoas impactadas", detail: "diretamente por ações STEAM" },
  { value: 6222, suffix: "", label: "crianças no Nine Learns", detail: "em 5 escolas públicas de Resende" },
  { value: 55, suffix: "", label: "equipes em 16 países", detail: "receberam o projeto Nine Learns" },
  { value: 2.6, suffix: "mi", label: "pessoas alcançadas", detail: "pelas nossas redes e ações", decimals: 1 },
] as const;
