"use client";

import { useMemo } from "react";
import { useAnalyticsSummary } from "@/common/api/analytics/hook";
import { useAllHackathons } from "@/common/api/hackathon/hook";
import { useAllRegistrations } from "@/common/api/registration/hook";
import { useAllUsers } from "@/common/api/user/hook";
import {
  ChartContainer,
  Pie,
  RegistrationBarLine,
  RegistrationTimeline,
  type PieDatum,
  type RegistrationBarDatum,
  type TimelineDataPoint,
} from "@/components/charts";

const DAY_MS = 1000 * 60 * 60 * 24;
const MAX_SCHOOL_SLICES = 8;
const OTHER_SCHOOLS_LABEL = "Other schools";
const MAX_MAJOR_SLICES = 8;
const OTHER_MAJORS_LABEL = "Other majors";

function formatLabel(value?: string | null) {
  if (!value) {
    return "Unknown";
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : "Unknown";
}

function formatMissingLabel(value: string | null | undefined, missing: string[]) {
  const formatted = formatLabel(value);
  if (formatted === "Unknown") {
    return formatted;
  }
  const normalized = formatted.toLowerCase();
  return missing.includes(normalized) ? "Not-Filled" : formatted;
}

function normalizeTimestamp(value: number | string | null | undefined) {
  if (value == null) {
    return null;
  }
  let numeric: number;
  if (typeof value === "string") {
    const direct = Number(value);
    numeric = Number.isFinite(direct) ? direct : Date.parse(value);
  } else {
    numeric = value;
  }
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return numeric < 1e12 ? numeric * 1000 : numeric;
}

function buildPieData<T>(
  items: T[] | undefined,
  getLabel: (item: T) => string,
  getValue: (item: T) => number,
): PieDatum[] {
  if (!items?.length) {
    return [];
  }
  return items.map((item) => ({
    label: getLabel(item),
    value: getValue(item),
  }));
}

function buildTopSliceData(
  counts: Record<string, number>,
  maxSlices: number,
  otherLabel: string,
): PieDatum[] {
  const sorted = Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const topSlices = sorted.slice(0, maxSlices);
  const remainder = sorted.slice(maxSlices);
  const remainderTotal = remainder.reduce((sum, entry) => sum + entry.value, 0);

  if (remainderTotal > 0) {
    topSlices.push({
      label: otherLabel,
      value: remainderTotal,
    });
  }

  return topSlices;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500">
      {message}
    </div>
  );
}

