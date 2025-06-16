import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { ACCESS_TOKEN } from "./constants";
import { LoginResponse } from "@/types/apiResponseTypes";

type TLoginResponse =
  | { error: null; data: LoginResponse }
  | { error: string; data: null };
type ErrorResponse = {
  status: number;
  statusText: string;
  data: { error: string };
};

class ApiClient {
  private axiosInstance: AxiosInstance;

  private endpoints = {
    AUTH_LOGIN: "/auth/login",
    AUTH_REGISTER: "/auth/register",
  };

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
    });

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  private _initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
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
    username: string,
    password: string
  ): Promise<TLoginResponse> {
    try {
      const userLogin = await this.axiosInstance.post(
        this.endpoints.AUTH_LOGIN,
        {
          username,
          password,
        }
      );
      if ([200, 201].includes(userLogin.status)) {
        const data = userLogin.data as LoginResponse;
        return { error: null, data: data };
      } else {
        return { error: "failed to login", data: null };
      }
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data.error || e.statusText || "failed to login";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}

const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);

export default apiClient;
