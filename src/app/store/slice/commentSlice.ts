import { StateCreator } from "zustand";
import { CommentSlice } from "@/types/storeTypes";

export const createCommentSlice: StateCreator<CommentSlice> = (set) => ({
  comments: [],
  setComments: (comments) => set({ comments: comments }),
  addComment: (comment) =>
    set((prev) => ({ comments: [comment, ...prev.comments] })),
});
