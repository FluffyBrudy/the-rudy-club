import { ReplySlice } from "@/types/storeTypes";
import { StateCreator } from "zustand";

export const createReplySlice: StateCreator<ReplySlice> = (set) => ({
  replies: [],
  setReplies: (data) => set({ replies: data }),
});
