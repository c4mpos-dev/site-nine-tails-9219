/** Todas as viagens de competição da equipe, saindo de Resende (RJ). */
export type Trip = {
  date: string;
  code: string;
  city: string;
  event: string;
  status: string;
  highlight?: boolean;
  lat: number;
  lon: number;
};

export const home = { city: "Resende", code: "RSD", lat: -22.47, lon: -44.45 };

export const trips: Trip[] = [
  { date: "MAR 2023", code: "BSB", city: "Brasília", event: "Regional Brasil", status: "ROOKIE ALL STAR", highlight: true, lat: -15.79, lon: -47.88 },
  { date: "ABR 2023", code: "HOU", city: "Houston", event: "FIRST Championship", status: "ROOKIE INSPIRATION", highlight: true, lat: 29.76, lon: -95.37 },
  { date: "AGO 2023", code: "RIO", city: "Rio de Janeiro", event: "Off-Season Brasil", status: "ENGINEERING AWARD", highlight: true, lat: -22.91, lon: -43.17 },
  { date: "FEV 2024", code: "BSB", city: "Brasília", event: "Regional Brasil", status: "PLAYOFFS", lat: -15.79, lon: -47.88 },
  { date: "AGO 2024", code: "CGB", city: "Cuiabá", event: "Off-Season MT", status: "FINALISTA", highlight: true, lat: -15.6, lon: -56.1 },
  { date: "MAR 2025", code: "BSB", city: "Brasília", event: "Regional Brasília", status: "PLAYOFFS", lat: -15.79, lon: -47.88 },
  { date: "MAR 2025", code: "SAO", city: "São Paulo", event: "Regional São Paulo", status: "PLAYOFFS", lat: -23.55, lon: -46.63 },
  { date: "OUT 2025", code: "POA", city: "Porto Alegre", event: "Off-Season RS", status: "CONCLUÍDO", lat: -30.03, lon: -51.23 },
  { date: "MAR 2026", code: "SAO", city: "São Paulo", event: "Regional SESI Educação", status: "CONCLUÍDO", lat: -23.55, lon: -46.63 },
  { date: "MAR 2026", code: "OSA", city: "Osasco", event: "Regional SESI Osasco", status: "PLAYOFFS", lat: -23.53, lon: -46.79 },
  { date: "2027", code: "???", city: "A definir", event: "Temporada BIOCORE", status: "EMBARQUE EM BREVE", lat: home.lat, lon: home.lon },
];

/** Distância em linha reta (km) entre dois pontos, pela fórmula de haversine. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Ida e volta a partir de Resende. */
export const roundTripKm = (t: Trip) => Math.round(distanceKm(home, t) * 2);
