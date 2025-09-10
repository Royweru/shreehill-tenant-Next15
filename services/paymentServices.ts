// services/paymentService.ts
import { apiClient } from '@/lib/apiClient';


export const paymentService = {
 
  // Payments
  getPayments: async (filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> => {
    const params = new URLSearchParams();
    
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    if (filters?.ordering) params.append('ordering', filters.ordering);

    const response = await apiClient.get<PaginatedResponse<Payment>>(`/api/billing/payments/?${params.toString()}`);
    return response
  },

  getPayment: async (paymentId: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/api/billing/payments/${paymentId}/`);
    return response
  },

  getRecentPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/billing/payments/recent/');
    return response
  },

  // M-Pesa Payments
  
  initiateMpesaPayment: async (data: MPesaPaymentRequest): Promise<MPesaPaymentResponse> => {
    console.log('Service: Initiating M-Pesa payment with data:', data);
    console.log('Service: Making request to /api/billing/payments/initiate_mpesa/');
    
    try {
      const response = await apiClient.post<MPesaPaymentResponse>('/api/billing/payments/initiate_mpesa/', data);
      console.log('Service: Received response:', response);
      return response;
    } catch (error:any) {
      console.error('Service: Request failed:', error);
      console.error('Service: Error response:', error?.response);
      throw error;
    }
  },

  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    const response = await apiClient.get<PaymentStatus>(`/api/billing/payments/${paymentId}/status/`);
    return response
  },

  // Dashboard Analytics
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/billing/bills/summary/');
    return response
  },

// Updated Payment History with Filtering
  getPaymentHistory: async (page: number = 1, pageSize: number = 10, filters?: PaymentFilters) => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    // Add filters if provided
    if (filters?.search) params.append('search', filters.search);
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    
    const response = await apiClient.get<PaymentHistoryData>(`/api/billing/payments/?${params.toString()}`);
    return response;
  },

  // Search functionality
  searchBills: async (query: string) => {
    const response = await apiClient.get(`/api/billing/bills/?search=${encodeURIComponent(query)}`);
    return response
  },

  searchPayments: async (query: string) => {
    const response = await apiClient.get(`/api/billing/payments/?search=${encodeURIComponent(query)}`);
    return response
  }
};