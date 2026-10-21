/**
 * Marca um bloco de foto como "clicável para ampliar". O visualizador (PhotoViewer, no layout)
 * escuta os cliques na página toda e abre a foto clicada. Use num elemento `relative overflow-hidden`
 * que envolve a <Image>; a classe `zoomable` dá o efeito ao passar o mouse.
 */
export function zoom(src: string, caption?: string) {
  return {
    "data-zoom": src,
    "data-zoom-caption": caption ?? "",
    role: "button",
    tabIndex: 0,
    "aria-label": caption ? `Ampliar foto: ${caption}` : "Ampliar foto",
  } as const;
}
