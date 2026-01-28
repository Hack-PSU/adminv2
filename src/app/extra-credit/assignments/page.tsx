"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllExtraCreditAssignments,
} from "@/common/api/extra-credit/hook";
import { useMemo } from "react";

// Flattened assignment showing each hacker with their assigned class
interface HackerAssignment {
  hackerId: string;
  hackerName: string;
  classId: number;
  className: string;
}

export default function ManageAssignmentsPage() {
  const { data: assignments = [], isLoading: assignmentsLoading, refetch } = useAllExtraCreditAssignments();

  // Flatten the data: each row is a hacker with their assigned class
  const hackerAssignments = useMemo<HackerAssignment[]>(() => {
    const flattened: HackerAssignment[] = [];
    
    assignments.forEach((classData) => {
      classData.users.forEach((user) => {
        flattened.push({
          hackerId: user.id,
          hackerName: `${user.firstName} ${user.lastName}`,
          classId: classData.id,
          className: classData.name,
        });
      });
    });
    
    return flattened;
  }, [assignments]);

  const columns: DataTableColumn<HackerAssignment>[] = [
    { accessorKey: "hackerName", header: "Hacker" },
    { accessorKey: "className", header: "Assigned Class" },
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
        data={hackerAssignments}
        columns={columns}
        onRefresh={handleRefresh}
        idField="hackerId"
      />
    </section>
  );
}