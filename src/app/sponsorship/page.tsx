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
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddNewSponsorModal from "@/components/modal/AddNewSponsorModal";

export default function SponsorshipPage() {
  const { data: sponsors = [], isLoading, refetch } = useAllSponsors();
  const deleteSponsorMutation = useDeleteSponsor();
  const updateSponsorMutation = useUpdateSponsor();

  // Modal specific
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<SponsorEntity | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    level: "",
    sponsorType: "",
    link: "",
  });

  const openEditModal = (sponsor: SponsorEntity) => {
    setEditingSponsor(sponsor);
    setEditFormData({
      name: sponsor.name,
      level: sponsor.level,
      sponsorType: sponsor.sponsorType || "",
      link: sponsor.link || "",
    });
  };

  const closeEditModal = () => {
    setEditingSponsor(null);
    setEditFormData({
      name: "",
      level: "",
      sponsorType: "",
      link: "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor) return;

    try {
      await updateSponsorMutation.mutateAsync({
        id: editingSponsor.id,
        data: editFormData,
      });
      closeEditModal();
      await refetch();
    } catch (error) {
      console.error("Error updating sponsor:", error);
    }
  };

  const handleDeleteSingle = async (id: number) => {
    if (confirm("Are you sure you want to delete this sponsor?")) {
      await deleteSponsorMutation.mutateAsync(id);
      await refetch();
    }
  };

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
      accessorKey: "sponsorType",
      header: "Type",
      cell: (value) => value || "N/A",
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
    {
      accessorKey: "id",
      header: "Actions",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit sponsor"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteSingle(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete sponsor"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleRefresh = async () => {
    await refetch();
  };

  // Modal specific function
  const closeModal = () => { setShowAddModal(false); };

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
        <Button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
            Add Sponsor
          </Button>
      </header>

      <DataTable
        data={sponsors}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
        enableRowSelection={false}
      />

      {/* Edit Modal */}
      {editingSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Sponsor</h2>
              <button
                onClick={closeEditModal}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Sponsor Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Level
                </label>
                <input
                  type="text"
                  value={editFormData.level}
                  onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={editFormData.sponsorType}
                  onChange={(e) => setEditFormData({ ...editFormData, sponsorType: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={editFormData.link}
                  onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  disabled={updateSponsorMutation.isPending}
                >
                  {updateSponsorMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (<AddNewSponsorModal totalSponsors={sponsors.length} closeModal={closeModal}/>)}
    </section>
  );
}
