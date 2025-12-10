import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllApplications,
	getApplicationsByTeam,
	getApplicationById,
	submitApplication,
	acceptApplication,
	rejectApplication,
} from "./provider";
import {
	OrganizerApplicationEntity,
	OrganizerTeam,
	AcceptRejectDto,
} from "./entity";

export const organizerApplicationQueryKeys = {
	all: ["organizer-applications"] as const,
	byTeam: (team: OrganizerTeam) =>
		["organizer-applications", "team", team] as const,
	detail: (id: number) => ["organizer-applications", id] as const,
};

/**
 * Get All Applications (Exec Only)
 */
export function useAllApplications() {
	return useQuery<OrganizerApplicationEntity[]>({
		queryKey: organizerApplicationQueryKeys.all,
		queryFn: () => getAllApplications(),
	});
}

/**
 * Get Applications by Team (Team Members)
 */
export function useApplicationsByTeam(team: OrganizerTeam) {
	return useQuery({
		queryKey: organizerApplicationQueryKeys.byTeam(team),
		queryFn: () => getApplicationsByTeam(team),
		enabled: Boolean(team),
	});
}

/**
 * Get Single Application (Team Members)
 */
export function useApplication(id: number) {
	return useQuery<OrganizerApplicationEntity>({
		queryKey: organizerApplicationQueryKeys.detail(id),
		queryFn: () => getApplicationById(id),
		enabled: Boolean(id),
	});
}

/**
 * Submit Application (Public)
 */
export function useSubmitApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (formData: FormData) => submitApplication(formData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: organizerApplicationQueryKeys.all,
			});
		},
	});
}

/**
 * Accept Application (Exec Only)
 */
export function useAcceptApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: AcceptRejectDto }) =>
			acceptApplication(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({
				queryKey: organizerApplicationQueryKeys.all,
			});
			queryClient.invalidateQueries({
				queryKey: organizerApplicationQueryKeys.detail(updated.id),
			});
		},
	});
}

/**
 * Reject Application (Exec Only)
 */
export function useRejectApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: AcceptRejectDto }) =>
			rejectApplication(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({
				queryKey: organizerApplicationQueryKeys.all,
			});
			queryClient.invalidateQueries({
				queryKey: organizerApplicationQueryKeys.detail(updated.id),
			});
		},
	});
}
