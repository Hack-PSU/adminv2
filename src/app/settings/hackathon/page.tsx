"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllHackathons,
  useUpdateHackathon,
  useMarkActiveHackathon,
} from "@/common/api/hackathon/hook";
import { HackathonEntity } from "@/common/api/hackathon/entity";

export default function HackathonsSettingsPage() {
  const { data: hackathons = [], refetch } = useAllHackathons();
  const updateHackathon = useUpdateHackathon();
  const markActiveHackathon = useMarkActiveHackathon();

  const columns: DataTableColumn<HackathonEntity>[] = [
    { accessorKey: "name", header: "Name", editable: false, type: "text" },
    {
      accessorKey: "active",
      header: "Active",
      editable: true,
      cell: (value, row, onChange) => {
        const isActive = typeof value === "string" ? value === "true" : value;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => onChange?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      },
    },
  ];

  const handleSave = async (updated: HackathonEntity[]) => {
    for (const hack of updated) {
      const activeBool =
        typeof hack.active === "string"
          ? hack.active === "true"
          : hack.active;

      await updateHackathon.mutateAsync({
        id: hack.id,
        data: { name: hack.name },
      });

      if (activeBool) {
        await markActiveHackathon.mutateAsync(hack.id);
      }
    }

    await refetch();
  };

  return (
    <DataTable
      data={hackathons}
      columns={columns}
      onSave={handleSave}
      onRefresh={async () => { await refetch(); }}
    />
  );
}