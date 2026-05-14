import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMasterTeam, apiProyekTeam } from "@/infrastructure/api/apiMasterTeam";

const MASTER_TEAM_KEYS = {
  all: ["master-teams"] as const,
  detail: (id: string) => ["master-teams", id] as const,
};

export function useMasterTeams() {
  return useQuery({
    queryKey: MASTER_TEAM_KEYS.all,
    queryFn: async () => {
      const response = await apiMasterTeam.getAll();
      return response.data;
    },
  });
}

export function useMasterTeam(id: string) {
  return useQuery({
    queryKey: MASTER_TEAM_KEYS.detail(id),
    queryFn: async () => {
      const response = await apiMasterTeam.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateMasterTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMasterTeam.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_TEAM_KEYS.all });
    },
  });
}

export function useUpdateMasterTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; description?: string } }) =>
      apiMasterTeam.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MASTER_TEAM_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MASTER_TEAM_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteMasterTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMasterTeam.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_TEAM_KEYS.all });
    },
  });
}

export function useAssignProyekTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiProyekTeam.assign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyek-teams"] });
    }
  });
}

const PROYEK_TEAM_KEYS = {
  all: ["proyek-teams"] as const,
  byProyek: (proyekId: string) => ["proyek-teams", "proyek", proyekId] as const,
};

export function useProyekTeamByProyekId(proyekId: string) {
  return useQuery({
    queryKey: PROYEK_TEAM_KEYS.byProyek(proyekId),
    queryFn: async () => {
      const response = await apiProyekTeam.getByProyekId(proyekId);
      // Asumsi response format: { data: [...] } atau array langsung
      return response.data?.data || response.data || [];
    },
    enabled: !!proyekId,
  });
}

export function useUpdateProyekTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { teamId?: string; roleInProject?: string } }) =>
      apiProyekTeam.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYEK_TEAM_KEYS.all });
    },
  });
}

export function useDeleteProyekTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiProyekTeam.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYEK_TEAM_KEYS.all });
    },
  });
}
