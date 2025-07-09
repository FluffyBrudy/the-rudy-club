import { StateCreator } from "zustand";
import { AuthSlice } from "@/types/storeTypes";
import { USER_STORE } from "@/lib/navigation/router";
import apiClient from "@/lib/api/apiclient";

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  login: (data) => set({ user: data, isAuthenticated: true }),
  logout: async () => {
    const response = await apiClient.auth.logout();
    if (!response.error) {
      sessionStorage.removeItem(USER_STORE);
      localStorage.removeItem("accessToken");
      localStorage.removeItem(USER_STORE);
      set({ user: null, isAuthenticated: false });
    }
  },
});
