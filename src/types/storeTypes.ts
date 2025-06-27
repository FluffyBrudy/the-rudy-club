import {
  LoginResponse,
  PostResponse,
  CommentResponse,
  CommentReplyResponse,
} from "@/types/apiResponseTypes";

export type User = Omit<LoginResponse, "accessToken">;
export type AuthSlice = {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
};

export type PostSlice = {
  posts: PostResponse[];
  setPosts: (posts: PostResponse[]) => void;
  addPost: (post: PostResponse) => void;
};

export type CommentSlice = {
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  addComment: (comment: CommentResponse) => void;
};

export type ReplySlice = {
  replies: CommentReplyResponse[];
  setReplies: (replies: CommentReplyResponse[]) => void;
};

export type AppState = AuthSlice & PostSlice & CommentSlice & ReplySlice;
