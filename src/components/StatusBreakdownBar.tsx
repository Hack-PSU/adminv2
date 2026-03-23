"use client";

import { useMemo } from "react";
import { RegistrationScoreEntity } from "@/common/api/registration/entity";

const STATUS_CONFIG = [
  { key: "pending", label: "Pending", bg: "bg-yellow-400", text: "text-yellow-800", pill: "bg-yellow-100" },
  { key: "accepted", label: "Accepted", bg: "bg-green-400", text: "text-green-800", pill: "bg-green-100" },
  { key: "confirmed", label: "Confirmed", bg: "bg-emerald-500", text: "text-emerald-800", pill: "bg-emerald-100" },
  { key: "waitlisted", label: "Waitlisted", bg: "bg-blue-400", text: "text-blue-800", pill: "bg-blue-100" },
  { key: "rejected", label: "Rejected", bg: "bg-red-400", text: "text-red-800", pill: "bg-red-100" },
  { key: "declined", label: "Declined", bg: "bg-red-300", text: "text-red-700", pill: "bg-red-50" },
] as const;

interface StatusBreakdownBarProps {
  data: RegistrationScoreEntity[];
}

export default function StatusBreakdownBar({ data }: StatusBreakdownBarProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const status of STATUS_CONFIG) {
      counts[status.key] = 0;
    }
    for (const app of data) {
      const s = (app.applicationStatus || "").toLowerCase();
      if (s in counts) {
        counts[s]++;
      }
    }
    return counts;
  }, [data]);

  const total = data.length;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">Application Status Overview</h3>
        <span className="text-sm font-medium text-zinc-500">{total} total</span>
      </div>

      {/* Segmented bar */}
      {total > 0 && (
        <div className="flex h-3 rounded-full overflow-hidden bg-zinc-100">
          {STATUS_CONFIG.map((status) => {
            const count = statusCounts[status.key];
            if (count === 0) return null;
            const pct = (count / total) * 100;
            return (
              <div
                key={status.key}
                className={`${status.bg} transition-all`}
                style={{ width: `${pct}%` }}
                title={`${status.label}: ${count} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>
      )}

      {/* Legend with counts */}
      <div className="flex flex-wrap gap-3">
        {STATUS_CONFIG.map((status) => {
          const count = statusCounts[status.key];
          return (
            <div
              key={status.key}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.pill} ${status.text}`}
            >
              <span className={`inline-block w-2 h-2 rounded-full ${status.bg}`} />
              {status.label}
              <span className="font-semibold">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
