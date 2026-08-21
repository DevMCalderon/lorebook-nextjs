"use server";

import { prisma } from "@/lib/prisma";
import type { Block } from "@blocknote/core";
import { revalidatePath } from "next/cache";

function extractText(block: Block): string {
  const ownText = Array.isArray(block.content)
    ? block.content.map((item) => ("text" in item ? item.text : "")).join("")
    : "";

  const childrenText = block.children?.map(extractText).join(" ") ?? "";

  return [ownText, childrenText].filter(Boolean).join(" ");
}

// Trae TODAS las fichas, solo lo necesario para la lista (no el content completo, para que sea rápido)
export async function getEntities() {
  return prisma.entity.findMany({
    select: { id: true, name: true, type: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

// Trae UNA ficha completa, con su content, para abrirla en el editor
export async function getEntity(id: string) {
  return prisma.entity.findUnique({ where: { id } });
}

// Crea una ficha nueva
export async function createEntity(name: string, content: Block[]) {
  const plainText = content.map(extractText).join(" ");

  const entity = await prisma.entity.create({
    data: {
      name: name || "Untitled",
      type: "character",
      content: content as object,
      plainText,
    },
  });

  revalidatePath("/");
  return entity.id;
}

// Actualiza una ficha que ya existe
export async function updateEntity(id: string, name: string, content: Block[]) {
  const plainText = content.map(extractText).join(" ");

  await prisma.entity.update({
    where: { id },
    data: {
      name: name || "Untitled",
      content: content as object,
      plainText,
    },
  });

  // revalidatePath("/") es la línea que le dice a Next.js: "oye, la lista de fichas en la página principal quedó desactualizada, la próxima vez que alguien la visite, tráela de nuevo de la base de datos
  revalidatePath("/");
}
