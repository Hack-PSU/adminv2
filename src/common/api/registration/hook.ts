import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllRegistrations,
  getRegistration,
  createRegistration,
  updateRegistration,
  replaceRegistration,
  deleteRegistration,
} from "./provider";
import {
  RegistrationEntity,
  RegistrationCreateEntity,
  RegistrationUpdateEntity,
} from "./entity";

export const registrationQueryKeys = {
  all: (all?: boolean) =>
    ["registrations", all ? "all" : "current"] as const,
  detail: (id: number) => ["registrations", id] as const,
};

export function useAllRegistrations(all?: boolean) {
  return useQuery<RegistrationEntity[]>({
    queryKey: registrationQueryKeys.all(all),
    queryFn: () => getAllRegistrations(all),
  });
}

export function useRegistration(id: number) {
  return useQuery<RegistrationEntity>({
    queryKey: registrationQueryKeys.detail(id),
    queryFn: () => getRegistration(id),
    enabled: Boolean(id),
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistrationCreateEntity) => createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RegistrationUpdateEntity;
    }) => updateRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useReplaceRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RegistrationCreateEntity;
    }) => replaceRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}
