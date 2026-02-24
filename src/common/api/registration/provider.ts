import { apiFetch } from "@/common/api/apiClient";
import {
  RegistrationEntity,
  RegistrationCreateEntity,
  RegistrationUpdateEntity,
  RegistrationScoreEntity,
} from "./entity";

export async function getAllRegistrations(
  all?: boolean,
): Promise<RegistrationEntity[]> {
  const queryParam = all ? "?all=true" : "";
  return apiFetch<RegistrationEntity[]>(`/registrations${queryParam}`, {
    method: "GET",
  });
}

export async function getRegistration(id: number): Promise<RegistrationEntity> {
  return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
    method: "GET",
  });
}

export async function createRegistration(
  data: RegistrationCreateEntity,
): Promise<RegistrationEntity> {
  return apiFetch<RegistrationEntity>("/registrations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRegistration(
  id: number,
  data: RegistrationUpdateEntity,
): Promise<RegistrationEntity> {
  return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function replaceRegistration(
  id: number,
  data: RegistrationCreateEntity,
): Promise<RegistrationEntity> {
  return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteRegistration(id: number): Promise<void> {
  return apiFetch<void>(`/registrations/${id}`, { method: "DELETE" });
}

export async function getPennStateRegistrationScores(): Promise<RegistrationScoreEntity[]> {
  return apiFetch<RegistrationScoreEntity[]>(`/registrations/scores/psu`, {
    method: "GET",
  });
}

export async function getOtherRegistrationScores(): Promise<RegistrationScoreEntity[]> {
  return apiFetch<RegistrationScoreEntity[]>(`/registrations/scores/other`, {
    method: "GET",
  });
}

export async function updateApplicationStatus(id: number, status: string): Promise<RegistrationEntity> {
  return apiFetch<RegistrationEntity>(`/registrations/${id}/application-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateApplicationStatusBulk(ids: string[], status: string): Promise<void> {
  console.log("Updating application status in bulk:", ids, status);
  return apiFetch<void>(`/registrations/application-status-bulk`, {
    method: "PATCH",
    body: JSON.stringify({ userIds: ids, status }),
  });
}