# Nine Tails #9219 — site oficial

Site da equipe de FIRST Robotics Competition **Nine Tails #9219** (Escola Firjan SENAI SESI Resende, RJ).

**Stack:** Next.js 16 (App Router, páginas estáticas) · Tailwind CSS v4 · Motion · three.js · TypeScript.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (sincroniza com o TBA antes)
npm start          # serve o build
npm run sync:tba   # atualiza as partidas a partir do The Blue Alliance
```

Para o `sync:tba` funcionar, crie `.env.local` com `TBA_API_KEY=...` (chave gerada em
thebluealliance.com/account). Na Vercel, cadastre a mesma variável. Sem a chave, o build usa os dados que já estão no repositório.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Textos e dados (temporadas, robôs, prêmios, pessoas, patrocinadores) | `src/content/*.ts` |
| Partidas e equipes (gerados pelo script, não editar à mão) | `src/content/matches.ts`, `src/content/teams.ts` |
| Pesquisa completa sobre a equipe (fonte dos dados) | `docs/PESQUISA.md` |
| Cores, fontes e utilitários visuais | `src/app/globals.css` (tokens no `:root`) |
| Páginas | `src/app/**/page.tsx` |
| Componentes | `src/components/` |
| Desenhos dos troféus | `src/components/graphics/Trophies.tsx` |
| Modelo 3D do Tank Tails | `public/models/tank-tails.glb` + `src/components/robots/TankTails3D.tsx` |
| Logos | `public/brand/` |
| Fotos da equipe | `public/team/` e `public/photos/` |
| Fotos dos jogos da FRC (com crédito e licença) | `public/seasons/` + `src/content/credits.ts` |

## Adicionando fotos

1. Converta para `.webp`, com no máximo ~1800px de largura, e salve em `public/team/`.
   Fotos do iPhone (`.HEIC`) precisam ser convertidas antes.
2. Aponte o caminho no conteúdo:
   - foto do robô: campo `photo` em `src/content/robots.ts`;
   - foto do prêmio: campo `photo` em `src/content/awards.ts`;
   - galeria da temporada: `teamPhotos` em `src/content/gallery.ts`;
   - topo da home (equipe inteira, uma por temporada): `heroTeamPhotos` em `src/content/gallery.ts`.

Sem foto, o site mostra um espaço reservado e os robôs aparecem como planta técnica.

## Novo prêmio

Adicione em `src/content/awards.ts`, escolhendo o desenho que corresponde ao troféu de verdade (`art`):
`frc-plaque` (placa de madeira da FRC), `sesi` (troféu do Festival SESI de Robótica) ou `certificate`.
Se for um troféu de formato novo, desenhe um componente novo em `Trophies.tsx`, a partir de uma foto dele.

## Nova temporada

Adicione um objeto em `src/content/seasons.ts`, os robôs em `src/content/robots.ts`, e as chaves do evento no TBA em
`scripts/sync-tba.mjs` (`EVENT_SLUGS`) e em `src/content/allies.ts` (`matchEvents`).

A paleta é fixa, com as cores da equipe. As temporadas se diferenciam pela foto real do jogo e pelo logo oficial, nunca
pela cor. Toda foto de terceiros precisa de licença livre e de entrada em `src/content/credits.ts` (aparece em /credits).
