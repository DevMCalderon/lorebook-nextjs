"use server";

import { prisma } from "@/lib/prisma";
import type { Block } from "@blocknote/core";
import { revalidatePath } from "next/cache";
import { blocksToPlainText } from "@/lib/blocks";

const VERSION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos entre "fotos" automáticas

// Decide si toca "tomar una snapshot" antes de sobrescribir
export async function maybeSnapshot(
  entityId: string,
  name: string,
  content: unknown,
) {
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
  const plainText = blocksToPlainText(versionBlocks);

  await prisma.entity.update({
    where: { id: entityId },
    data: { name: version.name, content: version.content as object, plainText },
  });

  revalidatePath("/");
  revalidatePath(`/entities/${entityId}`);
}
