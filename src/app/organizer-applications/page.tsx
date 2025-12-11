"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllApplications,
	useApplicationsByTeam,
	useApplication,
  useSubmitApplication,
  useAcceptApplication,
  useRejectApplication,
} from "@/common/api/organizer_applications/hook";
import { OrganizerApplicationEntity } from "@/common/api/organizer_applications/entity";

export default function OrganizerApplicationsPage() {
  const {data: applications = [], isLoading, refetch } = useAllApplications();
  // I don't think we need mutations here for now, if we're simply just pasting the data onto the table
  const acceptApplicationMutation = useAcceptApplication();
  const rejectApplicationMutation = useRejectApplication();

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
    }

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
    </section>
  );
}
