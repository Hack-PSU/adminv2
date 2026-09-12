"use client";

import {
  ApplicationStatus,
  OrganizerApplicationEntity,
  OrganizerTeam,
  useHackathonGetAll,
  useOrganizerApplicationAccept,
  useOrganizerApplicationGetAll,
  useOrganizerApplicationReject,
} from "@hackpsu/react-sdk";
import { DataTable, DataTableColumn } from "@/components/table";
import { useMemo, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import ViewApplicationModal from "@/components/modal/ViewApplicationModal";

// Hackathon start/end times can be stored in seconds or milliseconds; normalize to ms.
function normalizeTimestamp(value: number | string | null | undefined) {
  if (value == null) return null;
  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) return null;
  return numeric < 1e12 ? numeric * 1000 : numeric;
}

function statusColorClass(status: ApplicationStatus) {
  if (status === ApplicationStatus.accepted) return "text-green-600";
  if (status === ApplicationStatus.rejected) return "text-red-600";
  return "text-zinc-900";
}

export default function OrganizerApplicationsPage() {
  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useOrganizerApplicationGetAll();
  const { data: hackathons = [] } = useHackathonGetAll();
  const acceptApplicationMutation = useOrganizerApplicationAccept();
  const rejectApplicationMutation = useOrganizerApplicationReject();

  const lastHackathonEndTime = useMemo(() => {
    // The active hackathon is the upcoming/current one; the "last" hackathon
    // is the most recent one that has already concluded.
    const endedHackathons = hackathons
      .filter((h) => !h.active)
      .map((h) => normalizeTimestamp(h.endTime))
      .filter((end): end is number => end !== null);
    if (endedHackathons.length === 0) return null;
    return Math.max(...endedHackathons);
  }, [hackathons]);

  const visibleApplications = useMemo(() => {
    if (lastHackathonEndTime === null) return applications;
    return applications.filter(
      (app) =>
        app.createdAt != null &&
        new Date(app.createdAt).getTime() > lastHackathonEndTime,
    );
  }, [applications, lastHackathonEndTime]);
  const [selectedApplication, setSelectedApplication] = useState<OrganizerApplicationEntity | null>(null);
  const [acceptModalData, setAcceptModalData] = useState<{
    id: number;
    team: OrganizerTeam;
    name: string;
  } | null>(null);
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
      header: "First Choice",
      cell: (_, row) => (
        <span className={statusColorClass(row.firstChoiceStatus ?? ApplicationStatus.pending)}>
          {row.firstChoiceTeam}
        </span>
      ),
    },
    {
      accessorKey: "secondChoiceTeam",
      header: "Second Choice",
      cell: (_, row) => (
        <span className={statusColorClass(row.secondChoiceStatus ?? ApplicationStatus.pending)}>
          {row.secondChoiceTeam}
        </span>
      ),
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
          row.firstChoiceStatus === ApplicationStatus.pending &&
          !row.assignedTeam;

        const canAcceptSecond =
          row.firstChoiceStatus === ApplicationStatus.rejected &&
          row.secondChoiceStatus === ApplicationStatus.pending &&
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
                  onClick={() =>
                    setAcceptModalData({
                      id: row.id,
                      team: firstChoiceTeam,
                      name: row.name,
                    })
                  }
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
                  onClick={() =>
                    setAcceptModalData({
                      id: row.id,
                      team: secondChoiceTeam,
                      name: row.name,
                    })
                  }
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
      </header>
      <DataTable<OrganizerApplicationEntity>
        data={visibleApplications}
        columns={columns}
        onRefresh={handleRefresh}
        idField="id"
        enableFilters={true}
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

      {/* Accept Confirmation Modal */}
      {acceptModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Acceptance</h2>
            <p className="text-zinc-700 mb-6">
              Are you sure you want to accept this application for{" "}
              <span className="font-semibold">{acceptModalData.team}</span>?
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              Applicant: <span className="font-medium">{acceptModalData.name}</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAcceptModalData(null)}
                className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await acceptApplicationMutation.mutateAsync({
                    id: acceptModalData.id,
                    data: { team: acceptModalData.team },
                  });
                  await refetch();
                  setAcceptModalData(null);
                }}
                disabled={acceptApplicationMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {acceptApplicationMutation.isPending ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

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