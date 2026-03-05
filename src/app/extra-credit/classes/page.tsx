"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  useAllExtraCreditClasses,
  useAllExtraCreditAssignments,
  useCreateExtraCreditClass,
  useDeleteExtraCreditClass,

} from "@/common/api/extra-credit/hook";
import { ExtraCreditClassEntity } from "@/common/api/extra-credit/entity";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { getExtraCreditClassList } from "@/common/api/extra-credit/provider";

// Extended entity with hacker count
interface ExtraCreditClassWithCount extends ExtraCreditClassEntity {
  hackers: number;
}

export default function ManageClassesPage() {
  const { data: classes = [], isLoading: classesLoading, refetch } = useAllExtraCreditClasses();
  const { data: assignments = [], isLoading: assignmentsLoading } = useAllExtraCreditAssignments();
  const createClassMutation = useCreateExtraCreditClass();
  const deleteClassMutation = useDeleteExtraCreditClass();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const isCreating = createClassMutation.isPending;

  const closeModal = () => {
    setShowAddModal(false);
    setNewClassName("");
  };

  // Calculate hacker count for each class
  const classesWithCount = useMemo<ExtraCreditClassWithCount[]>(() => {
    return classes.map((classItem) => {
      // Find the matching assignment by class id
      const matchingAssignment = assignments.find((assignment) => assignment.id === classItem.id);
      return {
        ...classItem,
        hackers: matchingAssignment?.users?.length || 0,
      };
    });
  }, [classes, assignments]);

  const handleExport = async (classId: number) => {
    try {
      const data = await getExtraCreditClassList(classId);

      const names: string[] = data?.names ?? [];

      // CSV content (escape quotes just in case)
      const csvLines = ["Name", ...names.map((n) => `"${String(n).replaceAll('"', '""')}"`)];
      const csv = csvLines.join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `class-${classId}-students.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      toast.success(`Exported ${names.length} student(s).`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export class list.");
    }
  };

  const columns: DataTableColumn<ExtraCreditClassWithCount>[] = [
    { accessorKey: "name", header: "Class Name" },
    { accessorKey: "hackers", header: "Hackers" },
    {
      accessorKey: "actions" as any,
      header: "Actions",
      cell: (_value, row) => (
      <Button onClick={() => handleExport(row.id)} variant="outline">
        Export
      </Button>
  ),
    },
  ];

  const handleAddClass = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = newClassName.trim();
    if (!trimmedName) return;
    try {
      await createClassMutation.mutateAsync({ name: trimmedName });
      toast.success("Class added.");
      closeModal();
      await refetch();
    } catch (error) {
      toast.error("Unable to add class.");
    }
  };

  const handleDelete = async (ids: Array<string | number>) => {
    try {
      await Promise.all(
        ids.map((id) => deleteClassMutation.mutateAsync(Number(id))),
      );
      toast.success("Classes deleted.");
    } catch (error) {
      toast.error("Unable to delete classes.");
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const isLoading = classesLoading || assignmentsLoading;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1" />
        <Button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Class
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading classes...</div>
        </div>
      ) : (
        <DataTable
          data={classesWithCount}
          columns={columns}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          idField="id"
        />
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Add Class
                </h2>
                <p className="text-sm text-zinc-500">
                  Create a new extra credit class.
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
            <form onSubmit={handleAddClass} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800">
                  Class Name
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(event) => setNewClassName(event.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
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
                  disabled={isCreating || !newClassName.trim()}
                >
                  {isCreating ? "Adding..." : "Add Class"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
