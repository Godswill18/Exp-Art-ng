import { create } from "zustand";
import { ApiError, getErrorMessage, setUnauthorizedHandler } from "@/lib/api";
import { authService } from "@/services/authService";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

/**
 * unknown / checking – session not verified yet
 * authenticated      – backend confirmed a valid session
 * unauthenticated    – no session, expired, or role not permitted
 */
export type AuthStatus = "unknown" | "checking" | "authenticated" | "unauthenticated";

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
  loginAdmin: (credentials: { email: string; password: string }) => Promise<AuthResult>;
  logoutAdmin: () => Promise<AuthResult>;
  checkSession: () => Promise<boolean>;
  expireSession: () => void;
}

/**
 * Optional UI-level role gate (VITE_ALLOWED_ROLES="admin,superadmin").
 * Empty means "no frontend role check": the backend is the only authority and
 * rejects unauthorised API calls regardless of what this UI shows.
 */
const ALLOWED_ROLES = (import.meta.env.VITE_ALLOWED_ROLES ?? "")
  .split(",")
  .map((r: string) => r.trim().toLowerCase())
  .filter(Boolean);

function roleAllowed(user: AuthUser): boolean {
  if (ALLOWED_ROLES.length === 0) return true;
  return !!user.role && ALLOWED_ROLES.includes(user.role.toLowerCase());
}

function toUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const nested = (raw.user && typeof raw.user === "object" ? raw.user : raw) as Record<string, unknown>;
  if (typeof nested.email !== "string") return null;
  const id = nested._id ?? nested.id;
  return {
    id: typeof id === "string" ? id : "",
    email: nested.email,
    name: typeof nested.name === "string" ? nested.name : undefined,
    role: typeof nested.role === "string" ? nested.role : undefined,
  };
}

/** Remove token data written by earlier versions of the old in-site admin. */
function clearLegacyAuthStorage() {
  try {
    window.localStorage.removeItem("auth-storage");
    window.sessionStorage.removeItem("token");
  } catch {
    /* storage unavailable */
  }
}

let sessionCheck: Promise<boolean> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "unknown",
  loading: false,
  error: null,

  loginAdmin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const user = toUser(await authService.login(credentials));
      if (!user) throw new ApiError("Unexpected response from the server.", 200, "unknown");
      if (!roleAllowed(user)) {
        await authService.logout().catch(() => undefined);
        throw new ApiError("This account is not permitted to use the admin dashboard.", 403, "forbidden");
      }
      set({ user, status: "authenticated", loading: false });
      return { success: true, message: "Login successful" };
    } catch (error) {
      const message = getErrorMessage(error, "Login failed.");
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  checkSession: () => {
    if (sessionCheck) return sessionCheck;
    set({ status: "checking", loading: true, error: null });
    sessionCheck = (async () => {
      try {
        const user = toUser(await authService.me());
        if (!user || !roleAllowed(user)) throw new ApiError("No active session.", 401, "unauthorized");
        set({ user, status: "authenticated", loading: false });
        return true;
      } catch (error) {
        const expected = error instanceof ApiError && error.kind === "unauthorized";
        set({
          user: null,
          status: "unauthenticated",
          loading: false,
          error: expected ? null : getErrorMessage(error),
        });
        return false;
      } finally {
        sessionCheck = null;
      }
    })();
    return sessionCheck;
  },

  logoutAdmin: async () => {
    set({ loading: true, error: null });
    let result: AuthResult = { success: true, message: "Logged out" };
    try {
      await authService.logout();
    } catch (error) {
      result = { success: false, message: getErrorMessage(error, "Logout failed on the server.") };
    }
    clearLegacyAuthStorage();
    set({ user: null, status: "unauthenticated", loading: false });
    return result;
  },

  expireSession: () => {
    if (get().status === "unauthenticated") return;
    set({ user: null, status: "unauthenticated", loading: false });
  },
}));

// Any 401 from an authenticated API call ends the session in the UI.
setUnauthorizedHandler(() => useAuthStore.getState().expireSession());
clearLegacyAuthStorage();
