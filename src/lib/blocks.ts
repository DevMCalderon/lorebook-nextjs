import { Block } from "@blocknote/core";

// Saca solo el texto de un bloque (y sus hijos), para el "post-it" de búsqueda
function extractText(block: Block): string {
  const ownText = Array.isArray(block.content)
    ? block.content.map((item) => ("text" in item ? item.text : "")).join("")
    : "";

  const childrenText = block.children?.map(extractText).join(" ") ?? "";

  return [ownText, childrenText].filter(Boolean).join(" ");
}

export function blocksToPlainText(blocks: Block[]): string {
  return blocks.map(extractText).join(" ");
}
