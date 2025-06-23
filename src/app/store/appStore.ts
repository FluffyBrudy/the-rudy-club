import { AppState } from "@/types/storeTypes";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createAuthSlice } from "./slice/authSlice";
import { createPostSlice } from "./slice/postSlice";
import { createCommentSlice } from "./slice/commentSlice";
import { createReplySlice } from "./slice/replySlice";
import { USER_STORE } from "@/lib/router";

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createPostSlice(...a),
        ...createCommentSlice(...a),
        ...createReplySlice(...a),
      }),
      {
        name: USER_STORE,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ user: state.user }),
      }
    )
  )
);
