import { getEntity, getEntityVersions, restoreVersion } from "@/app/actions";
import { BackLink } from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = await getEntity(id);
  if (!entity) notFound();

  const versions = await getEntityVersions(id);

  async function handleRestore(formData: FormData) {
    "use server";
    const versionId = formData.get("versionId") as string;
    await restoreVersion(id, versionId);
    redirect(`/entities/${id}`);
  }

  return (
    <div>
      <BackLink href={`/entities/${id}`} label="Go back" />
      <h1 className="text-2xl font-bold my-4">
        Version history - {entity && entity.name ? entity.name : ""}
      </h1>

      {versions.length === 0 && (
        <p className="text-gray-500">
          No saved versions yet. Versions are created automatically as you keep
          editing.
        </p>
      )}

      <ul className="space-y-2">
        {versions.map((v) => (
          <li key={v.id}>
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{v.name}</p>
                <p className="text-sm text-gray-400">
                  {v.createdAt.toLocaleString()}
                </p>
              </div>
              <form action={handleRestore}>
                <input type="hidden" name="versionId" value={v.id} />
                <Button type="submit" variant="outline" size="sm">
                  Restore
                </Button>
              </form>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
