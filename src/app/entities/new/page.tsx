import { EntityEditor } from "@/components/entity-editor";
import { BackLink } from "@/components/back-link";

export default function NewEntityPage() {
  return (
    <>
      <BackLink />
      <div className="mt-4">
        <EntityEditor />
      </div>
    </>
  );
}
