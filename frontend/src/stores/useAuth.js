// src/stores/useAuth.js
import { create } from "zustand";
import { setAccessToken, clearAccessToken } from "../lib/auth";
import api from "../lib/api";


export const useAuth = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  loginWithAccessToken: (token, user) => {
    setAccessToken(token);
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      
    }
    clearAccessToken();
    set({ user: null, isAuthenticated: false });
  },
}));
