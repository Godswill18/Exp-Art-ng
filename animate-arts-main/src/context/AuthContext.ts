import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define interfaces for type safety
interface User {
  id: string;
  email: string;
  [key: string]: any; // Adjust based on actual user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  registerAdmin: (newAdmin: { email: string; password: string; [key: string]: any }) => Promise<{ success: boolean; message: string }>;
  loginAdmin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  getUser: () => Promise<User>;
  logoutAdmin: () => Promise<{ success: boolean; message?: string }>;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/';
// const API_URL = '/api'; // ---- for production

// Single store combining user context and auth state
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (user, token) => set({ user, token, isAuthenticated: true, loading: false, error: null }),

      logout: () => set({ user: null, token: null, isAuthenticated: false, loading: false, error: null }),

   registerAdmin: async (newUser) => {
        try {
          // Strip confirmPassword before sending
          const { confirmPassword, ...payload } = newUser;

          const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (res.ok) {
            // Adapt to backend's response structure
            set({ user: { id: data._id, email: data.email, ...data }, token: data.token, isAuthenticated: true, error: null });
            return { success: true, message: "User registered successfully" };
          } else {
            return { success: false, message: data.message || data.error || "User registration failed." };
          }
        } catch (error) {
          console.error("Error creating account:", error);
          return { success: false, message: "A network or server error occurred. Please try again later." };
        }
      },


      loginAdmin: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(credentials),
          });

          const data = await res.json();
          console.log("Login response:", data); // Debug log
          if (res.ok) {
            set({
              user: { id: data._id, email: data.email, ...data },
              token: data.token,
              isAuthenticated: true,
            });
            if (data.token) {
              sessionStorage.setItem("token", data.token);
            }
            return { success: true, message: "Login successful" };
          }
          set({ error: data.message || data.error || "Login failed." });
          return { success: false, message: data.message || data.error || "Login failed." };
        } catch (error) {
          const message = error instanceof Error ? error.message : "A network or server error occurred.";
          set({ error: message });
          return { success: false, message };
        } finally {
          set({ loading: false });
        }
      },

      getUser: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
          });

          if (res.status === 401) {
            set({ user: null, isAuthenticated: false });
            sessionStorage.removeItem('token');
            throw new Error('Unauthorized');
          }

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to fetch user');
          }

          set({ user: data, isAuthenticated: true });
          if (data.token) {
            sessionStorage.setItem('token', data.token);
          }
          return data;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'A network or server error occurred.';
          set({ error: message });
          sessionStorage.removeItem('token');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logoutAdmin: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });

          sessionStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
          return res.ok
            ? { success: true }
            : { success: false, message: 'Logout failed on server' };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Network error during logout.';
          set({ error: message, user: null, token: null, isAuthenticated: false });
          sessionStorage.removeItem('token');
          return { success: false, message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for storage key
      // Optionally, you can specify storage: sessionStorage or localStorage
      // storage: createJSONStorage(() => sessionStorage),
      // Optionally, you can whitelist/blacklist state keys to persist
      // partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

