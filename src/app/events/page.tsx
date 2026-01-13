"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllEvents,
  useDeleteEvent,
  useUpdateEvent,
} from "@/common/api/event/hook";
import { EventEntityResponse } from "@/common/api/event/entity";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
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
<<<<<<< HEAD
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
=======
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
            <p className="text-sm text-zinc-500">
              Create HackPSU Events
            </p>
          </div>
          <button
            onClick={() => router.push("/events/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Event
          </button>
>>>>>>> 986d64a (add event button)
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading events...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
<<<<<<< HEAD
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
=======
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
          <p className="text-sm text-zinc-500">
            Create HackPSU Events
          </p>
        </div>
        <button
          onClick={() => router.push("/events/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Event
        </button>
>>>>>>> 986d64a (add event button)
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
