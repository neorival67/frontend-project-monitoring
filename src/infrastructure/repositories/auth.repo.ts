import apiClient from "@/infrastructure/api/apiClient";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  AcceptInvitePayload,
  AcceptInviteResponse,
} from "@/core/entities";

/**
 * Repository: Auth
 * Fungsi-fungsi pemanggil endpoint autentikasi.
 */

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return data;
}

export async function acceptInvite(
  payload: AcceptInvitePayload
): Promise<AcceptInviteResponse> {
  const { data } = await apiClient.post<AcceptInviteResponse>(
    "/auth/accept-invite",
    payload
  );
  return data;
}
