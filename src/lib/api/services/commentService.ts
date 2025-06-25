import { AxiosInstance } from "axios";
import { TAPIResponse, ErrorResponse } from "@/lib/api/apiTypes";
import { API_ENDPOINTS } from "../config";
import type {
  CommentResponse,
  CommentReplyResponse,
} from "@/types/apiResponseTypes";

export class CommentService {
  constructor(private axiosInstance: AxiosInstance) {}

  async fetchComments(
    postId: number
  ): Promise<TAPIResponse<CommentResponse[]>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.COMMENT.FETCH,
        { postId: postId.toString() }
      );

      if (response.status === 200) {
        const data = response.data as { data: CommentResponse[] };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch comments", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to fetch comments";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async createComment(
    postId: number,
    commentBody: string
  ): Promise<TAPIResponse<CommentResponse>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.COMMENT.CREATE,
        {
          postId: postId.toString(),
          commentBody,
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: CommentResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to create comment", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to create comment";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async fetchReplies(
    parentCommentId: number
  ): Promise<TAPIResponse<CommentReplyResponse[]>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.COMMENT.REPLY.FETCH,
        {
          parentCommentId: parentCommentId.toString(),
        }
      );

      if (response.status === 200) {
        const data = response.data as { data: CommentReplyResponse[] };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch replies", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to fetch replies";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async createReply(
    parentCommentId: number,
    replyContent: string
  ): Promise<TAPIResponse<CommentReplyResponse>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.COMMENT.REPLY.CREATE,
        {
          parentCommentId: parentCommentId,
          replyContent,
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: CommentReplyResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to create reply", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to create reply";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}
