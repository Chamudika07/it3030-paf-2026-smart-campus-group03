import { http } from "./http";
import type { AppNotification } from "../types/notification";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export async function fetchNotifications() {
  const response = await http.get<ApiResponse<AppNotification[]>>("/notifications");
  return response.data.data;
}

export async function fetchUnreadNotificationCount() {
  const response = await http.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
  return response.data.data.count;
}

export async function markNotificationAsRead(notificationId: number) {
  const response = await http.patch<ApiResponse<AppNotification>>(`/notifications/${notificationId}/read`);
  return response.data.data;
}

export async function markAllNotificationsAsRead() {
  await http.patch<ApiResponse<null>>("/notifications/read-all");
}
