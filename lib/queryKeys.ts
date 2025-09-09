export const paymentQueryKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentQueryKeys.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...paymentQueryKeys.lists(), { filters }] as const,
  details: () => [...paymentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentQueryKeys.details(), id] as const,
  recent: () => [...paymentQueryKeys.all, 'recent'] as const,
  infinite:(filters?:PaymentFilters)=>[...paymentQueryKeys.all,'infinite', filters] as const,
  analytics:()=>[...paymentQueryKeys.all, 'analytics'],
  status: (id: string) => [...paymentQueryKeys.all, 'status', id] as const,
};

export const billQueryKeys = {
  all: ['bills'] as const,
  lists: () => [...billQueryKeys.all, 'list'] as const,
  list: (filters?: BillFilters) => [...billQueryKeys.lists(), { filters }] as const,
  details: () => [...billQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...billQueryKeys.details(), id] as const,
  overdue: () => [...billQueryKeys.all, 'overdue'] as const,
  summary: () => [...billQueryKeys.all, 'summary'] as const,
};

export const propertyQueryKeys = {
  my: ['property','my'] as const,
};

export const unitQueryKeys = {
  my: ['unit','my'] as const,
};

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  list: (params?: any) => ['notifications', 'list', params] as const,
  detail: (id: string) => ['notifications', 'detail', id] as const,
  summary: () => ['notifications', 'summary'] as const,
  unreadCount: () => ['notifications', 'unread-count'] as const,
  preferences: () => ['notifications', 'preferences'] as const,
};
export const dashboardQueryKeys ={
   dashboard: ['tenant', 'dashboard'] as const,
}