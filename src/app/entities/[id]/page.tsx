import { notFound } from "next/navigation";
import { getEntity } from "@/app/actions";
import { EntityEditor } from "@/components/entity-editor";
import type { Block } from "@blocknote/core";
import { BackLink } from "@/components/back-link";

export default async function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = await getEntity(id);

  if (!entity) notFound();

  return (
    <>
      <BackLink />
      <div className="mt-4">
        <EntityEditor
          entityId={entity.id}
          initialName={entity.name}
          initialContent={entity.content as Block[]}
        />
      </div>
    </>
  );
}
