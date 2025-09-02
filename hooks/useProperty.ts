import { tenantQueryKeys } from "@/lib/utils";
import { tenantService } from "@/services/tenantService";
import { useQuery } from "@tanstack/react-query";

export const useMyProperty = () => {
  return useQuery({
    queryKey: tenantQueryKeys.property.my,
    queryFn: tenantService.getMyProperty,
    staleTime: 1000 * 60 * 30, // 30 minutes (property info doesn't change often)
  });
};

export const useMyUnit = () => {
  return useQuery({
    queryKey: tenantQueryKeys.property.unit,
    queryFn: tenantService.getMyUnit,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};