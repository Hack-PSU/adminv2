"use client";

import { useMemo } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import { useEventsAnalytics } from "@/common/api/analytics/hook";
import { AnalyticsEventsResponse } from "@/common/api/analytics/entity";

const EVENT_TYPE_LABELS: Record<string, string> = {
  checkIn: "Check-In",
  activity: "Activity",
  workshop: "Workshop",
  food: "Food",
};

function formatEventType(value: string) {
  return EVENT_TYPE_LABELS[value] ?? value;
}

export default function AnalyticsEventsPage() {
  const { data = [], isLoading, isError, refetch } = useEventsAnalytics();

  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data],
  );

  const columns: DataTableColumn<AnalyticsEventsResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (value) => formatEventType(String(value)),
    },
    {
      accessorKey: "count",
      header: "Scans",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        Loading event analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        Unable to load event analytics. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">Events</h2>
        <p className="text-sm text-zinc-500">
          Track scan volume across scheduled sessions and activities.
        </p>
      </div>
      <DataTable
        data={sortedData}
        columns={columns}
        onRefresh={async () => refetch()}
        idField="id"
        enableRowSelection={false}
      />
    </div>
  );
}
