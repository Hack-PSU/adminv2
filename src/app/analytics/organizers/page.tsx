"use client";

import { useMemo } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import { useOrganizerScans } from "@/common/api/analytics/hook";

type OrganizerScanRow = {
  id: string;
  name: string;
  count: number;
};

export default function AnalyticsOrganizersPage() {
  const { data = [], isLoading, isError, refetch } = useOrganizerScans();

  const rows = useMemo<OrganizerScanRow[]>(
    () =>
      data
        .map((entry) => ({
          id: entry.id,
          name: `${entry.firstName} ${entry.lastName}`,
          count: entry.count,
        }))
        .sort((a, b) => b.count - a.count),
    [data],
  );

  const columns: DataTableColumn<OrganizerScanRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "count",
      header: "Scans",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        Loading organizer analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        Unable to load organizer analytics. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">Organizers</h2>
        <p className="text-sm text-zinc-500">
          See which organizers are scanning attendees the most.
        </p>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        onRefresh={async () => refetch()}
        idField="id"
        enableRowSelection={false}
      />
    </div>
  );
}
