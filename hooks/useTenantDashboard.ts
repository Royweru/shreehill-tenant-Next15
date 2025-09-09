

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useNotifications } from './useNotifications';
import { billQueryKeys, dashboardQueryKeys, notificationQueryKeys, paymentQueryKeys, unitQueryKeys, userQueryKeys } from '@/lib/queryKeys';
import { dashboardService } from '@/services/dashboardService';




export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();
  
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey:unitQueryKeys.my });
    queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: paymentQueryKeys.recent() });
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.summary() });
    queryClient.invalidateQueries({ queryKey: billQueryKeys.summary() });
    queryClient.invalidateQueries({ queryKey: userQueryKeys.user });
    toast.success('Dashboard refreshed');
  };

  return { refresh };
};

export const useTenantDashboard =()=>{
  return useQuery({
    queryKey:dashboardQueryKeys.dashboard,
    queryFn:()=>dashboardService.getTenantDashboardSummary,
    staleTime: 30 * 1000,
  })
}