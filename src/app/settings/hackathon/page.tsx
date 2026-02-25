"use client";

import { useState } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllHackathons,
  useUpdateHackathon,
  useMarkActiveHackathon,
  useCreateHackathon,
} from "@/common/api/hackathon/hook";
import { HackathonEntity } from "@/common/api/hackathon/entity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HackathonsSettingsPage() {
  const { data: hackathons = [], refetch } = useAllHackathons();
  const updateHackathon = useUpdateHackathon();
  const markActiveHackathon = useMarkActiveHackathon();
  const createHackathon = useCreateHackathon();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

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

  const handleAddHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.startTime || !formData.endTime) return;

    try {
      await createHackathon.mutateAsync({
        name: formData.name.trim(),
        startTime: new Date(formData.startTime).getTime(),
        endTime: new Date(formData.endTime).getTime(),
      });
      setFormData({ name: "", startTime: "", endTime: "" });
      setShowAddModal(false);
      await refetch();
    } catch (error) {
      console.error("Error creating hackathon:", error);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({ name: "", startTime: "", endTime: "" });
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Hackathons</h1>
        <Button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Hackathon
        </Button>
      </header>

      <DataTable
        data={hackathons}
        columns={columns}
        onSave={handleSave}
        onRefresh={async () => { await refetch(); }}
      />

      {/* Add Hackathon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Add Hackathon
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Create a new hackathon event.
              </p>
            </div>
            <form onSubmit={handleAddHackathon} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Hack-PSU 2024"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createHackathon.isPending || !formData.name.trim() || !formData.startTime || !formData.endTime}
                >
                  {createHackathon.isPending ? "Creating..." : "Add Hackathon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}