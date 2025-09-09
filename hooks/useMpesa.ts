import { billQueryKeys, dashboardQueryKeys, paymentQueryKeys } from "@/lib/queryKeys";
import { tenantQueryKeys } from "@/lib/utils";
import { paymentService } from "@/services/paymentServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useMpesaPayment = () => {
  const queryClient = useQueryClient();
     
  return useMutation({
    mutationFn: async (data: MPesaPaymentRequest) => paymentService.initiateMpesaPayment(data),
    onSuccess: (data) => {
      console.log('Hook: Payment success callback with data:', data);
      if (data?.success) {
        toast.success('M-Pesa payment initiated successfully! Check your phone for the STK push.');
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.dashboard });
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
      } else {
        toast.error(data?.error || 'Payment initiation failed');
      }
    },
    onError: (error: any) => {
      console.error('Hook: Payment error callback:', error);
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.detail ||
                          error?.message ||
                          'Payment initiation failed';
      toast.error(errorMessage);
    },
  });
};

export const usePaymentStatus = (paymentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: paymentQueryKeys.status(paymentId),
    queryFn: () => paymentService.checkPaymentStatus(paymentId),
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