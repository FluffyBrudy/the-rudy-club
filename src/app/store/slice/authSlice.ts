import { StateCreator } from "zustand";
import { AuthSlice } from "@/types/storeTypes";
import { USER_STORE } from "@/lib/navigation/router";

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  login: (data) => set({ user: data, isAuthenticated: true }),
  logout: () => {
    set({ user: null });
    sessionStorage.removeItem(USER_STORE);
    localStorage.removeItem("accessToken");
    localStorage.removeItem(USER_STORE);
  },
});
