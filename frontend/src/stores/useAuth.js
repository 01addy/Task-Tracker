// src/stores/useAuth.js
import { create } from "zustand";
import { setAccessToken, clearAccessToken } from "../lib/auth";
import api from "../lib/api";

/**
 * IMPORTANT:
 * Do NOT read localStorage or call getAccessToken() at module load time.
 * Keep initial state server-safe. AuthInitializer will hydrate the real state on mount.
 */
export const useAuth = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false, // server-safe default
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  loginWithAccessToken: (token, user) => {
    setAccessToken(token);
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // ignore network errors
    }
    clearAccessToken();
    set({ user: null, isAuthenticated: false });
  },
}));
