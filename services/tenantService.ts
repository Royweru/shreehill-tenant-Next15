import api from "@/lib/api";

export const tenantService = {
  // Dashboard
  getDashboard: (): Promise<DashboardData> =>
    api.get('/users/tenant-dashboard/'),

  // Bills
  getBills: (params?: { 
    page?: number; 
    status?: string; 
    bill_type?: string; 
    search?: string;
  }) =>
    api.get('/billing/bills/', { params }),

  getBillDetails: (billId: string): Promise<Bill> =>
    api.get(`/billing/bills/${billId}/`),

  getOverdueBills: (params?: { page?: number }) =>
    api.get('/billing/bills/overdue/', { params }),

  getBillsSummary: () =>
    api.get('/billing/bills/summary/'),

  // Payments
  getPayments: (params?: { 
    page?: number; 
    payment_method?: string; 
    payment_status?: string;
    search?: string;
  }) =>
    api.get('/billing/payments/', { params }),

  getPaymentDetails: (paymentId: string): Promise<Payment> =>
    api.get(`/billing/payments/${paymentId}/`),

  getRecentPayments: () =>
    api.get('/billing/payments/recent/'),

  // M-Pesa Payments
  initiateMpesaPayment: (data: MPesaPaymentRequest): Promise<MPesaPaymentResponse> =>
    api.post('/billing/payments/initiate_mpesa/', data),

  checkPaymentStatus: (paymentId: string): Promise<PaymentStatus> =>
    api.get(`/billing/payments/${paymentId}/status/`),

  // Properties
  getMyProperty: () =>
    api.get('/properties/my_property/'),

  getMyUnit: () =>
    api.get('/properties/units/my_unit/'),

  // Notifications
  getNotifications: (params?: { page?: number; is_read?: boolean }) =>
    api.get('/notifications/', { params }),

  markNotificationAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read/`),

  markAllNotificationsAsRead: () =>
    api.post('/notifications/mark_all_read/'),
};