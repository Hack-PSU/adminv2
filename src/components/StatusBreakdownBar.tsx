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
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {/* Segmented bar */}
      {total > 0 && (
        <div className="flex h-2.5 rounded-full overflow-hidden bg-zinc-100 w-48 shrink-0">
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

      {/* Status pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-zinc-500 mr-1">{total} total</span>
        {STATUS_CONFIG.map((status) => {
          const count = statusCounts[status.key];
          if (count === 0) return null;
          return (
            <span
              key={status.key}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.pill} ${status.text}`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.bg}`} />
              {status.label} {count}
            </span>
          );
        })}
      </div>
    </div>
  );
}
