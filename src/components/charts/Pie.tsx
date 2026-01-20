"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type PieDatum = {
  label: string;
  value: number;
};

type PieProps = {
  data: PieDatum[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
};

const PIE_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#8b5cf6",
  "#facc15",
];

export default function DonutPie({
  data,
  height = 224,
  innerRadius = 58,
  outerRadius = 84,
  showLegend = true,
  showTotal = true,
  totalLabel = "Total",
}: PieProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              cornerRadius={6}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.label}-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }
                const datum = payload[0]?.payload as PieDatum | undefined;
                if (!datum) {
                  return null;
                }
                return (
                  <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg">
                    <div className="text-xs font-semibold text-zinc-900">
                      {datum.label}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Count</span>
                      <span className="font-semibold text-zinc-900">
                        {datum.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {showTotal ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase tracking-wide text-zinc-400">
              {totalLabel}
            </span>
            <span className="text-2xl font-semibold text-zinc-900">
              {total.toLocaleString()}
            </span>
          </div>
        ) : null}
      </div>
      {showLegend ? (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-zinc-600">
          {data.map((entry, index) => (
            <div
              key={`${entry.label}-${index}`}
              className="flex items-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                }}
              />
              <span className="font-medium text-zinc-700">{entry.label}</span>
              <span className="text-zinc-500">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
