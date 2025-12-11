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
      cell: (value, row, onChange) => {
        const isEnabled = typeof value === "string" ? value === "true" : value;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onChange?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      },
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
