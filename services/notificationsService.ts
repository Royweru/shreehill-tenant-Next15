import { apiClient } from "@/lib/apiClient";

export const notificationsService = {
  // Get notifications with filtering and pagination
  getNotifications: (params?: { 
    page?: number; 
    is_read?: boolean;
    notification_type?: string;
    priority_level?: string;
    search?: string;
  }) => apiClient.get<NotificationsResponse>('/notifications/', { params }),

  // Get single notification detail
  getNotification: (id: string) => 
    apiClient.get<Notification>(`/notifications/${id}/`),

  // Mark notification as read
  markNotificationAsRead: (notificationId: string) =>
    apiClient.post(`/notifications/${notificationId}/mark_read/`),

  // Mark notification as unread
  markNotificationAsUnread: (notificationId: string) =>
    apiClient.post(`/notifications/${notificationId}/mark_unread/`),

  // Mark all notifications as read
  markAllNotificationsAsRead: () =>
    apiClient.post('/notifications/mark_all_read/'),

  // Bulk actions on notifications
  bulkAction: (data: { notification_ids: string[]; action: 'mark_read' | 'mark_unread' | 'delete' }) =>
    apiClient.post('/notifications/bulk_action/', data),

  // Get unread count
  getUnreadCount: () =>
    apiClient.get<{ unread_count: number }>('/notifications/unread_count/'),

  // Get notification summary for dashboard
  getSummary: () =>
    apiClient.get<NotificationSummary>('/notifications/summary/'),

  // Get notification preferences
  getPreferences: () =>
    apiClient.get<NotificationPreferences>('/notifications/preferences/'),

  // Update notification preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) =>
    apiClient.put<NotificationPreferences>('/notifications/preferences/', preferences),
};