"use client";

import { AnalyticsScansResponse, useOrganizerScans } from "@/common/api/analytics";
import { DataTableColumn, DataTable } from "@/components/table";

export default function OrganizerPage() {
  const { data: organizers = [], isLoading, refetch } = useOrganizerScans();

  // Define the columns for organizers
  const columns: DataTableColumn<AnalyticsScansResponse>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: (value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      accessorKey: "count",
      header: "Scans"
    }
  ];

  // Handle the refresh button
  const handleRefresh = async () => {
    await refetch;
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Organizers</h1>
          <p className="text-sm text-zinc-500">
            Monitor the total scans performed by each organizer during the event.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <DataTable
        data={organizers}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );

}