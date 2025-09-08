// hooks/useNotifications.ts
import { notificationQueryKeys } from "@/lib/queryKeys";
import { dashboardQueryKeys } from "@/lib/queryKeys";
import { notificationsService } from "@/services/notificationsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useNotifications = (params?: { 
  page?: number; 
  is_read?: boolean;
  notification_type?: string;
  priority_level?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationsService.getNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationQueryKeys.detail(id),
    queryFn: () => notificationsService.getNotification(id),
    enabled: !!id,
  });
};

export const useNotificationSummary = () => {
  return useQuery({
    queryKey: notificationQueryKeys.summary(),
    queryFn: () => notificationsService.getSummary(),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markNotificationAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Update the notification in cache
      queryClient.setQueryData<Notification>(
        notificationQueryKeys.detail(notificationId),
        (old:any) => old ? { ...old, is_read: true, read_at: new Date().toISOString() } : undefined
      );
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to mark notification as read');
    },
  });
};

export const useMarkNotificationAsUnread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markNotificationAsUnread(notificationId),
    onSuccess: (_, notificationId) => {
      // Update the notification in cache
      queryClient.setQueryData<Notification>(
        notificationQueryKeys.detail(notificationId),
        (old) => old ? { ...old, is_read: false, read_at: undefined } : undefined
      );
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to mark notification as unread');
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success('All notifications marked as read');
      // Invalidate all notification-related queries
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to mark notifications as read');
    },
  });
};

export const useBulkNotificationAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ notification_ids, action }: { notification_ids: string[]; action: 'mark_read' | 'mark_unread' | 'delete' }) =>
      notificationsService.bulkAction({ notification_ids, action }),
    onSuccess: (data, { action, notification_ids }) => {
      const actionMessages = {
        mark_read: `Marked ${notification_ids.length} notifications as read`,
        mark_unread: `Marked ${notification_ids.length} notifications as unread`,
        delete: `Deleted ${notification_ids.length} notifications`,
      };
      
      toast.success(actionMessages[action]);
      
      // Invalidate all notification-related queries
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to perform bulk action');
    },
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: notificationQueryKeys.preferences(),
    queryFn: () => notificationsService.getPreferences(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationsService.updatePreferences(preferences),
    onSuccess: (data) => {
      toast.success('Notification preferences updated successfully');
      queryClient.setQueryData(notificationQueryKeys.preferences(), data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update preferences');
    },
  });
};

// Updated query keys
