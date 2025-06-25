import { AxiosInstance } from "axios";
import { TAPIResponse, ErrorResponse } from "@/lib/api/apiTypes";
import { API_ENDPOINTS } from "../config";
import type { NotificationResponse } from "@/types/apiResponseTypes";

export class NotificationService {
  constructor(private axiosInstance: AxiosInstance) {}

  async fetchNotifications(
    page = 0
  ): Promise<TAPIResponse<NotificationResponse[]>> {
    try {
      const response = await this.axiosInstance.get(
        `${API_ENDPOINTS.NOTIFICATION.FETCH}?page=${page}`
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: NotificationResponse[] };
        return { error: null, data: data.data };
      }

      return { error: "failed to fetch notifications", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to fetch notifications";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async toggleReadStatus(
    notificationId: number
  ): Promise<TAPIResponse<{ isRead: boolean }>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.NOTIFICATION.TOGGLE_READ,
        {
          notificationId: notificationId.toString(),
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: { isRead: boolean } };
        return { error: null, data: data.data };
      }

      return { error: "failed to toggle notification status", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to toggle notification status";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }

  async deleteNotifications(
    notificationIds: number[]
  ): Promise<TAPIResponse<{ count: number }>> {
    try {
      const response = await this.axiosInstance.post(
        API_ENDPOINTS.NOTIFICATION.DELETE,
        {
          notificationIds: notificationIds.map((id) => id.toString()),
        }
      );

      if ([200, 201].includes(response.status)) {
        const data = response.data as { data: { count: number } };
        return { error: null, data: data.data };
      }

      return { error: "failed to delete notifications", data: null };
    } catch (error) {
      const e = error as ErrorResponse;
      const errMsg =
        e.data?.error || e.statusText || "failed to delete notifications";
      return { error: `${e.status}:${errMsg}`, data: null };
    }
  }
}
