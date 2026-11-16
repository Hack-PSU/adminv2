"use client";

import { useState } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface Challenge {
  id: string;
  name: string;
  description: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

interface IChallengeFormInput {
  name: string;
  description: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

const emptyForm: IChallengeFormInput = {
  name: "",
  description: "",
  firstPrize: "",
  secondPrize: "",
  thirdPrize: "",
};

const inputClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<IChallengeFormInput>({
    defaultValues: emptyForm,
  });
  const name = watch("name");

  const openAddModal = () => {
    setEditingChallenge(null);
    reset(emptyForm);
    setIsFormOpen(true);
  };

  const openEditModal = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    reset({
      name: challenge.name,
      description: challenge.description,
      firstPrize: challenge.firstPrize,
      secondPrize: challenge.secondPrize,
      thirdPrize: challenge.thirdPrize,
    });
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingChallenge(null);
    reset(emptyForm);
  };

  const onSubmit = (data: IChallengeFormInput) => {
    if (!data.name.trim()) return;

    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      firstPrize: data.firstPrize.trim(),
      secondPrize: data.secondPrize.trim(),
      thirdPrize: data.thirdPrize.trim(),
    };

    if (editingChallenge) {
      setChallenges((prev) =>
        prev.map((c) => (c.id === editingChallenge.id ? { ...c, ...payload } : c)),
      );
    } else {
      setChallenges((prev) => [...prev, { ...payload, id: crypto.randomUUID() }]);
    }
    closeFormModal();
  };

  const confirmDelete = () => {
    if (!deletingChallenge) return;
    setChallenges((prev) => prev.filter((c) => c.id !== deletingChallenge.id));
    setDeletingChallenge(null);
  };

  const columns: DataTableColumn<Challenge>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "description",
      header: "Description",
      cell: (value) =>
        value ? (
          <span className="block max-w-xs truncate" title={value}>
            {value}
          </span>
        ) : (
          "N/A"
        ),
    },
    { accessorKey: "firstPrize", header: "1st Prize", cell: (value) => value || "N/A" },
    { accessorKey: "secondPrize", header: "2nd Prize", cell: (value) => value || "N/A" },
    { accessorKey: "thirdPrize", header: "3rd Prize", cell: (value) => value || "N/A" },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit challenge"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingChallenge(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete challenge"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Challenges</h1>
        <Button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Challenge
        </Button>
      </header>

      <DataTable
        data={challenges}
        columns={columns}
        onRefresh={async () => {
              }}
        idField="id"
        enableRowSelection={false}
      />

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl space-y-4 rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {editingChallenge ? "Edit Challenge" : "Add Challenge"}
                </h2>
                <p className="text-sm text-zinc-500">
                  {editingChallenge ? "Update challenge details." : "Create a new challenge/track."}
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={closeFormModal} className="px-2 py-1">
                Close
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div className="w-full space-y-1">
                <label className="text-sm font-medium text-zinc-800">Name</label>
                <input
                  className={inputClass}
                  placeholder="Challenge Name"
                  maxLength={255}
                  {...register("name", { required: true })}
                />
              </div>

              <div className="w-full space-y-1">
                <label className="text-sm font-medium text-zinc-800">Description</label>
                <textarea
                  className={`${inputClass} min-h-32`}
                  placeholder="Describe the challenge"
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">1st Place Prize</label>
                  <input className={inputClass} maxLength={255} {...register("firstPrize")} />
                </div>
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">2nd Place Prize</label>
                  <input className={inputClass} maxLength={255} {...register("secondPrize")} />
                </div>
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">3rd Place Prize</label>
                  <input className={inputClass} maxLength={255} {...register("thirdPrize")} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeFormModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name?.trim()}>
                  {editingChallenge ? "Save Changes" : "Add Challenge"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Delete Challenge</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{deletingChallenge.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDeletingChallenge(null)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}