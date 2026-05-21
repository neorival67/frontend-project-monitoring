/**
 * Entity: User
 * Representasi pengguna dalam sistem monitoring proyek.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  departemen?: string;
  phone?: string;
  position?: string;
  skills?: string[];
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserApproval {
  ReviewerId: User;
  name: User;
  email: User;
  role : UserRole;
  status: User;
  companyId: User;
}

export type UserRole = "ADMIN" | "PM" | "VENDOR" | "TIM" | "CLIENT";

export type UserStatus = "ACTIVE" | "PENDING" | "INACTIVE";

/** Role yang diizinkan mendaftar mandiri */
export type RegisterableRole = Extract<UserRole, "ADMIN" | "PM">;

// ── Auth Request Types ───────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterableRole;
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole | string;
  departemen?: string;
  phone?: string;
  position?: string;
  skills?: string[];
  companyId?: string;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  status?: UserStatus | string;
  departemen?: string;
  phone?: string;
  position?: string;
  skills?: string[];
  companyId?: string;
}

// ── Auth Response Types ──────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AcceptInviteResponse {
  message: string;
  user: User;
}

// ── API Error Response ───────────────────────────────────────────────

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
