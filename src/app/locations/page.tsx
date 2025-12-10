"use client";

import { FormEvent, useState } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  useAllLocations,
  useCreateLocation,
  useDeleteLocation,
  useUpdateLocation,
} from "@/common/api/location/hook";
import { LocationEntity } from "@/common/api/location/entity";

export default function LocationsPage() {
  const { data: locations = [], isLoading, refetch } = useAllLocations();
  const createLocationMutation = useCreateLocation();
  const deleteLocationMutation = useDeleteLocation();
  const updateLocationMutation = useUpdateLocation();

  const isCreating = createLocationMutation.isPending;
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const closeModal = () => {
    setShowAddModal(false);
    setName("");
    setCapacity("");
  };

  const columns: DataTableColumn<LocationEntity>[] = [
    {
      accessorKey: "name",
      header: "Name",
      editable: true,
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      editable: true,
      type: "number",
    },
  ];

  const handleAddLocation = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !capacity.trim()) return;
    await createLocationMutation.mutateAsync({
      name: name.trim(),
      capacity: Number(capacity),
    });
    closeModal();
    await refetch();
  };

  const handleSave = async (data: LocationEntity[]) => {
    const byId = new Map(locations.map((location) => [location.id, location]));

    await Promise.all(
      data
        .filter((location) => location.id != null)
        .filter((location) => {
          const original = byId.get(location.id);
          return (
            !original ||
            original.name !== location.name ||
            original.capacity !== location.capacity
          );
        })
        .map((location) =>
          updateLocationMutation.mutateAsync({
            id: location.id,
            data: {
              name: location.name,
              capacity: location.capacity,
            },
          }),
        ),
    );
    await refetch();
  };

  const handleDelete = async (ids: Array<string | number>) => {
    await Promise.all(
      ids.map((id) => deleteLocationMutation.mutateAsync(Number(id))),
    );
    await refetch();
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Locations</h1>
          <p className="text-sm text-zinc-500">
            Track venue spaces, room assignments, and satellite locations during
            the event.
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading locations...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">Locations</h1>
          <p className="text-sm text-zinc-500">
            Track venue spaces, room assignments, and satellite locations during
            the event.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          Add Location
        </Button>
      </header>

      <DataTable
        data={locations}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        onRefresh={async () => {
          await refetch();
        }}
        idField="id"
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Add Location
                </h2>
                <p className="text-sm text-zinc-500">
                  Create a new venue or room for the event.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                className="px-2 py-1"
              >
                Close
              </Button>
            </div>
            <form onSubmit={handleAddLocation} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ex: IST Building"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">
                  Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ex: 120"
                  min={0}
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
                  disabled={
                    isCreating || !name.trim() || !capacity.trim()
                  }
                >
                  {isCreating ? "Adding..." : "Add Location"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
