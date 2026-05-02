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


// 1. Ambil Aktivitas berdasarkan Proyek (GET /aktivitas/get-all?proyekId=...)
export async function getAktivitasByProyek(
  proyekId: string
): Promise<Aktivitas[]> {
  const { data } = await apiClient.get<{ success: boolean; message: string; data: Aktivitas[] }>(
    `/aktivitas/get-all?proyekId=${proyekId}`
  );
  // Backend NestJS kita ngebungkus hasilnya di dalam object "data"
  return data.data; 
}

// 2. Bikin Aktivitas Baru (POST /aktivitas/post-aktivitas)
export async function createAktivitas(
  proyekId: string,
  payload: Partial<Aktivitas> // Pakai Partial biar frontend gampang ngirimnya
): Promise<Aktivitas> {
  const { data } = await apiClient.post<{ success: boolean; message: string; data: Aktivitas }>(
    `/aktivitas/post-aktivitas`,
    { 
      ...payload, 
      proyekId // <--- Wajib dimasukin ke dalam body biar DTO NestJS nggak teriak
    }
  );
  return data.data;
}

// 3. Update Aktivitas untuk fitur Edit (PATCH /aktivitas/update/:id)
export async function updateAktivitas(
  id: string,
  payload: Partial<Aktivitas>
): Promise<Aktivitas> {
  // Ingat, backend kita pakenya PATCH buat update
  const { data } = await apiClient.patch<{ success: boolean; message: string; data: Aktivitas }>(
    `/aktivitas/update/${id}`,
    payload
  );
  return data.data;
}

// 4. Delete Aktivitas (DELETE /aktivitas/delete/:id)
export async function deleteAktivitas(id: string): Promise<void> {
  await apiClient.delete(`/aktivitas/delete/${id}`);
}

// 5. Get Satu Aktivitas (opsional, kepake pas mau nampilin detail di form Edit)
export async function getAktivitasById(id: string): Promise<Aktivitas> {
  const { data } = await apiClient.get<{ success: boolean; data: Aktivitas }>(
    `/aktivitas/getby/${id}`
  );
  return data.data;
}



// ── Log Aktivitas ────────────────────────────────────────────────────

export async function getLogAktivitas(
  aktivitasId: string
): Promise<LogAktivitas[]> {
  const { data } = await apiClient.get(
    `/log-aktivitas/aktivitas/${aktivitasId}`
  );
  
  return data.data || data;
}

export async function tambahLogAktivitas(
  aktivitasId: string,
  payload: Omit<LogAktivitas, "id" | "aktivitasId" | "createdAt" | "updatedAt">
): Promise<LogAktivitas> {
  const { data } = await apiClient.post(
    `/log-aktivitas/post-log`,
    {
      ...payload,
      aktivitasId: aktivitasId  
    }
  );
  
  return data.data || data;
}

export async function getLogByProyek(proyekId: string): Promise<LogAktivitas[]> {
  const { data } = await apiClient.get(`/log-aktivitas/proyek/${proyekId}`);
  return data.data || data;
}
