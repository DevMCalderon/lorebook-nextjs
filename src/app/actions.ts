"use server";

import { prisma } from "@/lib/prisma";
import type { Block } from "@blocknote/core";

export async function saveEntity(name: string, content: Block[]) {
  const plainText = content.map((block) => extractText(block)).join(" ");

  const entity = await prisma.entity.create({
    data: {
      name,
      type: "personaje",
      content: content as object,
      plainText,
    },
  });

  return entity.id;
}

// Función chiquita que saca solo el texto de cada bloque, para el "post-it" de búsqueda
function extractText(block: Block): string {
  const ownText = Array.isArray(block.content)
    ? block.content.map((item) => ("text" in item ? item.text : "")).join("")
    : "";

  const childrenText = block.children?.map(extractText).join(" ") ?? "";

  return [ownText, childrenText].filter(Boolean).join(" ");
}
