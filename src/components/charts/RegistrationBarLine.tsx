"use client";

import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export type RegistrationBarDatum = {
  label: string;
  count: number;
};

type RegistrationBarLineProps = {
  data: RegistrationBarDatum[];
  height?: number;
  minPointWidth?: number;
  barSize?: number;
  barColor?: string;
  lineColor?: string;
  growth?: Record<string, number>;
};

const DEFAULT_BAR_COLOR = "#bfdbfe";
const DEFAULT_LINE_COLOR = "#2563eb";
const DEFAULT_BAR_SIZE = 40;

export default function RegistrationBarLine({
  data,
  height = 320,
  minPointWidth = 120,
  barSize = DEFAULT_BAR_SIZE,
  barColor = DEFAULT_BAR_COLOR,
  lineColor = DEFAULT_LINE_COLOR,
  growth,
}: RegistrationBarLineProps) {
  const chartWidth = useMemo(
    () => Math.max(720, data.length * minPointWidth),
    [data.length, minPointWidth],
  );

  const growthByLabel = useMemo(() => {
    if (growth) {
      return growth;
    }
    const computed: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i];
      const previous = data[i - 1]?.count;
      if (!previous) {
        computed[current.label] = Number.NaN;
        continue;
      }
      computed[current.label] = ((current.count - previous) / previous) * 100;
    }
    return computed;
  }, [data, growth]);

  return (
    <div className="h-full w-full overflow-x-auto">
      <div className="h-full min-w-full" style={{ minWidth: chartWidth }}>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="label"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={{ stroke: "#e4e4e7" }}
              width={32}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }
                const datum = payload[0]?.payload as
                  | RegistrationBarDatum
                  | undefined;
                if (!datum) {
                  return null;
                }
                const growthValue = growthByLabel[datum.label];
                const hasGrowth =
                  typeof growthValue === "number" &&
                  Number.isFinite(growthValue);
                const growthText = hasGrowth
                  ? `${growthValue >= 0 ? "+" : ""}${growthValue.toFixed(1)}%`
                  : "N/A";
                const growthTone = hasGrowth
                  ? growthValue >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                  : "text-zinc-400";

                return (
                  <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg">
                    <div className="text-xs font-semibold text-zinc-900">
                      {datum.label}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Count</span>
                      <span className="font-semibold text-zinc-900">
                        {datum.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Change</span>
                      <span className={cn("font-semibold", growthTone)}>
                        {growthText}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="count"
              fill={barColor}
              radius={[6, 6, 0, 0]}
              barSize={barSize}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
