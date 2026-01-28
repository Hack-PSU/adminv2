"use client";
import { useState } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllSponsors,
  useDeleteSponsor,
  useUpdateSponsor,
} from "@/common/api/sponsor/hook";
import { SponsorEntity } from "@/common/api/sponsor/entity";
import { Button } from "@/components/ui/button";
import AddNewSponsorModal from "@/components/modal/AddNewSponsorModal";

export default function SponsorshipPage() {
  const { data: sponsors = [], isLoading, refetch } = useAllSponsors();
  const deleteSponsorMutation = useDeleteSponsor();
  const updateSponsorMutation = useUpdateSponsor();

  // Modal specific
  const [showAddModal, setShowAddModal] = useState(false);

  // Define columns - all static (not editable)
  const columns: DataTableColumn<SponsorEntity>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "link",
      header: "Website",
      cell: (value, row) => value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      ) : (
        "N/A"
      ),
    },
  ];

  const handleSave = async (data: SponsorEntity[]) => {
    // Since columns are static, this won't be used much
    // But we can implement it for future editable columns
    console.log("Save called with data:", data);
    // If you need to save updates, you would call updateSponsorMutation here
  };

  const handleDelete = async (ids: Array<string | number>) => {
    // Delete all selected sponsors
    await Promise.all(
      ids.map((id) => deleteSponsorMutation.mutateAsync(Number(id))),
    );
    // Refresh the list after deletion
    await refetch();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Modal specific function
  const closeModal = () => { setShowAddModal(false); };

  const handleAddSponsorship = async (data: FormData) => {

  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Sponsorship</h1>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading sponsors...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Sponsorship</h1>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">Add Sponsor</Button>
      </header>

      <DataTable
        data={sponsors}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        idField="id"
      />

      {showAddModal && (<AddNewSponsorModal closeModal={closeModal}/>)}
    </section>
  );
}
