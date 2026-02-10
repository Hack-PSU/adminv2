"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllEvents,
  useDeleteEvent,
  useUpdateEvent,
} from "@/common/api/event/hook";
import { EventEntityResponse } from "@/common/api/event/entity";
import { Pencil, Trash2, Plus } from "lucide-react";
import { EventType } from "@/common/api/event/entity";
import { useAllLocations } from "@/common/api/location/hook";
import { Button } from "@/components/ui/button";

interface EventFormData {
  name: string;
  type: EventType | "";
  description: string;
  locationId: string;
  startTime: string;
  endTime: string;
  wsPresenterNames: string;
  wsSkillLevel: string;
  wsRelevantSkills: string;
  wsUrls: string[];
  icon: File | null;
}

export default function EventsPage() {
  const router = useRouter();
  const { data: events = [], isLoading, refetch } = useAllEvents();
  const { data: locations = [] } = useAllLocations();
  const deleteEventMutation = useDeleteEvent();
  const updateEventMutation = useUpdateEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventEntityResponse | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    type: "",
    description: "",
    locationId: "",
    startTime: "",
    endTime: "",
    wsPresenterNames: "",
    wsSkillLevel: "",
    wsRelevantSkills: "",
    wsUrls: [],
    icon: null,
  });

  const openEditModal = (event: EventEntityResponse) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      type: event.type as EventType,
      description: event.description || "",
      locationId: event.locationId ? String(event.locationId) : "",
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16),
      wsPresenterNames: event.wsPresenterNames || "",
      wsSkillLevel: event.wsSkillLevel || "",
      wsRelevantSkills: event.wsRelevantSkills || "",
      wsUrls: event.wsUrls || [],
      icon: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("type", formData.type);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("locationId", formData.locationId);
    formDataToSubmit.append("startTime", new Date(formData.startTime).getTime().toString());
    formDataToSubmit.append("endTime", new Date(formData.endTime).getTime().toString());
    
    if (formData.type === EventType.workshop) {
      formDataToSubmit.append("wsPresenterNames", formData.wsPresenterNames);
      formDataToSubmit.append("wsSkillLevel", formData.wsSkillLevel);
      formDataToSubmit.append("wsRelevantSkills", formData.wsRelevantSkills);
      formData.wsUrls.forEach((url) => {
        formDataToSubmit.append("wsUrls[]", url);
      });
    }
    
    if (formData.icon) {
      formDataToSubmit.append("icon", formData.icon);
    }

    try {
      if (editingEvent) {
        await updateEventMutation.mutateAsync({ id: editingEvent.id, data: formDataToSubmit });
      }
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEventMutation.mutateAsync(id);
      await refetch();
    }
  };

  const handleAddEvent = () => {
    router.push("/events/create");
  };

  const handleRefresh = async () => {
    await refetch();
  };

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
    {
      accessorKey: "id",
      header: "Actions",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit event"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteSingle(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
            <p className="text-sm text-zinc-500">Manage HackPSU Events</p>
          </div>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </button>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading events...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Events</h1>
        </div>
        <Button         onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Event
        </Button>
      </header>
      
      <DataTable
        data={events}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
        enableRowSelection={false}
      />

      {/* Edit Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Event</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Event Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value={EventType.activity}>Activity</option>
                  <option value={EventType.food}>Food</option>
                  <option value={EventType.workshop}>Workshop</option>
                  <option value={EventType.checkIn}>Check-In</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Location
                </label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select location...</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {formData.type === EventType.workshop && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Presenter Names
                    </label>
                    <input
                      type="text"
                      value={formData.wsPresenterNames}
                      onChange={(e) => setFormData({ ...formData, wsPresenterNames: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Skill Level
                    </label>
                    <select
                      value={formData.wsSkillLevel}
                      onChange={(e) => setFormData({ ...formData, wsSkillLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select level...</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Relevant Skills
                    </label>
                    <input
                      type="text"
                      value={formData.wsRelevantSkills}
                      onChange={(e) => setFormData({ ...formData, wsRelevantSkills: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., JavaScript, React, API"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Event Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, icon: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateEventMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updateEventMutation.isPending ? "Saving..." : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
