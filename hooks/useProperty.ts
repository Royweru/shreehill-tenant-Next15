import { propertyQueryKeys, unitQueryKeys } from "@/lib/queryKeys";
import { tenantQueryKeys } from "@/lib/utils";
import { propertyService } from "@/services/propertyService";
import { unitsService } from "@/services/unitsService";
import { useQuery } from "@tanstack/react-query";

export const useMyProperty = () => {
  return useQuery({
    queryKey: propertyQueryKeys.my,
    queryFn: propertyService.getMyProperty,
    staleTime: 1000 * 60 * 30, // 30 minutes (property info doesn't change often)
  });
};

export const useMyUnit = () => {
  return useQuery({
    queryKey: unitQueryKeys.my,
    queryFn: unitsService.getMyUnit,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};