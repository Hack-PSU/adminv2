import { apiFetch } from "@/common/api/apiClient";
import {
  AnalyticsSummaryResponse,
  AnalyticsEventsResponse,
  AnalyticsScansResponse,
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

export async function downloadAnalyticsPDF(): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/pdf`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/pdf",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
