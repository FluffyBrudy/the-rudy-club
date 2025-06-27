import { AppState } from "@/types/storeTypes";
import { create } from "zustand";
import { createAuthSlice } from "./slice/authSlice";
import { createPostSlice } from "./slice/postSlice";
import { createCommentSlice } from "./slice/commentSlice";
import { createReplySlice } from "./slice/replySlice";

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createPostSlice(...a),
  ...createCommentSlice(...a),
  ...createReplySlice(...a),
}));
