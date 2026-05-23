export interface Client {
  id: string;
  type: ClientType;
  status: ClientStatus;
  industry?: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ClientType = "client" | "vendor" | "Client" | "Vendor";

export type ClientStatus = "ACTIVE" | "INACTIVE";

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

export interface DeleteClientResponse {
  message: string;
  id: string;
}
