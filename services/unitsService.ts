import { apiClient } from "@/lib/apiClient"
export const unitsService ={
    getMyUnit: () =>
    apiClient.get('/properties/units/my_unit/'),

    
  searchUnits: (params: {
    min_rent?: number;
    max_rent?: number;
    unit_type?: string;
    city?: string;
    furnished?: boolean;
    has_parking?: boolean;
  }) =>
    apiClient.get('/properties/units/search_units/', { params }),
}