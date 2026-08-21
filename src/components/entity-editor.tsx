"use client";

import dynamic from "next/dynamic";
import type { Block } from "@blocknote/core";

const EntityEditorInner = dynamic(
  () => import("./entity-editor-inner").then((mod) => mod.EntityEditorInner),
  { ssr: false },
);

type Props = {
  entityId?: string;
  initialName?: string;
  initialContent?: Block[];
};

export function EntityEditor(props: Props) {
  return <EntityEditorInner {...props} />;
}
