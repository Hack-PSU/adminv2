"use client";

import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import {
  useAnalyticsGetApplicationAnalytics,
  useHackathonGetAll,
} from "@hackpsu/react-sdk";
import {
  UserCheck,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
} from "lucide-react";

// const mockApplicationsData = {
//   pennState: {
//     attendanceRate: 0,
//     confirmRate: 0.5993589743589743,
//     averageConfirmTime: 223800970.91443852,
//     acceptanceTotal: 312,
//     acceptanceRate: 0.975,
//   },
//   other: {
//     attendanceRate: 0,
//     confirmRate: 0.5227272727272727,
//     averageConfirmTime: 221774885.72826087,
//     acceptanceTotal: 176,
//     acceptanceRate: 0.7213114754098361,
//   },
// };

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDays(value: number) {
  return `${(value / (1000 * 60 * 60 * 24)).toFixed(2)} days`;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-zinc-600" />}
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      </div>
      <p className="mt-3 text-3xl font-semibold text-zinc-900">{value}</p>
      {description ? (
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}

function MetricsSection({
  title,
  data,
}: {
  title: string;
  data: {
    attendanceRate: number;
    confirmRate: number;
    averageConfirmTime: number;
    acceptanceTotal: number;
    acceptanceRate: number;
  };
}) {
  const totalApplications = data.acceptanceRate > 0
    ? Math.round(data.acceptanceTotal / data.acceptanceRate)
    : 0;
  const confirmedCount = Math.round(data.confirmRate * data.acceptanceTotal);
  const checkedInCount = Math.round(data.attendanceRate * confirmedCount);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Attendance Rate"
          value={formatPercent(data.attendanceRate)}
          description={checkedInCount.toLocaleString() + " people checked in"}
          icon={UserCheck}
        />
        <MetricCard
          title="Confirm Rate"
          value={formatPercent(data.confirmRate)}
          description={confirmedCount.toLocaleString() + " people confirmed"}
          icon={CheckCircle}
        />
        <MetricCard
          title="Average Confirm Time"
          value={formatDays(data.averageConfirmTime)}
          icon={Clock}
        />
        <MetricCard
          title="Acceptance Total"
          value={data.acceptanceTotal.toLocaleString()}
          description={formatPercent(data.acceptanceRate) + " acceptance rate"}
          icon={Award}
        />
        <MetricCard
          title="Acceptance Rate"
          value={formatPercent(data.acceptanceRate)}
          description={data.acceptanceTotal.toLocaleString() + " out of " + totalApplications.toLocaleString() + " applicants"}
          icon={TrendingUp}
        />
      </div>
    </section>
  );
}

export default function ApplicationsAnalyticsPage() {
  const {
    data: hackathons = [],
    isLoading: hackathonsLoading,
    isError: hackathonsError,
  } = useHackathonGetAll();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");

  // Newest hackathon first
  const orderedHackathons = useMemo(
    () => [...hackathons].sort((a, b) => b.startTime - a.startTime),
    [hackathons],
  );

  // Default to the active hackathon until the user picks one
  const effectiveHackathonId =
    selectedHackathonId ||
    hackathons.find((hackathon) => hackathon.active)?.id ||
    "";

  // Wait for the hackathon list so we don't fetch the active hackathon twice;
  // if the list fails to load, fall back to the API's active-hackathon default.
  const { data, isLoading, isError, isFetching } =
    useAnalyticsGetApplicationAnalytics(
      effectiveHackathonId ? { hackathonId: effectiveHackathonId } : undefined,
      {
        query: {
          enabled: !hackathonsLoading,
          placeholderData: keepPreviousData,
        },
      },
    );

  let content: React.ReactNode;
  if (hackathonsLoading || isLoading) {
    content = (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        Loading application analytics...
      </div>
    );
  } else if (isError || !data) {
    content = (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        Unable to load application analytics. Please try again.
      </div>
    );
  } else {
    content = (
      <div
        className={`space-y-8 transition-opacity ${isFetching ? "opacity-60" : ""}`}
      >
        <MetricsSection title="Penn State" data={data.pennState} />
        <MetricsSection title="Other" data={data.other} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!hackathonsError && orderedHackathons.length > 0 ? (
        <div className="flex items-center gap-2">
          <label
            htmlFor="applications-hackathon-filter"
            className="text-sm font-medium text-zinc-600"
          >
            Hackathon
          </label>
          <select
            id="applications-hackathon-filter"
            value={effectiveHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            {orderedHackathons.map((hackathon) => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.name}
                {hackathon.active ? " (Active)" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {content}
    </div>
  );
}
