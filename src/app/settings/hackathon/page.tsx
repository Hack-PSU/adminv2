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
    { accessorKey: "name", header: "Name", editable: true, type: "text" },
    {
      accessorKey: "active",
      header: "Active",
      editable: true,
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
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