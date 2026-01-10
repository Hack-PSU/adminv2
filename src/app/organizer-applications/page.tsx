"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllApplications,
  useAcceptApplication,
  useRejectApplication,
} from "@/common/api/organizer_applications";
import { useState } from "react";
import { Eye } from "lucide-react";
import { OrganizerApplicationEntity, OrganizerTeam } from "@/common/api/organizer_applications";
import ViewApplicationModal from "@/components/modal/ViewApplicationModal";

export default function OrganizerApplicationsPage() {
  const {data: applications = [], isLoading, refetch } = useAllApplications();
  // I don't think we need mutations here for now, if we're simply just pasting the data onto the table
  const acceptApplicationMutation = useAcceptApplication();
  const rejectApplicationMutation = useRejectApplication();
  const [selectedApplication, setSelectedApplication] = useState<OrganizerApplicationEntity | null>(null);

  // Define columns - all static (not editable)
  const columns: DataTableColumn<OrganizerApplicationEntity>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    { 
      accessorKey: "yearStanding",
      header: "Year Standing",
    },
    { 
      accessorKey: "major",
      header: "Major",
    },
    {
      accessorKey: "firstChoiceTeam",
      header: "First Choice Team",
    },
    {
      accessorKey: "firstChoiceStatus",
      header: "First Choice Status",
    },
    {
      accessorKey: "secondChoiceTeam",
      header: "Second Choice Team",
    },
    {
      accessorKey: "secondChoiceStatus",
      header: "Second Choice Status",
    },
    {
      accessorKey: "assignedTeam",
      header: "Assigned Team",
    },
    {
      accessorKey: "createdAt",
      header: "Applied On",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (_, row) => (
        <button
          onClick={() => setSelectedApplication(row)}
          className="text-zinc-600 hover:text-zinc-900"
          aria-label="View application"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const handleRefresh = async () => {
      await refetch();
    };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Organizer Applications
          </h1>
        </header>
        <p>Loading applications...</p>
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Organizer Applications
        </h1>
        <p className="text-sm text-zinc-500">
          Review, approve, or reject organizer applicants and coordinate
          onboarding tasks.
        </p>
      </header>
      <DataTable<OrganizerApplicationEntity>
        data={applications}
        columns={columns}
        onRefresh={handleRefresh}
        idField ="id"
      />
      <ViewApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onAccept={async (id, team: OrganizerTeam) => {
          await acceptApplicationMutation.mutateAsync({
            id,
            data: { team },
          });
          await refetch();
          setSelectedApplication(null);
        }}
        onReject={async (id, team: OrganizerTeam) => {
          await rejectApplicationMutation.mutateAsync({
            id,
            data: { team },
          });
          await refetch();
          setSelectedApplication(null);
        }}
      />
    </section>
  );
}