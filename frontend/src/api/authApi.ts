import { apiOrigin, http } from "./http";
import type { AuthUser } from "../types/auth";

type ApiResponse<T> = {
  message: string;
  data: T;
};

type AuthSession = {
  authenticated: boolean;
  user: AuthUser | null;
};

export async function fetchCurrentUser() {
  const response = await http.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
}

export async function fetchAuthSession() {
  const response = await http.get<ApiResponse<AuthSession>>("/auth/session");
  return response.data.data;
}

export async function logoutCurrentUser() {
  await http.post<ApiResponse<null>>("/auth/logout");
}

export function redirectToGoogleLogin() {
  window.location.href = `${apiOrigin}/oauth2/authorization/google`;
}
