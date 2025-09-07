import { apiClient } from "@/lib/apiClient";

export const notificationsService={
    
  // Notifications
  getNotifications: (params?: { page?: number; is_read?: boolean }) =>
    apiClient.get('/notifications/', { params }),

  markNotificationAsRead: (notificationId: string) =>
    apiClient.put(`/notifications/${notificationId}/read/`),

  markAllNotificationsAsRead: () =>
    apiClient.post('/notifications/mark_all_read/'),
}