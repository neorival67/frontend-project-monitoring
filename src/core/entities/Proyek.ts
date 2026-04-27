/**
 * Entity: Proyek
 * Representasi proyek dalam sistem monitoring.
 */

import type { ClientVendor } from "./index";
import type { User } from "./User";

export interface ProyekTeamMember {
  id: string;
  proyekId: string;
  userId: string;
  roleInProject?: string | null;
  user?: User;
}

export interface Proyek {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: StatusProyek;
  startDate: string;
  endDate: string;
  budget: string | number;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client?: ClientVendor;
  vendors?: ClientVendor[];
  teams?: ProyekTeamMember[];
  
  // UI Specific or computed fields (can be optional if not from API)
  progres?: number;
}

export interface CreateProyekPayload {
  nameProyek: string;
  description: string;
  objectives: string;
  idClient: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  vendorIds: string[];
  teamMemberIds: string[];
}


export type StatusProyek =
  | "inisiasi"
  | "perencanaan"
  | "pelaksanaan"
  | "penutupan"
  | "ONGOING"
  | "berjalan"
  | "selesai"
  | "terhenti"
  | string;

export interface Aktivitas {
  id: string;
  proyekId: string;
  nama: string;
  deskripsi: string;
  status: StatusAktivitas;
  tanggalMulai: string;
  tanggalSelesai: string;
  bobot: number;
  progres: number;
  createdAt: string;
  updatedAt: string;
}

export type StatusAktivitas =
  | "belum_dimulai"
  | "berjalan"
  | "selesai"
  | "terlambat";

export interface LogAktivitas {
  id: string;
  aktivitasId: string;
  deskripsi: string;
  tanggal: string;
  userId: string;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  aktivitasId: string;
  nama: string;
  file?: string;
  status: StatusDeliverable;
  createdAt: string;
  updatedAt: string;
}

export type StatusDeliverable = "draft" | "submitted" | "approved" | "rejected";

export interface ReviewApproval {
  id: string;
  deliverableId: string;
  reviewerId: string;
  status: "approved" | "rejected" | "pending";
  catatan?: string;
  tanggalReview: string;
}

export interface PenilaianResiko {
  id: string;
  proyekId: string;
  deskripsi: string;
  tingkat: "rendah" | "sedang" | "tinggi" | "kritis";
  mitigasi: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientVendor {
  id: string;
  nama: string;
  tipe: "client" | "vendor";
  kontak: string;
  email: string;
  alamat?: string;
}
