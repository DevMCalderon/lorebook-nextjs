"use server";

import { blocksToPlainText } from "@/lib/blocks";
import { prisma } from "@/lib/prisma";
import type { Block } from "@blocknote/core";
import { revalidatePath } from "next/cache";
import { maybeSnapshot } from "./version-actions";

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
  const plainText = blocksToPlainText(content);

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
  const plainText = blocksToPlainText(content);

  // Antes de sobrescribir, guarda una foto de cómo estaba (si ya pasó suficiente tiempo)
  const current = await prisma.entity.findUnique({ where: { id } });
  if (current) {
    await maybeSnapshot(id, current.name, current.content);
  }

  await prisma.entity.update({
    where: { id },
    data: {
      name: name || "Untitled",
      content: content as object,
      plainText,
    },
  });

  // revalidatePath("/") le dice a Next.js: "la lista de fichas en la página principal quedó desactualizada, la próxima vez que alguien la visite, tráela de nuevo de la base de datos
  revalidatePath("/");
}
