"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import { useAllFlags, usePatchFlags } from "@/common/api/flag/hook";
import { FlagEntity } from "@/common/api/flag/entity";

export default function FlagsSettingsPage() {
  const { data: flags = [], refetch } = useAllFlags();
  const patchFlags = usePatchFlags();

  const columns: DataTableColumn<FlagEntity>[] = [
    {
      accessorKey: "name",
      header: "Flag Name",
      editable: false,
      type: "text",
    },
    {
      accessorKey: "isEnabled",
      header: "Enabled",
      editable: true,
      type: "select",
      options: [
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ],
    },
  ];

  const handleSave = async (updated: FlagEntity[]) => {
    await patchFlags.mutateAsync({
      flags: updated.map((f) => ({
        name: f.name,
        isEnabled:
          typeof f.isEnabled === "string"
            ? f.isEnabled === "true"
            : f.isEnabled,
      })),
    });

    await refetch();
  };

  return (
    <DataTable
      data={flags}
      columns={columns}
      onSave={handleSave}
      onRefresh={async () => {
          await refetch();
        }}
    />
  );
}
