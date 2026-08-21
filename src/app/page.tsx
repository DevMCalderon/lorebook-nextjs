import Link from "next/link";
import { getEntities } from "./actions";

export default async function Home() {
  const entities = await getEntities();

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My entities</h1>
        <Link
          href="/entities/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          + New entity
        </Link>
      </div>

      {entities.length === 0 && (
        <p className="text-gray-500">
          You don&apos;t have any entities yet. Create your first one.
        </p>
      )}

      <ul className="space-y-2">
        {entities.map((entity) => (
          <li key={entity.id}>
            <Link
              href={`/entities/${entity.id}`}
              className="block p-4 border rounded hover:bg-gray-50"
            >
              <span className="font-medium">{entity.name}</span>
              <span className="ml-2 text-sm text-gray-400">
                ({entity.type})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
