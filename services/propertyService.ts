import api from "@/lib/api";

export const propertyService = {
  getMyProperty: () =>
    api.get('/properties/my_property/'),

  getMyUnit: () =>
    api.get('/properties/units/my_unit/'),

  getPropertyAmenities: (propertyId: string) =>
    api.get(`/properties/${propertyId}/amenities/`),

  getAvailableProperties: (params?: {
    page?: number;
    city?: string;
    min_rent?: number;
    max_rent?: number;
  }) =>
    api.get('/properties/browse_available/', { params }),

  searchUnits: (params: {
    min_rent?: number;
    max_rent?: number;
    unit_type?: string;
    city?: string;
    furnished?: boolean;
    has_parking?: boolean;
  }) =>
    api.get('/properties/units/search_units/', { params }),
};