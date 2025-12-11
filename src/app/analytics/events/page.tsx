"use client";
import React from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import { useEventsAnalytics } from "@/common/api/analytics/hook";
import type { AnalyticsEventsResponse } from "@/common/api/analytics/entity";

export default function AnalyticsEventsPage() {
  const { data: events = [] } = useEventsAnalytics();
  const columns: DataTableColumn<AnalyticsEventsResponse>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "count", header: "Scans" },
  ];

  return (
    <section className="space-y-4">
      <DataTable data={events} columns={columns} />
    </section>
  );
}