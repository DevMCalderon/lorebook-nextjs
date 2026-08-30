"use server";

import { prisma } from "@/lib/prisma";
import type { Block } from "@blocknote/core";
import { revalidatePath } from "next/cache";

const VERSION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos entre "fotos" automáticas

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

// Decide si toca "tomar una snapshot" antes de sobrescribir
async function maybeSnapshot(entityId: string, name: string, content: unknown) {
  const lastVersion = await prisma.entityVersion.findFirst({
    where: { entityId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const enoughTimePassed =
    !lastVersion ||
    Date.now() - lastVersion.createdAt.getTime() > VERSION_INTERVAL_MS;

  if (enoughTimePassed) {
    await prisma.entityVersion.create({
      data: { entityId, name, content: content as object },
    });
  }
}

// Actualiza una ficha que ya existe
export async function updateEntity(id: string, name: string, content: Block[]) {
  const plainText = content.map(extractText).join(" ");

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

  // revalidatePath("/") es la línea que le dice a Next.js: "oye, la lista de fichas en la página principal quedó desactualizada, la próxima vez que alguien la visite, tráela de nuevo de la base de datos
  revalidatePath("/");
}

// Lista de snapshots guardadas de una ficha (sin el contenido completo, para que cargue rápido)
export async function getEntityVersions(entityId: string) {
  return prisma.entityVersion.findMany({
    where: { entityId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });
}

// Restaura una snapshots vieja como el contenido actual
export async function restoreVersion(entityId: string, versionId: string) {
  const version = await prisma.entityVersion.findUnique({
    where: { id: versionId },
  });

  if (!version) throw new Error("version not found.");

  const current = await prisma.entity.findUnique({ where: { id: entityId } });

  // Antes de restaurar, guarda también una snapshots de "justo antes de restaurar" — por si acaso
  if (current) {
    await prisma.entityVersion.create({
      data: {
        entityId,
        name: current.name,
        content: current.content as object,
      },
    });
  }

  const versionBlocks = version.content as unknown as Block[];
  const plainText = versionBlocks.map(extractText).join(" ");

  await prisma.entity.update({
    where: { id: entityId },
    data: { name: version.name, content: version.content as object, plainText },
  });

  revalidatePath("/");
  revalidatePath(`/entities/${entityId}`);
}
