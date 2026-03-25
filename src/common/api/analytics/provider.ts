import { apiFetch } from "@/common/api/apiClient";
import {
  AnalyticsSummaryResponse,
  AnalyticsEventsResponse,
  AnalyticsScansResponse,
  AnalyticsApplicationsResponse,
} from "./entity";

export async function getAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
  return apiFetch<AnalyticsSummaryResponse>("/analytics/summary", {
    method: "GET",
  });
}

export async function getEventsAnalytics(): Promise<AnalyticsEventsResponse[]> {
  return apiFetch<AnalyticsEventsResponse[]>("/analytics/events", {
    method: "GET",
  });
}

export async function getOrganizerScans(): Promise<AnalyticsScansResponse[]> {
  return apiFetch<AnalyticsScansResponse[]>("/analytics/scans", {
    method: "GET",
  });
}

export async function getApplicationsAnalytics(): Promise<AnalyticsApplicationsResponse> {
  return apiFetch<AnalyticsApplicationsResponse>("/analytics/applications", {
    method: "GET",
  });
}
