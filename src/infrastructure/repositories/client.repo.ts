import apiClient from "@/infrastructure/api/apiClient";
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
  DeleteClientResponse,
} from "@/core/entities";

/**
 * Repository: Client / Vendor
 * Fungsi-fungsi pemanggil endpoint client & vendor.
 */

// ── Get All ──────────────────────────────────────────────────────────

export async function getSemuaClient(): Promise<Client[]> {
  const { data } = await apiClient.get<{ data: Client[] }>("/clients");
  return data.data || (data as any);
}

// ── Get by ID ────────────────────────────────────────────────────────

export async function getClientById(id: string): Promise<Client> {
  const { data } = await apiClient.get<{ data: Client }>(`/clients/${id}`);
  return data.data || (data as any);
}

// ── Create ───────────────────────────────────────────────────────────

export async function createClient(
  payload: CreateClientPayload
): Promise<Client> {
  const { data } = await apiClient.post<{ data: Client }>("/clients", payload);
  return data.data || (data as any);
}

// ── Update ───────────────────────────────────────────────────────────

export async function updateClient(
  id: string,
  payload: UpdateClientPayload
): Promise<Client> {
  const { data } = await apiClient.put<{ data: Client }>(`/clients/${id}`, payload);
  return data.data || (data as any);
}

// ── Delete ───────────────────────────────────────────────────────────

export async function deleteClient(
  id: string
): Promise<DeleteClientResponse> {
  const { data } = await apiClient.delete<{ data: DeleteClientResponse }>(
    `/clients/${id}`
  );
  return data.data || (data as any);
}
