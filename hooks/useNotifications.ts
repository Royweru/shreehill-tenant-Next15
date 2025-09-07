import { tenantQueryKeys } from "@/lib/utils";
import { notificationsService } from "@/services/notificationsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useNotifications = (params?: { page?: number; is_read?: boolean }) => {
  return useQuery({
    queryKey: tenantQueryKeys.notifications.list(params),
    queryFn: () => notificationsService.getNotifications(params),
    staleTime: 1000 * 30, // 30 seconds

  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.dashboard });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsService.markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success('All notifications marked as read');
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.dashboard });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to mark notifications as read');
    },
  });
};
