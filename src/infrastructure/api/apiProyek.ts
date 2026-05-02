// File: src/infrastructure/api/apiProyek.ts
import apiClient from "./apiClient";
import type { Proyek, Aktivitas, LogAktivitas, CreateProyekPayload } from "@/core/entities";

export const apiProyek = {
  // ── Proyek ───────────────────────────────────────────────────────────
  getSemuaProyek: () => 
    apiClient.get<{ success: boolean; count?: number; data: Proyek[] }>("/projects"),
  
  getProyekById: (id: string) => 
    apiClient.get<{ success: boolean; data: Proyek }>(`/projects/${id}`),
  
  createProyek: (payload: CreateProyekPayload) => 
    apiClient.post<{ success: boolean; data: Proyek }>("/projects", payload),
  
  updateProyek: (id: string, payload: Partial<CreateProyekPayload>) => 
    apiClient.put<{ success: boolean; data: Proyek }>(`/projects/${id}`, payload),
  
  deleteProyek: (id: string) => 
    apiClient.delete(`/projects/${id}`),

  // ── Aktivitas ────────────────────────────────────────────────────────
  getAktivitasByProyek: (proyekId: string) => 
    apiClient.get<Aktivitas[]>(`/proyek/${proyekId}/aktivitas`),
  
  createAktivitas: (proyekId: string, payload: Omit<Aktivitas, "id" | "proyekId" | "createdAt" | "updatedAt">) => 
    apiClient.post<Aktivitas>(`/proyek/${proyekId}/aktivitas`, payload),

  // ── Log Aktivitas ────────────────────────────────────────────────────
  getLogAktivitas: (aktivitasId: string) => 
    apiClient.get<LogAktivitas[]>(`/aktivitas/${aktivitasId}/logs`),
  
  tambahLogAktivitas: (aktivitasId: string, payload: Omit<LogAktivitas, "id" | "aktivitasId" | "createdAt">) => 
    apiClient.post<LogAktivitas>(`/aktivitas/${aktivitasId}/logs`, payload),
};