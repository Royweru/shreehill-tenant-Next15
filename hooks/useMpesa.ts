import { tenantQueryKeys } from "@/lib/utils";
import { tenantService } from "@/services/tenantService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useMpesaPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MPesaPaymentRequest) => tenantService.initiateMpesaPayment(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('M-Pesa payment initiated successfully! Check your phone for the STK push.');
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.dashboard });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.bills.all });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.payments.all });
      } else {
        toast.error(data.error || 'Payment initiation failed');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Payment initiation failed');
    },
  });
};

export const usePaymentStatus = (paymentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: tenantQueryKeys.payments.status(paymentId),
    queryFn: () => tenantService.checkPaymentStatus(paymentId),
    enabled: enabled && !!paymentId,
    refetchInterval: (data:any) => {
      // Stop polling if payment is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      // Poll every 5 seconds for pending payments
      return data?.status === 'pending' ? 5000 : false;
    },
    staleTime: 0, // Always fetch fresh data
  });
};