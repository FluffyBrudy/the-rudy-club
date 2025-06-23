import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type {
  LoginResponse,
  PostResponse,
  RegisterResponse,
  CommentResponse,
  CommentReplyResponse,
  NotificationResponse,
} from "@/types/apiResponseTypes";
import {
  ReactionResponse,
  UndoReactionResponse,
} from "@/types/apiResponseTypes";

type TAPIResponse<T> = { error: null; data: T } | { error: string; data: null };
type ErrorResponse = {
  status: number;
  statusText: string;
  data: { error: string };
};
type SignatureResponseData = { signature: string; timestamp: number };
type SignatureResult = Promise<[SignatureResponseData | null, string | null]>;

class ApiClient {
  private axiosInstance: AxiosInstance;
  private _pendingRequest = [] as InternalAxiosRequestConfig[];
  private pigeonBaseUrl = process.env.NEXT_PUBLIC_PIGEON_API_URL!;

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

    NOTIFICATION_FETCH: "/api/notification/fetch", //get
    NOTIFICATION_DELETE: "/api/notification/delete", //post body = array[number=id]
    NOTIFICATION_TOGGLE_READ_STATUS: "/api/notification/toggle-read",

    SOCIAL_FRIENDS_SEARCH: `${this.pigeonBaseUrl}/api/social/friends/search`,
    SOCIAL_FRIEND_REQUEST: `${this.pigeonBaseUrl}/api/social/friends/requests`,
    SOCIAL_PENDING_REQUESTS: `${this.pigeonBaseUrl}/api/social/friends/requests/pending`,
    SOCIAL_ACCEPTED_REQUESTS: `${this.pigeonBaseUrl}/api/social/friends/requests/accepted`,
    SOCIAL_ACCEPT_REQUEST: `${this.pigeonBaseUrl}/api/social/friends/requests/accept`,
    SOCIAL_REJECT_REQUEST: `${this.pigeonBaseUrl}/api/social/friends/requests/reject`,

    CHAT_MESSAGE_CREATE: `${this.pigeonBaseUrl}/api/chat/message/create`,
    CHAT_MESSAGE_FETCH: `${this.pigeonBaseUrl}/api/chat/message/fetch`,
    CHAT_LATEST_SINGLE_MESSAGES: `${this.pigeonBaseUrl}/api/chat/message/fetch/latest`,

    PREF_PROFILE_SIGNATURE: `${this.pigeonBaseUrl}/api/preference/profile/signature`,
    PREF_PROFILE_IMAGE: `${this.pigeonBaseUrl}/api/preference/profile/image`,
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
            // todo: refresh token later
          }
          return Promise.reject({ data, status, statusText });
        } else {
          return Promise.reject({ data: { error: "connection error" } });
        }
      }
    );
  }

  private _addFailedRequest(request: InternalAxiosRequestConfig) {
    this._pendingRequest.push(request);
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
      if (contents.mediaContent) {
        const response = await this.uploadMultipleParallel(
          contents.mediaContent
        );
        console.log(process.env.NEXT);
        console.log(response, "***");
        contents.mediaContent = response;
      }
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

  public async fetchNotifications(page = 0) {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoints.NOTIFICATION_FETCH}?page=${page}`
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: NotificationResponse[];
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

  public async toggleNotificationReadStatus(notificationId: number) {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.NOTIFICATION_TOGGLE_READ_STATUS,
        {
          notificationId: notificationId.toString(),
        }
      ); //todo: change to patch later not post, modify server router
      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: { isRead: boolean };
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

  public async deleteNotification(notificationIds: number[]) {
    try {
      const response = await this.axiosInstance.post(
        this.endpoints.NOTIFICATION_DELETE,
        {
          notificationIds: notificationIds.map((id) => id.toString()),
        }
      ); //todo: change to patch later not post, modify server router
      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: { count: number };
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

  public async RetriveConnectedFriends() {
    try {
      const response = await axios.post(
        `{https://pigeon-messanger.vercel.app}${this.endpoints.SOCIAL_ACCEPTED_REQUESTS}`
      );
      if ([200, 201].includes(response.status)) {
        const data = response.data as {
          data: unknown;
        };
        return { error: null, data: data.data };
      } else {
        return { error: "failed to create reaction", data: null };
      }
    } catch (error) {
      console.log(error);
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to fetch friends";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  private async generatePrefProfileSignature(): SignatureResult {
    try {
      const response = await fetch(this.endpoints.PREF_PROFILE_SIGNATURE, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = (await response.json()) as Record<
        "data",
        SignatureResponseData
      >;

      return [data.data, null];
    } catch (error) {
      console.error((error as AxiosError).response?.headers);
      return [null, (error as Error).message];
    }
  }

  public async uploadImage(fileOrHtmlString: string | File) {
    let file: File;
    if (typeof fileOrHtmlString === "string") {
      const blob = new Blob([fileOrHtmlString], {
        type: "image/svg+xml;charset=utf-8",
      });
      file = new File([blob], Math.random().toString(8) + ".svg", {
        type: blob.type,
      });
    } else {
      file = fileOrHtmlString;
    }

    const [data, error] = await this.generatePrefProfileSignature();
    if (!data || error) return error;

    const { signature, timestamp } = data!;
    const fileType = file.type.startsWith("video") ? "video" : "image";

    const signatureGenerationKey = process.env.NEXT_PUBLIC_MEDIA_CLOUD_API_KEY;
    const uploadUrl = process.env.NEXT_PUBLIC_MEDIA_CLOUD_URL;
    console.log(signatureGenerationKey, uploadUrl);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureGenerationKey!);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", "pigeon-messanger");
    formData.append("resource_type", fileType);

    try {
      const url =
        fileType === "video"
          ? uploadUrl!.replace("image", "video")
          : uploadUrl!;
      const resImg = await axios.post(url, formData);

      return resImg.data.secure_url;
    } catch (error) {
      const err = error as AxiosResponse;
      console.error(err.data.error);
      return null;
    }
  }

  public async uploadMultipleParallel(
    files: (File | string)[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => !!url) as string[];
  }
}

const apiClient = new ApiClient();

export default apiClient;
