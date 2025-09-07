import { tenantQueryKeys } from '@/lib/utils';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useNotifications } from './useNotifications';




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

