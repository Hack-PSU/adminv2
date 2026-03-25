"use client";

import { useApplicationsAnalytics } from "@/common/api/analytics/hook";
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
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Attendance Rate"
          value={formatPercent(data.attendanceRate)}
          icon={UserCheck}
        />
        <MetricCard
          title="Confirm Rate"
          value={formatPercent(data.confirmRate)}
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
          icon={Award}
        />
        <MetricCard
          title="Acceptance Rate"
          value={formatPercent(data.acceptanceRate)}
          icon={TrendingUp}
        />
      </div>
    </section>
  );
}

export default function ApplicationsAnalyticsPage() {
  const { data, isLoading, isError } = useApplicationsAnalytics();
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        Loading application analytics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        Unable to load application analytics. Please try again.
      </div>
    );
  }

    

  return (
    <div className="space-y-8">
      <MetricsSection title="Penn State" data={data.pennState} />
      <MetricsSection title="Other" data={data.other} />
      
    </div>
  );
}
