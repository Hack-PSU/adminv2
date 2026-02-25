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
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import Dropzone from "@/components/ui/dropzone";

enum SponsorLevels {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
  EMERALD = "emerald",
}

enum SponsorTypes {
  SPONSOR = "sponsor",
  PARTNER = "partner",
}

interface SponsorOption {
  value: SponsorLevels;
  label: string;
}

interface SponsorTypeOption {
  value: SponsorTypes;
  label: string;
}

const SponsorLevelOptions: SponsorOption[] = [
  { value: SponsorLevels.BRONZE, label: "Bronze" },
  { value: SponsorLevels.SILVER, label: "Silver" },
  { value: SponsorLevels.GOLD, label: "Gold" },
  { value: SponsorLevels.PLATINUM, label: "Platinum" },
  { value: SponsorLevels.EMERALD, label: "Emerald" },
];

const SponsorTypeOptions: SponsorTypeOption[] = [
  { value: SponsorTypes.SPONSOR, label: "Sponsor" },
  { value: SponsorTypes.PARTNER, label: "Event Partner" },
];
export default function SponsorshipPage() {
  const { data: sponsors = [], isLoading, refetch } = useAllSponsors();
  const deleteSponsorMutation = useDeleteSponsor();
  const updateSponsorMutation = useUpdateSponsor();

  // Modal specific
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<SponsorEntity | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState<SponsorEntity | null>(null);

  interface IEditFormInput {
    name: string;
    level: SponsorOption;
    sponsorType: SponsorTypeOption;
    website: string;
    lightLogo: File | null;
    darkLogo: File | null;
  }

  const methods = useForm<IEditFormInput>({
    defaultValues: {
      name: "",
      level: { value: SponsorLevels.GOLD, label: "Gold" },
      sponsorType: { value: SponsorTypes.SPONSOR, label: "Sponsor" },
      website: "",
      lightLogo: null,
      darkLogo: null,
    },
  });

  const { register, control, watch, handleSubmit, reset } = methods;

  const openEditModal = (sponsor: SponsorEntity) => {
    setEditingSponsor(sponsor);
    const levelOption = SponsorLevelOptions.find(
      (opt) => opt.value === sponsor.level
    ) || { value: SponsorLevels.GOLD, label: "Gold" };
    const typeOption = SponsorTypeOptions.find(
      (opt) => opt.value === sponsor.sponsorType
    ) || { value: SponsorTypes.SPONSOR, label: "Sponsor" };

    reset({
      name: sponsor.name,
      level: levelOption,
      sponsorType: typeOption,
      website: sponsor.link || "",
      lightLogo: null,
      darkLogo: null,
    });
  };

  const closeEditModal = () => {
    setEditingSponsor(null);
    reset();
  };

  const name = watch("name");
  const website = watch("website");
  const lightLogo = watch("lightLogo");
  const darkLogo = watch("darkLogo");

  const handleEditSubmit = async (data: IEditFormInput) => {
    if (!editingSponsor) return;
    if (!name.trim() || !website.trim() || (!lightLogo && !darkLogo)) return;

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("level", data.level.value);
    formData.append("sponsorType", data.sponsorType.value);
    formData.append("link", data.website);
    if (data.lightLogo) formData.append("lightLogo", data.lightLogo);
    if (data.darkLogo) formData.append("darkLogo", data.darkLogo);

    try {
      await updateSponsorMutation.mutateAsync({
        id: editingSponsor.id,
        data: formData as any,
      });
      closeEditModal();
      await refetch();
    } catch (error) {
      console.error("Error updating sponsor:", error);
    }
  };

  const handleDeleteSingle = (sponsor: SponsorEntity) => {
    setDeletingSponsor(sponsor);
  };

  const confirmDelete = async () => {
    if (!deletingSponsor) return;
    try {
      await deleteSponsorMutation.mutateAsync(deletingSponsor.id);
      setDeletingSponsor(null);
      await refetch();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
    }
  };

  const cancelDelete = () => {
    setDeletingSponsor(null);
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
            onClick={() => handleDeleteSingle(row)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl space-y-4 rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Edit Sponsor
                </h2>
                <p className="text-sm text-zinc-500">
                  Update sponsor details.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={closeEditModal}
                className="px-2 py-1"
              >
                Close
              </Button>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleEditSubmit)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 items-center sm:justify-between sm:flex-row">
                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Name</label>
                    <input
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter sponsor's name"
                      {...register("name")}
                    />
                  </div>

                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Level</label>
                    <Controller
                      name="level"
                      control={control}
                      render={({ field }) => (
                        <Select
                          className="text-sm"
                          {...field}
                          options={SponsorLevelOptions}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">Sponsor Type</label>
                  <Controller
                    name="sponsorType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        className="text-sm"
                        {...field}
                        options={SponsorTypeOptions}
                      />
                    )}
                  />
                </div>
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">Website</label>
                  <input
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter website name"
                    {...register("website")}
                  />
                </div>
                <div className="flex flex-col gap-3 items-center sm:justify-between sm:flex-row">
                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Light Logo</label>
                    <Dropzone
                      name="lightLogo"
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (!darkLogo && !value) {
                            return false;
                          }
                          return true;
                        },
                      }}
                    />
                  </div>

                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Dark Logo</label>
                    <Dropzone
                      name="darkLogo"
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (!lightLogo && !value) {
                            return false;
                          }
                          return true;
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      updateSponsorMutation.isPending ||
                      !name.trim() ||
                      !website.trim() ||
                      (!lightLogo && !darkLogo)
                    }
                  >
                    {updateSponsorMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}

      {showAddModal && (<AddNewSponsorModal totalSponsors={sponsors.length} closeModal={closeModal}/>)}

      {/* Delete Confirmation Modal */}
      {deletingSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Delete Sponsor
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Are you sure you want to delete <span className="font-medium">{deletingSponsor.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelDelete}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteSponsorMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteSponsorMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
