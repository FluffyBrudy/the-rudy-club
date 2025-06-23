import { StateCreator } from "zustand";
import { AuthSlice } from "@/types/storeTypes";
import { USER_STORE } from "@/lib/router";

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  login: (data) => set({ user: data }),
  logout: () => {
    set({ user: null });
    sessionStorage.removeItem(USER_STORE);
    localStorage.removeItem("accessToken");
    localStorage.removeItem(USER_STORE);
  },
});
