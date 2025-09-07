export const paymentQueryKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentQueryKeys.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...paymentQueryKeys.lists(), { filters }] as const,
  details: () => [...paymentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentQueryKeys.details(), id] as const,
  recent: () => [...paymentQueryKeys.all, 'recent'] as const,
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

export const notificationQueryKeys ={
  all: ['tenant', 'notifications'] as const,
    list: (params?: any) => ['tenant', 'notifications', 'list', params] as const,
}

