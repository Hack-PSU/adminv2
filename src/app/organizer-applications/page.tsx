"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllApplications,
  useAcceptApplication,
  useRejectApplication,
} from "@/common/api/organizer_applications";
import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { OrganizerApplicationEntity, OrganizerTeam, ApplicationStatus } from "@/common/api/organizer_applications";
import ViewApplicationModal from "@/components/modal/ViewApplicationModal";

export default function OrganizerApplicationsPage() {
  const {data: applications = [], isLoading, refetch } = useAllApplications();
  const acceptApplicationMutation = useAcceptApplication();
  const rejectApplicationMutation = useRejectApplication();
  const [selectedApplication, setSelectedApplication] = useState<OrganizerApplicationEntity | null>(null);
  const [rejectModalData, setRejectModalData] = useState<{
    id: number;
    team: OrganizerTeam;
    name: string;
  } | null>(null);

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
      cell: (_, row) => {
        const canAcceptFirst =
          row.firstChoiceStatus === ApplicationStatus.PENDING &&
          !row.assignedTeam;

        const canAcceptSecond =
          row.firstChoiceStatus === ApplicationStatus.REJECTED &&
          row.secondChoiceStatus === ApplicationStatus.PENDING &&
          !row.assignedTeam;

        const firstChoiceTeam = row.firstChoiceTeam as OrganizerTeam;
        const secondChoiceTeam = row.secondChoiceTeam as OrganizerTeam;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedApplication(row)}
              className="p-1 text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
              title="View application"
            >
              <Eye className="h-4 w-4" />
            </button>
            
            {canAcceptFirst && (
              <>
                <button
                  onClick={async () => {
                    await acceptApplicationMutation.mutateAsync({
                      id: row.id,
                      data: { team: firstChoiceTeam },
                    });
                    await refetch();
                  }}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Accept (1st Choice)"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setRejectModalData({
                      id: row.id,
                      team: firstChoiceTeam,
                      name: row.name,
                    })
                  }
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Reject (1st Choice)"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}

            {canAcceptSecond && (
              <>
                <button
                  onClick={async () => {
                    await acceptApplicationMutation.mutateAsync({
                      id: row.id,
                      data: { team: secondChoiceTeam },
                    });
                    await refetch();
                  }}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Accept (2nd Choice)"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setRejectModalData({
                      id: row.id,
                      team: secondChoiceTeam,
                      name: row.name,
                    })
                  }
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Reject (2nd Choice)"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        );
      },
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
        idField="id"
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

      {/* Reject Confirmation Modal */}
      {rejectModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Rejection</h2>
            <p className="text-zinc-700 mb-6">
              Are you sure you want to reject this application for{" "}
              <span className="font-semibold">{rejectModalData.team}</span>?
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              Applicant: <span className="font-medium">{rejectModalData.name}</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await rejectApplicationMutation.mutateAsync({
                    id: rejectModalData.id,
                    data: { team: rejectModalData.team },
                  });
                  await refetch();
                  setRejectModalData(null);
                }}
                disabled={rejectApplicationMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {rejectApplicationMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}