import Link from "next/link";
import { EntityEditor } from "@/components/entity-editor";
import { BackLink } from "@/components/back-link";

export default function NewEntityPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <BackLink />
      <div className="mt-4">
        <EntityEditor />
      </div>
    </main>
  );
}
