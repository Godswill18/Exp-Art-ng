import { apiRequest } from "@/lib/api";

/** Raw auth payloads; the token (if any) is deliberately never read. */
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<unknown>("/api/auth/login", {
      method: "POST",
      json: credentials,
      suppressUnauthorizedHandler: true,
    }),
  me: () => apiRequest<unknown>("/api/auth/me", { suppressUnauthorizedHandler: true }),
  logout: () => apiRequest("/api/auth/logout", { method: "POST", suppressUnauthorizedHandler: true }),
};
