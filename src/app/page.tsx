import Link from "next/link";
import { getEntities } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const entities = await getEntities();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entities</h1>
        <Button
          nativeButton={false}
          render={<Link href="/entities/new">Add new</Link>}
        />
      </div>

      {entities.length === 0 && (
        <p className="text-gray-500">
          You don&apos;t have any entities yet. Create your first one.
        </p>
      )}

      <ul className="space-y-2">
        {entities.map((entity) => (
          <li key={entity.id}>
            <Link href={`/entities/${entity.id}`}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium">{entity.name}</span>
                <span className="ml-2 text-sm text-gray-400">
                  ({entity.type})
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
