import type { User } from "./User";

export interface PenilaianResiko {
  id: string;
  proyekId: string;
  riskName: string;
  kategori?: string | null;
  ownerId?: string | null;
  owner?: User | null;
  status: string;
  impact: number;
  probability: number;
  score: number;
  level: string;
  mitigation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskPayload {
  proyekId: string;
  riskName: string;
  impact: number;
  probability: number;
  mitigation?: string;
  ownerId?: string;
  kategori: string;
}