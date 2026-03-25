import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsSummary,
  getEventsAnalytics,
  getOrganizerScans,
  getApplicationsAnalytics,
} from "./provider";
import {
  AnalyticsSummaryResponse,
  AnalyticsEventsResponse,
  AnalyticsScansResponse,
  AnalyticsApplicationsResponse,
} from "./entity";

export const analyticsQueryKeys = {
  summary: ["analytics", "summary"] as const,
  events: ["analytics", "events"] as const,
  scans: ["analytics", "scans"] as const,
  applications: ["analytics", "applications"] as const,
};

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummaryResponse>({
    queryKey: analyticsQueryKeys.summary,
    queryFn: getAnalyticsSummary,
  });
}

export function useEventsAnalytics() {
  return useQuery<AnalyticsEventsResponse[]>({
    queryKey: analyticsQueryKeys.events,
    queryFn: getEventsAnalytics,
  });
}

export function useOrganizerScans() {
  return useQuery<AnalyticsScansResponse[]>({
    queryKey: analyticsQueryKeys.scans,
    queryFn: getOrganizerScans,
  });
}

export function useApplicationsAnalytics() {
  return useQuery<AnalyticsApplicationsResponse>({
    queryKey: analyticsQueryKeys.applications,
    queryFn: getApplicationsAnalytics,
  });
}
