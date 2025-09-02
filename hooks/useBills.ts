import { tenantQueryKeys } from "@/lib/utils";
import { tenantService } from "@/services/tenantService";
import { useQuery } from "@tanstack/react-query";

export const useTenantBills = (params?: {
  page?: number;
  status?: string;
  bill_type?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: tenantQueryKeys.bills.list(params),
    queryFn: () => tenantService.getBills(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
  });
};

export const useTenantBillDetails = (billId: string) => {
  return useQuery({
    queryKey: tenantQueryKeys.bills.detail(billId),
    queryFn: () => tenantService.getBillDetails(billId),
    enabled: !!billId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOverdueBills = (params?: { page?: number }) => {
  return useQuery({
    queryKey: tenantQueryKeys.bills.overdue(params),
    queryFn: () => tenantService.getOverdueBills(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBillsSummary = () => {
  return useQuery({
    queryKey: tenantQueryKeys.bills.summary,
    queryFn: tenantService.getBillsSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};