import { tenantQueryKeys } from '@/lib/utils';
import { tenantService } from '@/services/tenantService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useNotifications } from './useNotifications';


export const useTenantDashboard = () => {
  return useQuery({
    queryKey: tenantQueryKeys.dashboard,
    queryFn: tenantService.getDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();
  
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: tenantQueryKeys.dashboard });
    queryClient.invalidateQueries({ queryKey: tenantQueryKeys.bills.all });
    queryClient.invalidateQueries({ queryKey: tenantQueryKeys.payments.all });
    queryClient.invalidateQueries({ queryKey: tenantQueryKeys.notifications.all });
    toast.success('Dashboard refreshed');
  };

  return { refresh };
};

export const useDashboardData = () => {
  const dashboardQuery = useTenantDashboard();
  const notificationsQuery = useNotifications
  ({ page: 1, is_read: false });
  
  return {
    dashboard: dashboardQuery,
    notifications: notificationsQuery,
    isLoading: dashboardQuery.isLoading || notificationsQuery.isLoading,
    error: dashboardQuery.error || notificationsQuery.error,
    refetch: () => {
      dashboardQuery.refetch();
      notificationsQuery.refetch();
    },
  };
};