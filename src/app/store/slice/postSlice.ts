import { StateCreator } from "zustand";
import { PostSlice } from "@/types/storeTypes";

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
  posts: [],
  setPosts: (posts) => set({ posts: posts }),
  addPost: (post) => set((prev) => ({ posts: [post, ...prev.posts] })),
});
