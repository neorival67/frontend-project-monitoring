/**
 * Entity: Client / Vendor
 * Representasi data client atau vendor dalam sistem monitoring.
 */

export interface Client {
  id: string;
  type: ClientType;
  name: string;
  industry?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt?: string;
}

export type ClientType = "client" | "vendor";

export type ClientStatus = "ACTIVE" | "INACTIVE";

// ── Request Types ────────────────────────────────────────────────────

export interface CreateClientPayload {
  type?: ClientType;
  name: string;
  industry?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: ClientStatus;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

// ── Response Types ───────────────────────────────────────────────────

export interface DeleteClientResponse {
  message: string;
  id: string;
}
