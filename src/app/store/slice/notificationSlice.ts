import { StateCreator } from "zustand";

export interface Notification {
  notificationId: number;
  notificationInfo: string;
  isRead: boolean;
  notificationOnType: string;
  notificationOnId: number;
  createdAt: string;
}

export interface NotificationSlice {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (
  set
) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.notificationId !== id),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.notificationId === id ? { ...n, isRead: true } : n
      ),
    })),
});
