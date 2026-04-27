import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepo } from "@/infrastructure/repositories";
import type { CreateUserPayload, UpdateUserPayload } from "@/core/entities";

/**
 * Hook: useUser
 * Hooks untuk manajemen pengguna (Master Tim)
 */

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useSemuaUser() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.all,
    queryFn: userRepo.getSemuaUser,
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userRepo.getUserById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userRepo.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userRepo.updateUser(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userRepo.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}
