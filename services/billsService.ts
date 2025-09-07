import { apiClient } from "@/lib/apiClient"

export const billsService ={
   // Bills
  getBills: async (filters?: BillFilters): Promise<PaginatedResponse<Bill>> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.bill_type) params.append('bill_type', filters.bill_type);
    if (filters?.due_date_from) params.append('due_date_from', filters.due_date_from);
    if (filters?.due_date_to) params.append('due_date_to', filters.due_date_to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    if (filters?.ordering) params.append('ordering', filters.ordering);

    const response = await apiClient.get<PaginatedResponse<Bill>>(`/api/billing/bills/?${params.toString()}`);
    return response
  },

  getBill: async (billId: string): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/api/billing/bills/${billId}/`);
    return response
  },

  getOverdueBills: async (): Promise<PaginatedResponse<Bill>> => {
    const response = await apiClient.get<PaginatedResponse<Bill>>('/api/billing/bills/overdue/');
    return response
  },

  getBillSummary: async (): Promise<BillSummary> => {
    const response = await apiClient.get<BillSummary>('/api/billing/bills/summary/');
    return response
  },
}