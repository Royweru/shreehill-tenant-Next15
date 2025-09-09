// hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { paymentService } from '@/services/paymentServices';
import { billQueryKeys, dashboardQueryKeys, paymentQueryKeys } from '@/lib/queryKeys';
import { billsService } from '@/services/billsService';

// Add type imports - you'll need to uncomment these in your service file


// Payments Hooks
export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: paymentQueryKeys.list(filters),
    queryFn: () => paymentService.getPayments(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: paymentQueryKeys.detail(paymentId),
    queryFn: () => paymentService.getPayment(paymentId),
    enabled: !!paymentId,
  });
};

export const useRecentPayments = () => {
  return useQuery({
    queryKey: paymentQueryKeys.recent(),
    queryFn: paymentService.getRecentPayments,
    staleTime: 60 * 1000,
  });
};

export const usePaymentStatus = (paymentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: paymentQueryKeys.status(paymentId),
    queryFn: () => paymentService.checkPaymentStatus(paymentId),
    enabled: !!paymentId && enabled,
    refetchInterval: (data:any) => {
      // Keep polling if payment is still pending
      return data?.status === 'pending' ? 3000 : false; // 3 seconds
    },
    refetchIntervalInBackground: false,
  });
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: paymentService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Payment History Hook
export const usePaymentHistory = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['payments', 'history', { page, pageSize }],
    queryFn: () => paymentService.getPaymentHistory(page, pageSize),
     // Keep previous data while loading new page
  });
};

// Search Hooks
export const useSearchBills = (query: string) => {
  return useQuery({
    queryKey: ['bills', 'search', query],
    queryFn: () => paymentService.searchBills(query),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 30 * 1000,
  });
};

export const useSearchPayments = (query: string) => {
  return useQuery({
    queryKey: ['payments', 'search', query],
    queryFn: () => paymentService.searchPayments(query),
    enabled: query.length > 2,
    staleTime: 30 * 1000,
  });
};

// Mutations
export const useMpesaPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MPesaPaymentRequest) => paymentService.initiateMpesaPayment(data), 
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Payment initiated successfully! Check your phone for M-Pesa PIN prompt.');
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      } else {
        toast.error(data.error || 'Payment initiation failed');
      }
    },
    onError: (error: any) => {
      console.error('M-Pesa payment error:', error);
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.detail || 
        'Payment failed. Please try again.'
      );
    },
  });
};

// Custom hooks for common patterns
export const usePaymentOperations = () => {
  const queryClient = useQueryClient();
  
  const refreshPaymentData = () => {
    queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
    queryClient.invalidateQueries({ queryKey:dashboardQueryKeys.dashboard });
  };

  const refreshBillData = () => {
    queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
    queryClient.invalidateQueries({ queryKey:dashboardQueryKeys.dashboard });
  };

  return {
    refreshPaymentData,
    refreshBillData,
  };
};

// Fixed: Hook for infinite scrolling payments - using useInfiniteQuery
export const useInfinitePayments = (filters?: PaymentFilters) => {
  return useInfiniteQuery({
    queryKey: ['payments', 'infinite', filters],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const response = await paymentService.getPayments({
        ...filters,
        page: pageParam,
        page_size: 20,
      });
      return {
        data: response.results,
        nextPage: response.next ? pageParam + 1 : null,
        hasMore: !!response.next,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1, // Required in newer versions of tanstack/react-query
  });
};

// Hook for real-time payment status tracking
export const usePaymentStatusTracker = (paymentId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: paymentQueryKeys.status(paymentId),
    queryFn: () => paymentService.checkPaymentStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: (data:any) => {
      // Stop polling once payment is completed, failed, or cancelled
      if (data?.status && ['completed', 'failed', 'cancelled', 'reversed'].includes(data.status)) {
        // Refresh other payment data when status changes
        queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
        return false;
      }
      return 5000; // 5 seconds for pending payments
    },
    refetchIntervalInBackground: false,
   
  });
};

// Hook for payment analytics
export const usePaymentAnalytics = () => {
  return useQuery<{
    summary: BillSummary;
    monthlyPayments: {
      month: string;
      amount: number;
    }[];
    totalPayments: number;
    averagePayment: number;
  }>({
    queryKey: ['payments', 'analytics'],
    queryFn: async () => {
      const [summary, payments] = await Promise.all([
        billsService.getBillSummary(),
        paymentService.getPayments({ ordering: '-payment_date', page_size: 100 }),
      ]);

      // Calculate analytics from the data
      const completedPayments = payments.results.filter((p: Payment) => p.payment_status === 'completed');
      const monthlyPayments = completedPayments.reduce((acc: Record<string, number>, payment: Payment) => {
        const month = new Date(payment.payment_date).toISOString().slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + parseFloat(payment.amount_paid);
        return acc;
      }, {});

      return {
        summary,
        monthlyPayments: Object.entries(monthlyPayments).map(([month, amount]) => ({
          month,
          amount: amount,
        })),
        totalPayments: completedPayments.length,
        averagePayment: completedPayments.length > 0 
          ? (completedPayments.reduce((sum: number, p: Payment) => sum + parseFloat(p.amount_paid), 0) / completedPayments.length)
          : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};