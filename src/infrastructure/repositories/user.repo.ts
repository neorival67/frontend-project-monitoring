import { apiClient } from "../api";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/core/entities";

/**
 * Repository: User
 * Implementasi pemanggilan API untuk manajemen pengguna
 */

export async function getSemuaUser(): Promise<User[]> {
  const { data } = await apiClient.get<{ success: boolean; data?: User[] }>("/users/get-all");
  // API returns an array directly based on the spec, but let's handle if it's wrapped
  return Array.isArray(data) ? data : (data?.data || []);
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/getby/${id}`);
  return data;
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
