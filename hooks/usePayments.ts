import { tenantQueryKeys } from "@/lib/utils";
import { tenantService } from "@/services/tenantService";
import { useQuery } from "@tanstack/react-query";

export const useTenantPayments = (params?: {
  page?: number;
  payment_method?: string;
  payment_status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: tenantQueryKeys.payments.list(params),
    queryFn: () => tenantService.getPayments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
  });
};

export const usePaymentDetails = (paymentId: string) => {
  return useQuery({
    queryKey: tenantQueryKeys.payments.detail(paymentId),
    queryFn: () => tenantService.getPaymentDetails(paymentId),
    enabled: !!paymentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentPayments = () => {
  return useQuery({
    queryKey: tenantQueryKeys.payments.recent,
    queryFn: tenantService.getRecentPayments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};