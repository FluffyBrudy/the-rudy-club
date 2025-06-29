import { AxiosInstance } from "axios";
import { TAPIResponse, ErrorResponse } from "@/lib/api/apiTypes";
import { API_ENDPOINTS } from "../config";
import type { LoginResponse, RegisterResponse } from "@/types/apiResponseTypes";

export class AuthService {
  constructor(private axiosInstance: AxiosInstance) {}

  async login(
    email: string,
    password: string
  ): Promise<TAPIResponse<LoginResponse>> {
    try {
      const response = await this.axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: LoginResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to login", data: null };
    } catch (error) {
      console.error("Login API error:", error);
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to login";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async autoLogin(): Promise<TAPIResponse<Omit<LoginResponse, "accessToken">>> {
    try {
      const response = await this.axiosInstance.get(
        API_ENDPOINTS.AUTH.AUTHORIZE
      );

      if (response.status === 200) {
        const data = response.data as {
          data: Omit<LoginResponse, "accessToken">;
        };
        return { error: null, data: data.data };
      }

      return { error: "failed to login", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to login";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<TAPIResponse<RegisterResponse>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          username,
          email,
          password,
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: RegisterResponse };
        return { error: null, data: data.data };
      }

      return { error: "failed to register", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg = e.data?.error || e.statusText || "failed to register";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}
