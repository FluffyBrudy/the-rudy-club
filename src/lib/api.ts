import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
} from "axios";
import type {
  LoginResponse,
  PostResponse,
  RegisterResponse,
  CommentResponse,
  CommentReplyResponse,
} from "@/types/apiResponseTypes";
import {
  ReactionResponse,
  UndoReactionResponse,
} from "@/types/apiResponseTypes";
import { USER_STORE } from "./constants";

type TAPIResponse<T> = { error: null; data: T } | { error: string; data: null };
type ErrorResponse = {
  status: number;
  statusText: string;
  data: { error: string };
};

class ApiClient {
  private axiosInstance: AxiosInstance;

  private endpoints = {
    AUTH_LOGIN: "/api/auth/login",
    AUTH_REGISTER: "/api/auth/register",
    AUTH_AUTHORIZE: "/api/auth/authorize",

    POST_CREATE: "/api/post/create",
    POST_FETCH: "/api/post/fetch",

    COMMENT_CREATE: "/api/comment/create",
    COMMENT_FETCH: "/api/comment/fetch",
    COMMENT_REPLY_CREATE: "/api/comment/reply/create",
    COMMENT_REPLY_FETCH: "/api/comment/reply/fetch",

    REACTION_CREATE: "/api/reaction/create",
  };

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "",
      withCredentials: true,
    });

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  private _initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private _initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const response = error.response;
        if (response) {
          const { data, status, statusText } = response;
          if (data && (data as { error: string }).error === "jwt expired") {
            sessionStorage.removeItem(USER_STORE);
          }
          return Promise.reject({ data, status, statusText });
        } else {
          return Promise.reject({ data: { error: "connection error" } });
        }
      }
    );
  }

  public get instance(): AxiosInstance {
    return this.axiosInstance;
  }

  public async loginUser(
    email: string,
    password: string
  ): Promise<TAPIResponse<LoginResponse>> {
    try {
      const userLogin = await this.axiosInstance.post(
        this.endpoints.AUTH_LOGIN,
        {
          email,
          password,
        }
      );

      if ([200, 201].includes(userLogin.status)) {
        const data = userLogin.data as { data: LoginResponse };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to login", data: null };
      }
    } catch (error) {
      console.error("Login API error:", error);
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to login";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async autoLoginUser(): Promise<
    TAPIResponse<Omit<LoginResponse, "accessToken">>
  > {
    try {
      const autoLogin = await this.axiosInstance.get(
        this.endpoints.AUTH_AUTHORIZE
      );
      if (autoLogin.status === 200) {
        const data = autoLogin.data as {
          data: Omit<LoginResponse, "accessToken">;
        };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to login", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to login";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<TAPIResponse<RegisterResponse>> {
    try {
      const userLogin = await this.axiosInstance.post(
        this.endpoints.AUTH_REGISTER,
        {
          username,
          email,
          password,
        }
      );
      if ([200, 201].includes(userLogin.status)) {
        const data = userLogin.data as { data: RegisterResponse };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to register", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to register";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async fetchPosts() {
    const response = await this.axiosInstance.get(this.endpoints.POST_FETCH);
    if (response.status === 200) {
      const data = response.data as { data: PostResponse[] };
      return { error: null, data: data.data };
    } else {
      return { error: "failed to fetch post", data: null };
    }
  }

  public async createPost(contents: {
    textContent?: string;
    mediaContent?: string[];
  }): Promise<TAPIResponse<PostResponse>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.POST_CREATE,
        { contents }
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: PostResponse };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to create post", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to create post";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async fetchComments(
    postId: number
  ): Promise<TAPIResponse<CommentResponse[]>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.COMMENT_FETCH,
        { postId: postId.toString() }
      );
      if (response.status === 200) {
        const data = response.data as { data: CommentResponse[] };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to fetch comments", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to fetch comments";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async createComment(
    postId: number,
    commentBody: string
  ): Promise<TAPIResponse<CommentResponse>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.COMMENT_CREATE,
        {
          postId: postId.toString(),
          commentBody,
        }
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: CommentResponse };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to create comment", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to create comment";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async fetchReplies(
    parentCommentId: number
  ): Promise<TAPIResponse<CommentReplyResponse[]>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.COMMENT_REPLY_FETCH,
        {
          parentCommentId: parentCommentId.toString(),
        }
      );
      if (response.status === 200) {
        const data = response.data as { data: CommentReplyResponse[] };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to fetch replies", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to fetch replies";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async createReply(
    parentCommentId: number,
    replyContent: string
  ): Promise<TAPIResponse<CommentReplyResponse>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.COMMENT_REPLY_CREATE,
        {
          parentCommentId: parentCommentId,
          replyContent,
        }
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: CommentReplyResponse };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to create reply", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to create reply";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  public async createReaction(
    reactionOnId: string,
    reactionOnType: string,
    reactionType: string
  ): Promise<TAPIResponse<ReactionResponse | UndoReactionResponse>> {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.REACTION_CREATE,
        {
          reactionOnId,
          reactionOnType,
          reactionType,
        }
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: ReactionResponse | UndoReactionResponse;
        };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to create reaction", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to create reaction";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}

const apiClient = new ApiClient();

export default apiClient;
