"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CheckInHeatmapDatum = {
  key: string;
  label: string;
  rangeLabel: string;
  count: number;
  intensity: number;
};

type CheckInHeatmapProps = {
  data: CheckInHeatmapDatum[];
  height?: number;
  minPointWidth?: number;
};

const DEFAULT_COLOR_SCALE = [
  "#ecfdf5",
  "#bbf7d0",
  "#86efac",
  "#22c55e",
  "#15803d",
];

function getHeatmapColor(intensity: number) {
  if (intensity <= 0) {
    return DEFAULT_COLOR_SCALE[0];
  }

  if (intensity < 0.25) {
    return DEFAULT_COLOR_SCALE[1];
  }

  if (intensity < 0.5) {
    return DEFAULT_COLOR_SCALE[2];
  }

  if (intensity < 0.75) {
    return DEFAULT_COLOR_SCALE[3];
  }

  return DEFAULT_COLOR_SCALE[4];
}

export default function CheckInHeatmap({
  data,
  height = 320,
  minPointWidth = 56,
}: CheckInHeatmapProps) {
  const chartWidth = useMemo(
    () => Math.max(720, data.length * minPointWidth),
    [data.length, minPointWidth],
  );

  const tickInterval = useMemo(() => {
    if (!data.length) {
      return 0;
    }

    const maxTicks = 12;
    return data.length > maxTicks ? Math.ceil(data.length / maxTicks) - 1 : 0;
  }, [data.length]);

  return (
    <div className="h-full w-full overflow-x-auto">
      <div className="h-full min-w-full" style={{ minWidth: chartWidth }}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e4e4e7"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              interval={tickInterval}
              minTickGap={10}
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={{ stroke: "#e4e4e7" }}
              width={36}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const datum = payload[0]?.payload as
                  | CheckInHeatmapDatum
                  | undefined;
                if (!datum) {
                  return null;
                }

                return (
                  <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg">
                    <div className="text-xs font-semibold text-zinc-900">
                      {datum.rangeLabel}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Check-ins</span>
                      <span className="font-semibold text-zinc-900">
                        {datum.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((datum) => (
                <Cell key={datum.key} fill={getHeatmapColor(datum.intensity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