export default function AnalyticsSummary() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useAnalyticsSummary();
  const {
    data: hackathons = [],
    isLoading: hackathonsLoading,
    isError: hackathonsError,
  } = useAllHackathons();
  const {
    data: allRegistrations = [],
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useAllRegistrations(true);
  const {
    data: currentRegistrations = [],
    isLoading: currentRegistrationsLoading,
    isError: currentRegistrationsError,
  } = useAllRegistrations();
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useAllUsers();

  const isLoading =
    summaryLoading ||
    hackathonsLoading ||
    registrationsLoading ||
    currentRegistrationsLoading ||
    usersLoading;
  const isError =
    summaryError ||
    hackathonsError ||
    registrationsError ||
    currentRegistrationsError ||
    usersError;

  const registrationsData = useMemo<RegistrationBarDatum[]>(() => {
    const registrationSummary = summary?.registrations ?? [];
    if (!registrationSummary.length) {
      return [];
    }

    if (!hackathons.length) {
      return registrationSummary.map((entry) => ({
        label: formatLabel(entry.name),
        count: entry.count,
      }));
    }

    const byId = new Map(
      registrationSummary.map((entry) => [entry.id, entry]),
    );
    const orderedHackathons = [...hackathons].sort((a, b) => {
      const aTime = normalizeTimestamp(a.startTime) ?? 0;
      const bTime = normalizeTimestamp(b.startTime) ?? 0;
      return aTime - bTime;
    });
    const knownIds = new Set<string>();

    const data: RegistrationBarDatum[] = [];
    orderedHackathons.forEach((hackathon) => {
      const entry = byId.get(hackathon.id);
      if (!entry) {
        return;
      }
      knownIds.add(entry.id);
      data.push({
        label: formatLabel(entry.name || hackathon.name),
        count: entry.count,
      });
    });

    registrationSummary.forEach((entry) => {
      if (knownIds.has(entry.id)) {
        return;
      }
      data.push({
        label: formatLabel(entry.name),
        count: entry.count,
      });
    });

    return data;
  }, [summary, hackathons]);

  const registrationTotal = useMemo(
    () => registrationsData.reduce((sum, entry) => sum + entry.count, 0),
    [registrationsData],
  );

  const registrationTimeline = useMemo<TimelineDataPoint[]>(() => {
    if (!allRegistrations.length || !hackathons.length) {
      return [];
    }

    const timeline: TimelineDataPoint[] = [];

    hackathons.forEach((hackathon) => {
      const hackathonId = String(hackathon.id);
      const hackathonRegistrations = allRegistrations.filter(
        (reg) => String(reg.hackathonId) === hackathonId,
      );

      if (hackathonRegistrations.length === 0) {
        return;
      }

      const endTime = normalizeTimestamp(hackathon.endTime);
      if (!endTime) {
        return;
      }

      const registrationTimes = hackathonRegistrations
        .map((registration) => normalizeTimestamp(registration.time))
        .filter((time): time is number => typeof time === "number")
        .sort((a, b) => a - b);

      if (!registrationTimes.length) {
        return;
      }

      const earliestTime = registrationTimes[0];
      const maxDaysBeforeEvent = Math.ceil((endTime - earliestTime) / DAY_MS);

      const dailyCounts: Record<number, number> = {};
      let cumulativeCount = 0;

      registrationTimes.forEach((registrationTime) => {
        const daysBeforeEvent = Math.floor(
          (endTime - registrationTime) / DAY_MS,
        );

        cumulativeCount += 1;
        const dayKey = -daysBeforeEvent;
        dailyCounts[dayKey] = cumulativeCount;
      });

      let previousCount = 0;
      for (let day = -maxDaysBeforeEvent; day <= 0; day += 1) {
        const count = dailyCounts[day] ?? previousCount;
        timeline.push({
          day,
          count,
          hackathonName: hackathon.name,
          hackathonId: hackathon.id,
        });
        previousCount = count;
      }
    });

    return timeline;
  }, [allRegistrations, hackathons]);

  const genderData = useMemo(
    () =>
      buildPieData(
        summary?.gender,
        (entry) => formatLabel(entry.gender),
        (entry) => entry.count,
      ),
    [summary],
  );

  const raceData = useMemo(
    () =>
      buildPieData(
        summary?.race,
        (entry) => formatMissingLabel(entry.race, ["null"]),
        (entry) => entry.count,
      ),
    [summary],
  );

  const academicYearData = useMemo(
    () =>
      buildPieData(
        summary?.academicYear,
        (entry) => formatLabel(entry.academicYear),
        (entry) => entry.count,
      ),
    [summary],
  );

  const codingExperienceData = useMemo(
    () =>
      buildPieData(
        summary?.codingExp,
        (entry) => formatMissingLabel(entry.codingExperience, ["none"]),
        (entry) => entry.count,
      ),
    [summary],
  );

  const currentHackathonUsers = useMemo(() => {
    if (!currentRegistrations.length || !users.length) {
      return [];
    }

    const registeredUserIds = new Set(
      currentRegistrations.map((reg) => reg.userId),
    );
    return users.filter((user) => registeredUserIds.has(user.id));
  }, [currentRegistrations, users]);

  const shirtSizeData = useMemo<PieDatum[]>(() => {
    if (!currentHackathonUsers.length) {
      return [];
    }

    const counts: Record<string, number> = {};

    currentHackathonUsers.forEach((user) => {
      const label = formatLabel(user.shirtSize);
      counts[label] = (counts[label] ?? 0) + 1;
    });

    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
    }));
  }, [currentHackathonUsers]);

  const schoolData = useMemo<PieDatum[]>(() => {
    if (!currentHackathonUsers.length) {
      return [];
    }

    const counts: Record<string, number> = {};

    currentHackathonUsers.forEach((user) => {
      const label = formatLabel(user.university);
      counts[label] = (counts[label] ?? 0) + 1;
    });

    return buildTopSliceData(counts, MAX_SCHOOL_SLICES, OTHER_SCHOOLS_LABEL);
  }, [currentHackathonUsers]);

  const majorData = useMemo<PieDatum[]>(() => {
    if (!currentHackathonUsers.length) {
      return [];
    }

    const counts: Record<string, number> = {};

    currentHackathonUsers.forEach((user) => {
      const label = formatMissingLabel(user.major, ["none", "null"]);
      counts[label] = (counts[label] ?? 0) + 1;
    });

    return buildTopSliceData(counts, MAX_MAJOR_SLICES, OTHER_MAJORS_LABEL);
  }, [currentHackathonUsers]);

  const travelReimbursementData = useMemo<PieDatum[]>(() => {
    if (!currentRegistrations.length) {
      return [];
    }

    const counts = {
      "Requesting Reimbursement": 0,
      "Not Requesting Reimbursement": 0,
    };

    currentRegistrations.forEach((registration) => {
      if (registration.travelReimbursement === true) {
        counts["Requesting Reimbursement"] += 1;
      } else {
        counts["Not Requesting Reimbursement"] += 1;
      }
    });

    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
    }));
  }, [currentRegistrations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        Loading analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        Unable to load analytics data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChartContainer
        title="Registrations"
        description="Registrations by hackathon with bars and trend line."
      >
        {registrationsData.length ? (
          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Total registrations</p>
                <p className="text-3xl font-semibold text-zinc-900">
                  {registrationTotal.toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-zinc-400">
                Updated whenever new registration data arrives.
              </p>
            </div>
            <RegistrationBarLine data={registrationsData} />
          </div>
        ) : (
          <EmptyState message="No registration data yet." />
        )}
      </ChartContainer>

      <ChartContainer
        title="Registration Timeline"
        description="Cumulative registrations by day leading to each event."
      >
        <RegistrationTimeline data={registrationTimeline} />
      </ChartContainer>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartContainer
          title="Gender"
          description="Self-reported gender distribution."
        >
          {genderData.length ? (
            <Pie data={genderData} />
          ) : (
            <EmptyState message="No breakdown data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Race/Ethnicity"
          description="Self-reported race breakdown."
        >
          {raceData.length ? (
            <Pie data={raceData} />
          ) : (
            <EmptyState message="No breakdown data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Academic Year"
          description="Student year distribution."
        >
          {academicYearData.length ? (
            <Pie data={academicYearData} />
          ) : (
            <EmptyState message="No breakdown data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Coding Experience"
          description="Experience level by applicants."
        >
          {codingExperienceData.length ? (
            <Pie data={codingExperienceData} />
          ) : (
            <EmptyState message="No breakdown data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Shirt Size Distribution"
          description="Current hackathon shirt size requests."
        >
          {shirtSizeData.length ? (
            <Pie data={shirtSizeData} />
          ) : (
            <EmptyState message="No shirt size data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Participant Schools"
          description="Universities represented in the current hackathon."
        >
          {schoolData.length ? (
            <Pie data={schoolData} />
          ) : (
            <EmptyState message="No school data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="College Majors"
          description="Current hackathon participants by major."
        >
          {majorData.length ? (
            <Pie data={majorData} />
          ) : (
            <EmptyState message="No major data yet." />
          )}
        </ChartContainer>
        <ChartContainer
          title="Travel Reimbursement Requests"
          description="Share of current hackers requesting travel support."
        >
          {travelReimbursementData.length ? (
            <div className="space-y-3">
              <Pie data={travelReimbursementData} />
              <p className="text-xs italic text-zinc-400">
                Fall 2025: feature implemented after ~90 registrations
              </p>
            </div>
          ) : (
            <EmptyState message="No reimbursement data yet." />
          )}
        </ChartContainer>
      </div>
    </div>
  );
}
