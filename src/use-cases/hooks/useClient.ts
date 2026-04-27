"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as clientRepo from "@/infrastructure/repositories/client.repo";
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from "@/core/entities";

/**
 * Hook: useClient
 * Mengelola state data client / vendor.
 */

const CLIENT_QUERY_KEY = ["clients"] as const;

export function useSemuaClient() {
  return useQuery({
    queryKey: CLIENT_QUERY_KEY,
    queryFn: clientRepo.getSemuaClient,
  });
}

export function useClientDetail(id: string) {
  return useQuery({
    queryKey: [...CLIENT_QUERY_KEY, id],
    queryFn: () => clientRepo.getClientById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) =>
      clientRepo.createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEY });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientPayload;
    }) => clientRepo.updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEY });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientRepo.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEY });
    },
  });
}
