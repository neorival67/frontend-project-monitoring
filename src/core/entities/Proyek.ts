import type { User } from "./User";
// clientvendor
export interface ClientVendor {
  id: string;
  nama: string;
  tipe: "client" | "vendor";
  kontak: string;
  email: string;
  alamat?: string;  
}
//projectteam
export interface ProyekTeamMember {
  id: string;
  proyekId: string;
  userId: string;
  roleInProject?: string | null;
  user?: User;
}
//project
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
  activities?: Aktivitas[];
  
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
//activity
export interface Aktivitas {
  id: string;
  proyekId: string;
  nama: string;
  deskripsi: string;
  category: string;
  status: StatusAktivitas;
  tanggalMulai: string;
  tanggalSelesai: string;
  weight: number;
  progress: number;
  budget: number;
  assignees?: User[];
  logs?: LogAktivitas[];
  createdAt: string;
  updatedAt: string;
}

export type StatusAktivitas =
  | "belum_dimulai"
  | "berjalan"
  | "selesai"
  | "terlambat";
//logactivity
export interface LogAktivitas {
  id: string;
  aktivitasId: string;
  userId: string;
  description: string;   
  logDate: string;      
  progressAdded: number; 
  costIncurred?: string | number; // Dari Prisma (buat hitung Realisasi chart)
  status: string;
  createdAt: string;
}

export interface LogAktivitasPayload {
  aktivitasId: string;
  userId: string;
  description: string;
  logDate: string; 
  progressAdded: number;
  costIncurred?: number | null; 
  status: string; 
}
//deliverable
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

//approval
export interface ReviewApproval {
  id: string;
  deliverableId: string;
  reviewerId: string;
  status: "approved" | "rejected" | "pending";
  catatan?: string;
  tanggalReview: string;
}

