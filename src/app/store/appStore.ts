import { AppState } from "@/types/storeTypes";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice } from "./slice/authSlice";
import { createPostSlice } from "./slice/postSlice";
import { createCommentSlice } from "./slice/commentSlice";
import { createReplySlice } from "./slice/replySlice";

export const useAppStore = create<AppState>()(
  devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createPostSlice(...a),
    ...createCommentSlice(...a),
    ...createReplySlice(...a),
  }))
);
