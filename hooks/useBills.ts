import { billQueryKeys } from "@/lib/queryKeys";
import { billsService} from "@/services/billsService";
import { useQuery } from "@tanstack/react-query";

// Bills Hooks
export const useBills = (filters?: BillFilters) => {
  return useQuery({
    queryKey: billQueryKeys.list(filters),
    queryFn: () => billsService.getBills(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBill = (billId: string) => {
  return useQuery({
    queryKey: billQueryKeys.detail(billId),
    queryFn: () => billsService.getBill(billId),
    enabled: !!billId,
  });
};

export const useOverdueBills = () => {
  return useQuery({
    queryKey: billQueryKeys.overdue(),
    queryFn: billsService.getOverdueBills,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useBillSummary = () => {
  return useQuery({
    queryKey: billQueryKeys.summary(),
    queryFn: billsService.getBillSummary,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};