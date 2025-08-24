import { AxiosInstance } from "axios";
import { TAPIResponse, ErrorResponse } from "@/lib/api/apiTypes";
import { API_ENDPOINTS } from "../config";
import type { PostResponse } from "@/types/apiResponseTypes";
import { UploadService } from "./uploadService";

export class PostService {
  constructor(
    private axiosInstance: AxiosInstance,
    private uploadService: UploadService
  ) {}

  async fetchPosts(): Promise<TAPIResponse<PostResponse[]>> {
    try {
      const response = await this.axiosInstance.get(API_ENDPOINTS.POST.FETCH);

      if (response.status === 200) {
        const data = response.data as { data: PostResponse[] };
        return {
          error: null,
          data: data.data.sort(
            (a, b) => b.reactions.length - a.reactions.length
          ),
        };
      }

      return { error: "failed to fetch posts", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to fetch posts";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async fetchPostById(
    postId: PostResponse["postId"] | string
  ): Promise<TAPIResponse<PostResponse>> {
    try {
      const response = await this.axiosInstance.get(
        `${API_ENDPOINTS.POST.FETCH}/${postId}`
      );

      if (response.status === 200) {
        const data = response.data as { data: PostResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch post", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to fetch post";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async fetchPostByUserId(
    userId: string
  ): Promise<TAPIResponse<PostResponse[]>> {
    try {
      const response = await this.axiosInstance.get(
        `${API_ENDPOINTS.POST.FETCH_USER_POST}/${userId}`
      );

      if (response.status === 200) {
        const data = response.data as { data: PostResponse[] };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch post", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to fetch post";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async createPost(contents: {
    textContent?: string;
    mediaContent?: string[];
  }): Promise<TAPIResponse<PostResponse>> {
    try {
      if (contents.mediaContent) {
        const uploadedUrls = await this.uploadService.uploadMultipleParallel(
          contents.mediaContent
        );
        contents.mediaContent = uploadedUrls;
      }

      const response = await this.axiosInstance.post(
        API_ENDPOINTS.POST.CREATE,
        { contents }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: PostResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to create post", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to create post";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}
