import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
} from "axios";
import type {
  LoginResponse,
  PostResponse,
  RegisterResponse,
} from "@/types/apiResponseTypes";

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
    REACTION_FETCH: "/api/reaction/fetch",
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
          console.log(response);
          const { data, status, statusText } = response;
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
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to login";
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
}

const apiClient = new ApiClient();

export default apiClient;
