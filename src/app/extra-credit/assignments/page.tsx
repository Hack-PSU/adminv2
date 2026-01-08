"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllExtraCreditAssignments,
} from "@/common/api/extra-credit/hook";
import { ECClassResponse } from "@/common/api/extra-credit/entity";
import { useMemo } from "react";

// Extended entity with hacker count
interface ExtraCreditAssignmentWithMeta extends ECClassResponse {
  hackers: number;
}

export default function ManageAssignmentsPage() {
  const { data: assignments = [], isLoading: assignmentsLoading, refetch } = useAllExtraCreditAssignments();

  // Add hacker count to each assignment
  const assignmentsWithMeta = useMemo<ExtraCreditAssignmentWithMeta[]>(() => {
    return assignments.map((assignment) => {
      return {
        ...assignment,
        hackers: assignment?.users?.length || 0,
      };
    });
  }, [assignments]);

  const columns: DataTableColumn<ExtraCreditAssignmentWithMeta>[] = [
    { accessorKey: "name", header: "Class" },
    { accessorKey: "hackers", header: "Hackers" },
  ];

  const handleRefresh = async () => {
    await refetch();
  };

  const isLoading = assignmentsLoading;

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading assignments...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <DataTable
        data={assignmentsWithMeta}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );
}