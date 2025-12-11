"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllExtraCreditClasses,
  useDeleteExtraCreditClass,
  useUpdateExtraCreditClass,
} from "@/common/api/extra-credit/hook";
import { ExtraCreditClassEntity } from "@/common/api/extra-credit/entity";

export default function ManageClassesPage() {
  const { data: classes = [], isLoading, refetch } = useAllExtraCreditClasses();
  const deleteClassMutation = useDeleteExtraCreditClass();
  const updateClassMutation = useUpdateExtraCreditClass();

  const columns: DataTableColumn<ExtraCreditClassEntity>[] = [
    { accessorKey: "name", header: "Class Name" },
    { accessorKey: "hackathonId", header: "Hackathon ID" },
  ];

  const handleSave = async (data: ExtraCreditClassEntity[]) => {
    console.log("Save called with:", data);
    await Promise.all(
      data.map((item) =>
        updateClassMutation.mutateAsync({
          id: item.id,
          data: {
            name: item.name,
            hackathonId: item.hackathonId,
          },
        })
      )
    );
    await refetch();
  };

  const handleDelete = async (ids: Array<string | number>) => {
    await Promise.all(
      ids.map((id) => deleteClassMutation.mutateAsync(Number(id)))
    );
    await refetch();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Manage Classes
          </h1>
          <p className="text-sm text-zinc-500">
            Assign, update, and organize extra credit classes.
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading classes...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Manage Classes
        </h1>
        <p className="text-sm text-zinc-500">
          Assign, update, and organize extra credit classes.
        </p>
      </header>

      <DataTable
        data={classes}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );
}