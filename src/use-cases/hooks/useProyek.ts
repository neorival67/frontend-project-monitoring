"use client";
import apiClient from "@/infrastructure/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as proyekRepo from "@/infrastructure/repositories/proyek.repo";
import type { Proyek, CreateProyekPayload } from "@/core/entities";


const PROYEK_QUERY_KEY = ["proyek"] as const;

export function useSemuaProyek() {
  return useQuery({
    queryKey: PROYEK_QUERY_KEY,
    queryFn: proyekRepo.getSemuaProyek,
  });
}

export function useProyekDetail(id: string) {
  return useQuery({
    queryKey: [...PROYEK_QUERY_KEY, id],
    queryFn: () => proyekRepo.getProyekById(id),
    enabled: !!id,
  });
}

export function useCreateProyek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProyekPayload) =>
      proyekRepo.createProyek(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYEK_QUERY_KEY });
    },
  });
}

export function useUpdateProyek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProyekPayload> }) =>
      proyekRepo.updateProyek(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYEK_QUERY_KEY });
    },
  });
}

export function useDeleteProyek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proyekRepo.deleteProyek(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYEK_QUERY_KEY });
    },
  });
}
