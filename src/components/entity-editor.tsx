"use client";

import dynamic from "next/dynamic";

const EntityEditorInner = dynamic(
  () => import("./entity-editor-inner").then((mod) => mod.EntityEditorInner),
  { ssr: false },
);

export function EntityEditor() {
  return <EntityEditorInner />;
}
