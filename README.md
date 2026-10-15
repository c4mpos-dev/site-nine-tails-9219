# Nine Tails #9219 — site oficial

Site da equipe de FIRST Robotics Competition **Nine Tails #9219** (Escola Firjan SENAI SESI Resende, RJ).

**Stack:** Next.js 16 (App Router, páginas estáticas) · Tailwind CSS v4 · Motion · TypeScript.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
```

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Textos, números e dados (temporadas, robôs, prêmios, pessoas, patrocinadores) | `src/content/*.ts` |
| Pesquisa completa sobre a equipe (fonte dos dados) | `docs/PESQUISA.md` |
| Cores, fontes e utilitários visuais | `src/app/globals.css` (bloco `@theme`) |
| Páginas | `src/app/**/page.tsx` |
| Componentes | `src/components/` |
| Logos | `public/brand/` |
| Fotos da equipe | `public/photos/` |
| Fotos reais dos jogos da FRC (com crédito e licença) | `public/seasons/` + `src/content/credits.ts` |

## Adicionando fotos

O site foi feito para funcionar **sem fotos**: onde falta imagem, aparece um espaço reservado estilizado
(e os robôs aparecem como planta técnica). Para colocar a foto:

1. Converta para `.webp` (ou `.jpg`), com no máximo ~2000px de largura, e salve em `public/photos/` ou `public/robots/`.
2. Aponte o caminho no conteúdo. Por exemplo, em `src/content/robots.ts`:
   ```ts
   { slug: "arak", ..., photo: "/robots/arak.webp" }
   ```
   Em `src/content/awards.ts` é o campo `photo`, e nas galerias das temporadas é o componente `<Photo src="..." />`.

Fotos do iPhone (`.HEIC`) precisam ser convertidas antes. O `sharp` já vem instalado e dá conta disso.

## Nova temporada

Adicione um objeto em `src/content/seasons.ts` (com o `tail` seguinte e o `motif` do jogo) e os robôs em `src/content/robots.ts`.
Na home, a cauda da raposa correspondente acende sozinha.

A paleta é fixa, com as cores da equipe. As temporadas se diferenciam pela foto real do jogo, pelo logo oficial
e pela animação com a mecânica do jogo (`src/components/graphics/GameEffects.tsx`), nunca pela cor.
Toda foto de terceiros precisa de licença livre e de entrada em `src/content/credits.ts` (aparece em /creditos).
