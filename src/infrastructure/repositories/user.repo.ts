import { apiClient } from "../api";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/core/entities";

/**
 * Repository: User
 * Implementasi pemanggilan API untuk manajemen pengguna
 */

/**
 * Normalisasi field dari API:
 * - Backend mungkin mengembalikan `department` (English) → map ke `departemen`
 * - Handles nested `data` wrapper
 */
function normalizeUser(raw: any): User {
  return {
    ...raw,
    // Normalize: department (English) → departemen (Indonesian)
    departemen: raw.departemen ?? raw.department ?? undefined,
    // Normalize: phone variations
    phone: raw.phone ?? raw.phoneNumber ?? raw.phone_number ?? undefined,
  } as User;
}

function normalizeUsers(raws: any[]): User[] {
  return raws.map(normalizeUser);
}

export async function getSemuaUser(): Promise<User[]> {
  const { data } = await apiClient.get<any>("/users/get-all");
  const arr = Array.isArray(data) ? data : (data?.data || []);
  return normalizeUsers(arr);
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<any>(`/users/getby/${id}`);
  // unwrap jika terbungkus { data: User }
  const raw = data?.data ?? data;
  return normalizeUser(raw);
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/users/post", payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.put<User>(`/users/put/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<{ message: string; id: string }> {
  const { data } = await apiClient.delete<{ message: string; id: string }>(`/users/delete/${id}`);
  return data;
}
