import Link from "next/link";
import { getEntities } from "@/app/entities/actions/entity-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUser, FilePlusCorner } from "lucide-react";

export default async function Home() {
  const entities = await getEntities();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileUser /> Entities
        </h1>
        <Button
          nativeButton={false}
          className="text-base"
          render={
            <Link href="/entities/new">
              <FilePlusCorner className="size-4" />
              Add new
            </Link>
          }
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
              <Card className="p-4 hover:bg-gray-50 transition-colors text-xl">
                <div className="flex gap-2 items-center">
                  <span className="font-medium">{entity.name}</span>
                  <span className="text-base text-gray-400">
                    ({entity.type})
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
