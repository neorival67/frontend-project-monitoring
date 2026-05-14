import apiClient from "./apiClient";

export interface MasterTeam {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const apiMasterTeam = {
  getAll: () => apiClient.get<MasterTeam[]>("/master-team/getall"),
  getById: (id: string) => apiClient.get<MasterTeam>(`/master-team/${id}`),
  create: (payload: { name: string; description: string }) =>
    apiClient.post<MasterTeam>("/master-team/post-team", payload),
  update: (id: string, payload: { name?: string; description?: string }) =>
    apiClient.patch<MasterTeam>(`/master-team/${id}`, payload),
  delete: (id: string) => apiClient.delete(`/master-team/${id}`),
};

export const apiProyekTeam = {
  getAll: () => apiClient.get("/proyek-team/getall-proyek-team"),
  getByProyekId: (proyekId: string) => apiClient.get(`/proyek-team/project-team/${proyekId}`),
  assign: (payload: {
    proyekId: string;
    userId: string;
    teamId?: string;
    roleInProject: string;
  }) => apiClient.post("/proyek-team/assign", payload),
  update: (id: string, payload: { teamId?: string; roleInProject?: string }) => 
    apiClient.patch(`/proyek-team/${id}`, payload),
  delete: (id: string) => apiClient.delete(`/proyek-team/${id}`),
};
