"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllEvents,
  useDeleteEvent,
  useUpdateEvent,
} from "@/common/api/event/hook";
import { EventEntityResponse } from "@/common/api/event/entity";

export default function EventsPage() {
  const { data: events = [], isLoading, refetch } = useAllEvents();
  const deleteEventMutation = useDeleteEvent();
  const updateEventMutation = useUpdateEvent();

  // Define columns - all static (not editable)
  const columns: DataTableColumn<EventEntityResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: (value, row) => row.location?.name || "N/A",
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: (value) => {
        const date = new Date(value as number);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const time = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${dayOfWeek}, ${time}`;
      },
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: (value) => {
        const date = new Date(value as number);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const time = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${dayOfWeek}, ${time}`;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
  ];

  const handleSave = async (data: EventEntityResponse[]) => {
    // Since columns are static, this won't be used much
    // But we can implement it for future editable columns
    console.log("Save called with data:", data);
    // If you need to save updates, you would call updateEventMutation here
  };

  const handleDelete = async (ids: Array<string | number>) => {
    // Delete all selected events
    await Promise.all(
      ids.map((id) => deleteEventMutation.mutateAsync(String(id))),
    );
    // Refresh the list after deletion
    await refetch();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading events...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
      </header>
      <DataTable
        data={events}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );
}
