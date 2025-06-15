import { StateCreator } from "zustand";
import { AuthSlice } from "@/types/storeTypes";

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  login: (data) => set({ user: data }),
  logout: () => {
    set({ user: null });
    localStorage.removeItem("app-store");
  },
});
