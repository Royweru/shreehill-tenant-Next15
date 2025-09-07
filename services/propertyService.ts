import { apiClient } from "@/lib/apiClient";

export const propertyService = {
  getMyProperty: () =>
    apiClient.get('/properties/my_property/'),

  

  getPropertyAmenities: (propertyId: string) =>
    apiClient.get(`/properties/${propertyId}/amenities/`),

  getAvailableProperties: (params?: {
    page?: number;
    city?: string;
    min_rent?: number;
    max_rent?: number;
  }) =>
    apiClient.get('/properties/browse_available/', { params }),

};