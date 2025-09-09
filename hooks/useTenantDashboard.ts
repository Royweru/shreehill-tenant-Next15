

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useNotifications } from './useNotifications';
import { billQueryKeys, dashboardQueryKeys, notificationQueryKeys, paymentQueryKeys } from '@/lib/queryKeys';
import { dashboardService } from '@/services/dashboardService';




export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();
  
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
    queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
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