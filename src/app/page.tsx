import { EntityEditor } from "@/components/entity-editor";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Mi primera ficha</h1>
      <EntityEditor />
    </main>
  );
}
