import apiClient from "@/infrastructure/api/apiClient";
import type { Proyek, Aktivitas, LogAktivitas, CreateProyekPayload } from "@/core/entities";

/**
 * Repository: Proyek
 * Fungsi-fungsi pemanggil endpoint proyek & aktivitas.
 */

// ── Proyek ───────────────────────────────────────────────────────────

export async function getSemuaProyek(): Promise<Proyek[]> {
  const { data } = await apiClient.get<{ success: boolean; count?: number; data: Proyek[] }>("/projects");
  return data.data;
}

export async function getProyekById(id: string): Promise<Proyek> {
  const { data } = await apiClient.get<{ success: boolean; data: Proyek }>(`/projects/${id}`);
  return data.data;
}

export async function createProyek(
  payload: CreateProyekPayload
): Promise<Proyek> {
  const { data } = await apiClient.post<{ success: boolean; data: Proyek }>("/projects", payload);
  return data.data;
}

export async function updateProyek(
  id: string,
  payload: Partial<CreateProyekPayload>
): Promise<Proyek> {
  const { data } = await apiClient.put<{ success: boolean; data: Proyek }>(`/projects/${id}`, payload);
  return data.data;
}

export async function deleteProyek(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

// ── Aktivitas ────────────────────────────────────────────────────────

export async function getAktivitasByProyek(
  proyekId: string
): Promise<Aktivitas[]> {
  const { data } = await apiClient.get<Aktivitas[]>(
    `/proyek/${proyekId}/aktivitas`
  );
  return data;
}

export async function createAktivitas(
  proyekId: string,
  payload: Omit<Aktivitas, "id" | "proyekId" | "createdAt" | "updatedAt">
): Promise<Aktivitas> {
  const { data } = await apiClient.post<Aktivitas>(
    `/proyek/${proyekId}/aktivitas`,
    payload
  );
  return data;
}

// ── Log Aktivitas ────────────────────────────────────────────────────

export async function getLogAktivitas(
  aktivitasId: string
): Promise<LogAktivitas[]> {
  const { data } = await apiClient.get<LogAktivitas[]>(
    `/aktivitas/${aktivitasId}/logs`
  );
  return data;
}

export async function tambahLogAktivitas(
  aktivitasId: string,
  payload: Omit<LogAktivitas, "id" | "aktivitasId" | "createdAt">
): Promise<LogAktivitas> {
  const { data } = await apiClient.post<LogAktivitas>(
    `/aktivitas/${aktivitasId}/logs`,
    payload
  );
  return data;
}
