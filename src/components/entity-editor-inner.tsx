"use client";

import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { saveEntity } from "@/app/actions";

export function EntityEditorInner() {
  const editor = useCreateBlockNote();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSave() {
    setStatus("saving");
    await saveEntity("Soraka Estrella Guardián", editor.document);
    setStatus("saved");
  }

  return (
    <div>
      <button
        onClick={handleSave}
        className="mb-4 px-4 py-2 bg-black text-white rounded"
      >
        {status === "saving" ? "Guardando..." : "Guardar"}
      </button>
      <BlockNoteView editor={editor} />
    </div>
  );
}
