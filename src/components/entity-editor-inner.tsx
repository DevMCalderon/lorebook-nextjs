"use client";

import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useRouter } from "next/navigation";
import { createEntity, updateEntity } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  entityId?: string;
  initialName?: string;
  initialContent?: Block[];
};

export function EntityEditorInner({
  entityId,
  initialName,
  initialContent,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0 ? initialContent : undefined,
  });

  async function handleSave() {
    setStatus("saving");

    if (entityId) {
      await updateEntity(entityId, name, editor.document);
    } else {
      const newId = await createEntity(name, editor.document);
      router.push(`/entities/${newId}`);
      return;
    }

    setStatus("saved");
  }

  return (
    <div>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Entity name"
        className="mb-4 text-xl font-semibold"
      />
      <Button onClick={handleSave} className="mb-4">
        {status === "saving" ? "Saving..." : "Save"}
      </Button>
      <BlockNoteView editor={editor} />
    </div>
  );
}
