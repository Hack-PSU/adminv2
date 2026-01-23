"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TimelineDataPoint = {
  day: number;
  count: number;
  hackathonName: string;
  hackathonId: string;
};

type RegistrationTimelineProps = {
  data: TimelineDataPoint[];
  height?: number;
};

const COLOR_POOL = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#8b5cf6",
  "#facc15",
];

export default function RegistrationTimeline({
  data,
  height = 320,
}: RegistrationTimelineProps) {
  const { chartData, series } = useMemo(() => {
    const seriesMap = new Map<
      string,
      { id: string; name: string; color: string }
    >();
    const dayMap = new Map<number, Record<string, number>>();

    data.forEach((point) => {
      if (!seriesMap.has(point.hackathonId)) {
        const index = seriesMap.size % COLOR_POOL.length;
        seriesMap.set(point.hackathonId, {
          id: point.hackathonId,
          name: point.hackathonName,
          color: COLOR_POOL[index],
        });
      }

      const existing = dayMap.get(point.day) ?? { day: point.day };
      existing[point.hackathonId] = point.count;
      dayMap.set(point.day, existing);
    });

    const normalized = Array.from(dayMap.values()).sort(
      (a, b) => a.day - b.day,
    );

    return {
      chartData: normalized,
      series: Array.from(seriesMap.values()),
    };
  }, [data]);

  if (!data.length) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
        No timeline data yet.
      </div>
    );
  }

  const seriesLookup = new Map(series.map((item) => [item.id, item]));

  const tickInterval = useMemo(() => {
    if (!chartData.length) {
      return 0;
    }
    const maxTicks = 10;
    return chartData.length > maxTicks
      ? Math.ceil(chartData.length / maxTicks) - 1
      : 0;
  }, [chartData.length]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 16, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis
            dataKey="day"
            tickFormatter={(value) => Math.abs(value as number).toString()}
            tick={{ fontSize: 12, fill: "#71717a" }}
            axisLine={{ stroke: "#e4e4e7" }}
            tickLine={{ stroke: "#e4e4e7" }}
            interval={tickInterval}
            minTickGap={12}
          />
          <YAxis
            tickFormatter={(value) =>
              (value as number).toLocaleString("en", {
                notation: "compact",
              })
            }
            tick={{ fontSize: 12, fill: "#71717a" }}
            axisLine={{ stroke: "#e4e4e7" }}
            tickLine={{ stroke: "#e4e4e7" }}
            width={40}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }
              const dayValue =
                typeof label === "number" ? label : Number(label);
              const items = payload.filter((entry) =>
                Number.isFinite(entry.value as number),
              );

              return (
                <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg">
                  <div className="text-xs font-semibold text-zinc-900">
                    Day {Math.abs(dayValue)} before event
                  </div>
                  <div className="mt-2 space-y-1">
                    {items.map((entry) => {
                      const seriesInfo = seriesLookup.get(
                        entry.dataKey as string,
                      );
                      const labelText = seriesInfo?.name ?? entry.name;
                      const color =
                        seriesInfo?.color ??
                        entry.color ??
                        "#0f172a";
                      return (
                        <div
                          key={entry.dataKey}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-zinc-600">{labelText}</span>
                          </div>
                          <span className="font-semibold text-zinc-900">
                            {Number(entry.value).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          />
          {series.map((item) => (
            <Line
              key={item.id}
              dataKey={item.id}
              name={item.name}
              stroke={item.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
