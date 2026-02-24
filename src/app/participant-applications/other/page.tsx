"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import { useOtherRegistrationScores, useUpdateApplicationStatus, useUpdateApplicationStatusBulk } from "@/common/api/registration/hook";
import { RegistrationScoreEntity } from "@/common/api/registration/entity";
import { useState, useMemo, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewParticipantApplicationModal from "@/components/modal/ViewParticipantApplicationModal";

export default function OtherApplicationsPage() {
  const { data: applicationsRaw = [], isLoading, refetch } = useOtherRegistrationScores();
  const [selectedApplication, setSelectedApplication] = useState<RegistrationScoreEntity | null>(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ id: number; status: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [pendingBulkStatus, setPendingBulkStatus] = useState<{ ids: string[]; status: string } | null>(null);
  const [bulkUpdateModal, setBulkUpdateModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
  }>({ isOpen: false, isLoading: false });

  // Filter states
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<string>("pending");
  const [prioritizedFilter, setPrioritizedFilter] = useState<string>("all");
  const [topNFilter, setTopNFilter] = useState<number | string>("");
  const [academicYearFilter, setAcademicYearFilter] = useState<string>("all");
  const [codingExperienceFilter, setCodingExperienceFilter] = useState<string>("all");

  // Get unique values for filters
  const uniqueAcademicYears = useMemo(() => {
    const years = new Set(applicationsRaw.map(app => app.academicYear).filter(Boolean));
    return Array.from(years).sort();
  }, [applicationsRaw]);

  const uniqueCodingExperiences = useMemo(() => {
    const experiences = new Set(applicationsRaw.map(app => app.codingExperience).filter(Boolean));
    return Array.from(experiences).sort();
  }, [applicationsRaw]);

  // Sort and filter data
  const sortedApplications = useMemo(() => {
    let filtered = [...applicationsRaw];

    // Apply application status filter
    if (applicationStatusFilter && applicationStatusFilter !== "all") {
      filtered = filtered.filter(app => app.applicationStatus === applicationStatusFilter);
    }

    // Apply prioritized filter
    if (prioritizedFilter === "yes") {
      filtered = filtered.filter(app => app.prioritized);
    } else if (prioritizedFilter === "no") {
      filtered = filtered.filter(app => !app.prioritized);
    }

    // Apply academic year filter
    if (academicYearFilter && academicYearFilter !== "all") {
      filtered = filtered.filter(app => app.academicYear === academicYearFilter);
    }

    // Apply coding experience filter
    if (codingExperienceFilter && codingExperienceFilter !== "all") {
      filtered = filtered.filter(app => app.codingExperience === codingExperienceFilter);
    }

    // Sort: prioritized first, then by score descending
    filtered.sort((a, b) => {
      const aPrioritized = a.prioritized ? 1 : 0;
      const bPrioritized = b.prioritized ? 1 : 0;
      
      if (aPrioritized !== bPrioritized) {
        return bPrioritized - aPrioritized;
      }
      
      return (b.mu || 0) - (a.mu || 0);
    });

    // Apply top N filter
    if (topNFilter && Number(topNFilter) > 0) {
      filtered = filtered.slice(0, Number(topNFilter));
    }

    return filtered;
  }, [applicationsRaw, applicationStatusFilter, prioritizedFilter, topNFilter, academicYearFilter, codingExperienceFilter]);

  // Check if all selected applications have pending status
  const allSelectedArePending = useMemo(() => {
    if (selectedRows.length === 0) return true;
    return selectedRows.every(userId => 
      sortedApplications.find(app => app.userId === userId)?.applicationStatus === "pending"
    );
  }, [selectedRows, sortedApplications]);

  // Create mutation hook with pending status
  const updateStatusMutation = useUpdateApplicationStatus(
    pendingStatusUpdate?.id || 0,
    pendingStatusUpdate?.status || ""
  );

  // Bulk update mutation
  const bulkUpdateMutation = useUpdateApplicationStatusBulk(
    pendingBulkStatus?.ids || [],
    pendingBulkStatus?.status || ""
  );

  // Use refs to access latest mutation and refetch without causing re-runs
  const bulkUpdateMutationRef = useRef(bulkUpdateMutation);
  const refetchRef = useRef(refetch);
  
  useEffect(() => {
    bulkUpdateMutationRef.current = bulkUpdateMutation;
    refetchRef.current = refetch;
  }, [bulkUpdateMutation, refetch]);

  const columns: DataTableColumn<RegistrationScoreEntity>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: (_, row) => {
        return `${row.firstName || ''} ${row.lastName || ''}`.trim();
      },
    },
    {
      accessorKey: "mu",
      header: "Score",
      cell: (value) => {
        if (typeof value === 'number') {
          return value.toFixed(2);
        }
        return String(value);
      },
    },
    {
      accessorKey: "prioritized",
      header: "Prioritized"
    },
    {
      accessorKey: "applicationStatus",
      header: "Application Status",
      cell: (value) => {
        const statusValue = String(value || "").toLowerCase();
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
          pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
          accepted: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
          rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
          waitlisted: { bg: "bg-blue-100", text: "text-blue-800", label: "Waitlisted" },
        };
        const config = statusConfig[statusValue] || { bg: "bg-zinc-100", text: "text-zinc-800", label: String(value) };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: "travelCost",
      header: "Travel Cost",
      cell: (value) => {
        if (value === undefined || value === null) {
          return "-";
        }
        if (typeof value === 'number') {
          return `$${value.toFixed(2)}`;
        }
        return String(value);
      },
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedApplication(row)}
              className="p-1 text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
              title="View application"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleRefresh = async () => {
    await refetch();
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    setPendingStatusUpdate({ id, status });
    try {
      await updateStatusMutation.mutateAsync();
      await refetch();
      setSelectedApplication(null);
    } finally {
      setPendingStatusUpdate(null);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    // selectedRows now contains userIds directly since we use userId as idField
    const userIds = selectedRows.filter((userId): userId is string => typeof userId === 'string');
    
    if (userIds.length === 0) return; // Don't proceed if no valid userIds
    
    setPendingBulkStatus({ ids: userIds, status });
    setBulkUpdateModal({ isOpen: true, isLoading: true });
  };

  // Effect to handle bulk status update mutation
  useEffect(() => {
    if (!pendingBulkStatus) return;
    
    const performUpdate = async () => {
      try {
        await bulkUpdateMutationRef.current.mutateAsync();
        await refetchRef.current();
        setSelectedRows([]);
        setBulkUpdateModal({ isOpen: false, isLoading: false });
      } finally {
        setPendingBulkStatus(null);
      }
    };
    
    performUpdate();
  }, [pendingBulkStatus]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <p>Loading applications...</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Filter Controls */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-zinc-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Application Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 mb-2">Application Status</label>
            <select
              value={applicationStatusFilter}
              onChange={(e) => setApplicationStatusFilter(e.target.value)}
              className="border border-zinc-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Prioritized */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 mb-2">Prioritized</label>
            <select
              value={prioritizedFilter}
              onChange={(e) => setPrioritizedFilter(e.target.value)}
              className="border border-zinc-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 mb-2">Academic Year</label>
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="border border-zinc-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              {uniqueAcademicYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Coding Experience */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 mb-2">Coding Experience</label>
            <select
              value={codingExperienceFilter}
              onChange={(e) => setCodingExperienceFilter(e.target.value)}
              className="border border-zinc-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              {uniqueCodingExperiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Top N */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-zinc-700 mb-2">Top N Candidates</label>
            <input
              type="number"
              value={topNFilter}
              onChange={(e) => setTopNFilter(e.target.value)}
              placeholder="Leave empty for all"
              min="0"
              className="border border-zinc-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setApplicationStatusFilter("pending");
                setPrioritizedFilter("all");
                setTopNFilter("");
                setAcademicYearFilter("all");
                setCodingExperienceFilter("all");
                setSelectedRows([]);
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-zinc-900">
          
        </h1>
        <Button
          onClick={() => setBulkUpdateModal({ isOpen: true, isLoading: false })}
          disabled={selectedRows.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          Update Status ({selectedRows.length})
        </Button>
      </div>
      <DataTable<RegistrationScoreEntity>
        data={sortedApplications}
        columns={columns}
        onRefresh={handleRefresh}
        onSelectionChange={setSelectedRows}
        idField="userId"
      />
      <ViewParticipantApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onAccept={(id) => handleStatusUpdate(id, "accepted")}
        onReject={(id) => handleStatusUpdate(id, "rejected")}
        onWaitlist={(id) => handleStatusUpdate(id, "waitlisted")}
      />

      {/* Bulk Update Modal */}
      {bulkUpdateModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Update Status for {selectedRows.length} Application{selectedRows.length !== 1 ? "s" : ""}
            </h2>
            {!allSelectedArePending && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Some selected applications are not pending. Only pending applications can be updated.
              </div>
            )}
            <p className="text-zinc-600 mb-6">
              Select the status to apply to all selected applications.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setBulkUpdateModal({ isOpen: false, isLoading: false })}
                disabled={bulkUpdateModal.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate("waitlisted")}
                disabled={bulkUpdateModal.isLoading || !allSelectedArePending}
                className="bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-yellow-300 disabled:cursor-not-allowed"
                title={!allSelectedArePending ? "Can only update pending applications" : undefined}
              >
                {bulkUpdateModal.isLoading ? "..." : "Waitlist"}
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate("rejected")}
                disabled={bulkUpdateModal.isLoading || !allSelectedArePending}
                className="bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300 disabled:cursor-not-allowed"
                title={!allSelectedArePending ? "Can only update pending applications" : undefined}
              >
                {bulkUpdateModal.isLoading ? "..." : "Reject"}
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate("accepted")}
                disabled={bulkUpdateModal.isLoading || !allSelectedArePending}
                className="bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300 disabled:cursor-not-allowed"
                title={!allSelectedArePending ? "Can only update pending applications" : undefined}
              >
                {bulkUpdateModal.isLoading ? "..." : "Accept"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}