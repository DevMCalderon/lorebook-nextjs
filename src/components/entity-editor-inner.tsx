"use client";

import { useCallback, useRef, useState } from "react";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useRouter } from "next/navigation";
import {
  createEntity,
  updateEntity,
} from "@/app/entities/actions/entity-actions";
import { Input } from "@/components/ui/input";
import { BackLink } from "@/components/back-link";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  entityId?: string;
  initialName?: string;
  initialContent?: Block[];
};

const SAVE_DELAY_MS = 1500;

export function EntityEditorInner({
  entityId,
  initialName,
  initialContent,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [status, setStatus] = useState<"idle" | "unsaved" | "saving" | "saved">(
    "idle",
  );

  // Guardamos el id en una "caja" que no se resetea entre renders,
  // porque puede cambiar (de "sin id" a "con id") sin que React vuelva a montar el componente.
  const currentIdRef = useRef(entityId);
  const nameRef = useRef(initialName ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0 ? initialContent : undefined,
  });

  const performSave = useCallback(async () => {
    setStatus("saving");
    const content = editor.document;
    const currentName = nameRef.current; // <- lee siempre el valor más reciente

    if (currentIdRef.current) {
      await updateEntity(currentIdRef.current, currentName, content);
    } else {
      const newId = await createEntity(currentName, content);
      currentIdRef.current = newId;
      router.replace(`/entities/${newId}`);
    }

    setStatus("saved");
  }, [editor, router]);

  const scheduleSave = useCallback(() => {
    setStatus("unsaved");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      void performSave();
    }, SAVE_DELAY_MS);
  }, [performSave]);

  // Se dispara cada vez que cambia el contenido del editor (escribir, borrar, formatear...)
  useEditorChange(() => {
    scheduleSave();
  }, editor);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value); // actualiza lo que se VE en pantalla
    nameRef.current = value; // actualiza lo que se GUARDA (al instante, sin esperar)
    scheduleSave();
  }

  return (
    <div className="mb-4">
      <div className="flex justify-center items-center mb-4 gap-4">
        <BackLink />

        <Button
          variant="ghost"
          size="default"
          nativeButton={false}
          className="text-base"
          render={
            <Link href={`/entities/${entityId}/history`}>Version history</Link>
          }
        ></Button>

        <span className="text-gray-500 whitespace-nowrap px-2.5">
          {status === "idle" && "Saved"}
          {status === "saving" && "Saving..."}
          {status === "saved" && "Saved"}
          {status === "unsaved" && "Unsaved changes"}
        </span>
      </div>
      <Input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Entity name"
        className="text-center md:text-3xl h-10 font-semibold mb-4 focus-visible:border-none focus-visible:ring-1 "
      />
      <BlockNoteView editor={editor} />
    </div>
  );
}
