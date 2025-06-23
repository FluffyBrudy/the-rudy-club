export interface BaseResponse {
  success: boolean;
  data?: unknown;
}

export type RegisterResponse = null;

export type LoginResponse = {
  accessToken: string;
  userId: string;
  username: string;
  email: string;
  profilePicture: string;
};

export type PostResponse = {
  authorId: string;
  postId: number;
  content: {
    textContent?: string;
    mediaContent?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  username: string;
  profilePicture: string;
  totalReaction: number;
  reactions: reactionDisplayInfo;
};

export type CommentResponse = {
  commentId: number;
  commentorId: string;
  commentBody: string;
  postId: number;
  createdAt: string;
  updatedAt?: string;
  username: string;
  profilePicture: string;
  totalReaction: number;
  reactions: reactionDisplayInfo;
};

export type ReactionResponse = {
  profilePicture: string;
  reactionOnId: number;
  reactionOnType: string;
  reactionType: string;
  reactorId: string;
  username: string;
  action: "inserted" | "updated" | "deleted";
};

export type reactionDisplayInfo = Omit<
  Omit<ReactionResponse, "action">,
  "reactionOnId" | "reactionOnType"
>[];

export type UndoReactionResponse = {
  undo: true;
  reactionOnId: number;
  reactorId: number;
  action: "inserted" | "updated" | "deleted";
};

export type CommentReplyResponse = {
  commentReplyId: number;
  createdAt: string;
  profilePicture: string;
  parentCommentId: number;
  repliedById: string;
  replyContent: string;
  updatedAt?: string;
  username: string;
  totalReaction: number;
  reactions: reactionDisplayInfo;
};

export interface NotificationResponse {
  notificationId: number;
  notificationInfo: string;
  notificationOnType: string;
  notificationOnId: number;
  createdAt: string;
  userId: string;
  isRead?: boolean;
}

export interface ConnectedFriendsResponse {
  userId: string;
  username: string;
  imageUrl: string;
}
