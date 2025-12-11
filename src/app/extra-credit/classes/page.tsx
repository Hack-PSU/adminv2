"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllExtraCreditClasses,
  useAllExtraCreditAssignments,
  useDeleteExtraCreditClass,
  useUpdateExtraCreditClass,
} from "@/common/api/extra-credit/hook";
import { ExtraCreditClassEntity } from "@/common/api/extra-credit/entity";
import { useMemo } from "react";
import { toast } from "sonner";

// Extended entity with hacker count
interface ExtraCreditClassWithCount extends ExtraCreditClassEntity {
  hackers: number;
}

export default function ManageClassesPage() {
  const { data: classes = [], isLoading: classesLoading, refetch } = useAllExtraCreditClasses();
  const { data: assignments = [], isLoading: assignmentsLoading } = useAllExtraCreditAssignments();
  const deleteClassMutation = useDeleteExtraCreditClass();
  const updateClassMutation = useUpdateExtraCreditClass();

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

  const columns: DataTableColumn<ExtraCreditClassWithCount>[] = [
    { accessorKey: "name", header: "Class Name" },
    { accessorKey: "hackers", header: "Hackers" },
  ];

  const handleRefresh = async () => {
    await refetch();
  };

  const isLoading = classesLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading classes...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <DataTable
        data={classesWithCount}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );
}