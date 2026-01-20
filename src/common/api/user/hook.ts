import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  replaceUser,
  deleteUser,
  getUserResume,
  getAllResumes,
} from "./provider";
import { UserEntity } from "./entity";

export const userQueryKeys = {
  all: (active?: boolean) => ["users", active ?? "all"] as const,
  detail: (id: string) => ["user", id] as const,
};

export function useAllUsers(active?: boolean) {
  return useQuery<UserEntity[]>({
    queryKey: userQueryKeys.all(active),
    queryFn: () => getAllUsers(active),
  });
}

export function useUser(id: string) {
  return useQuery<UserEntity>({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newData: Omit<UserEntity, "id">) => createUser(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<UserEntity, "id">>;
    }) => updateUser(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(updated.id),
      });
    },
  });
}

export function useReplaceUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<UserEntity, "id"> }) =>
      replaceUser(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(updated.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUserResume(id: string) {
  return useQuery<Blob>({
    queryKey: ["user", id, "resume"],
    queryFn: () => getUserResume(id),
    enabled: Boolean(id),
  });
}

export function useAllResumes() {
  return useQuery<Blob>({
    queryKey: ["users", "resumes"],
    queryFn: () => getAllResumes(),
    enabled: false, // Don't fetch on page load
  });
}
