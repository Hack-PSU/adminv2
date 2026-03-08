import { apiFetch } from "@/common/api/apiClient";
import { ScanEntity } from "./entity";

export async function getAllScans(hackathonId?: string): Promise<ScanEntity[]> {
  const queryParam = hackathonId
    ? `?hackathonId=${encodeURIComponent(hackathonId)}`
    : "";

  return apiFetch<ScanEntity[]>(`/scans${queryParam}`, {
    method: "GET",
  });
}
