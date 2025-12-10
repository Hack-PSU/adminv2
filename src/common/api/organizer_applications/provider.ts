import { apiFetch } from "@/common/api/apiClient";
import {
	OrganizerApplicationEntity,
	ApplicationsByTeamResponse,
	AcceptRejectDto,
	OrganizerTeam,
	SubmitApplicationDto,
} from "./entity";

/**
 * Get All Applications (Exec Only)
 */
export async function getAllApplications(): Promise<
	OrganizerApplicationEntity[]
> {
	return apiFetch<OrganizerApplicationEntity[]>("/organizer-applications", {
		method: "GET",
	});
}

/**
 * Get Applications by Team (Team Members)
 */
export async function getApplicationsByTeam(
	team: OrganizerTeam
): Promise<ApplicationsByTeamResponse> {
	return apiFetch<ApplicationsByTeamResponse>(
		`/organizer-applications/by-team/${team}`,
		{ method: "GET" }
	);
}

/**
 * Get Single Application (Team Members)
 */
export async function getApplicationById(
	id: number
): Promise<OrganizerApplicationEntity> {
	return apiFetch<OrganizerApplicationEntity>(
		`/organizer-applications/${id}`,
		{ method: "GET" }
	);
}

/**
 * Submit Application (Public - handled via FormData)
 */
export async function submitApplication(
	formData: FormData
): Promise<OrganizerApplicationEntity> {
	// For FormData, we need to handle it differently
	// Don't set Content-Type header, let browser set it with boundary
	const config = await import("@/common/config").then((m) =>
		m.getEnvironment()
	);
	const user = (await import("@/common/config")).auth.currentUser;

	const headers = new Headers();
	if (user) {
		const { getIdToken } = await import("@firebase/auth");
		const token = await getIdToken(user);
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	}

	const response = await fetch(`${config.baseURL}/organizer-applications`, {
		method: "POST",
		headers,
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`Failed to submit application: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Accept Application (Exec Only)
 */
export async function acceptApplication(
	id: number,
	data: AcceptRejectDto
): Promise<OrganizerApplicationEntity> {
	return apiFetch<OrganizerApplicationEntity>(
		`/organizer-applications/${id}/accept`,
		{
			method: "PATCH",
			body: JSON.stringify(data),
		}
	);
}

/**
 * Reject Application (Exec Only)
 */
export async function rejectApplication(
	id: number,
	data: AcceptRejectDto
): Promise<OrganizerApplicationEntity> {
	return apiFetch<OrganizerApplicationEntity>(
		`/organizer-applications/${id}/reject`,
		{
			method: "PATCH",
			body: JSON.stringify(data),
		}
	);
}
