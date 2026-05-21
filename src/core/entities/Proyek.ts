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
  | "Belum Mulai"
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
  status: LogAktivitas; 
}
//deliverable
export interface Deliverable {
  reviewApproval: ReviewApproval;
  id: string;
  proyekId: string;        
  aktivitasId?: string | null;
  title: string;           
  description?: string | null;
  status: StatusDeliverable;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[]; 
  reviews?: ReviewApproval[];
  submitter?: { id: string; name: string } | null;
}
export interface CreateDeliverablePayload {
  proyekId: string;        
  aktivitasId?: string;
  title: string;           
  description?: string;
}

export type StatusDeliverable =
  | "SUBMITTED"   
  | "APPROVED"
  | "REJECTED"
  | string;
 

//approval
export interface ReviewApproval {
  id: string;
  deliverableId: string;
  reviewerId: string;
  status: StatusApproval;
  comments?: string | null; 
  reviewDate: string;
  reviewer?: User;
  deliverable?: Deliverable;
}

export interface CreateReviewPayload {
  deliverableId: string;
  reviewerId: string;
  status: StatusApproval;
  comments?: string;
}

export interface Attachment {
  id: string;
  deliverableId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string | null;
  createdAt: string;
}

export type StatusApproval = "APPROVED" | "REJECTED" | "PENDING" ;


// closing proyek
export interface ClosingProyek {
  id: string;
  proyekId: string;
  finalReportUrl?: string | null;
  handoverDate?: string | null;
  notes?: string | null;
  status: string;
  bastUrl: string; 
  bastFileName: string;         
  createdAt: string;
  updatedAt: string;
  proyek?: Proyek;
}
 
export interface CreateClosingPayload {
  proyekId: string;
  handoverDate?: string;
  notes?: string;
}