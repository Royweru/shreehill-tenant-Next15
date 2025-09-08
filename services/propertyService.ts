import { apiClient } from "@/lib/apiClient";

export const propertyService = {
  getMyProperty: () =>
    apiClient.get('/api/assets/properties/'),

  
  getAvailableProperties: (params?: {
    page?: number;
    city?: string;
    min_rent?: number;
    max_rent?: number;
  }) =>
    apiClient.get('/api/assets/properties/browse_available/', { params }),

};