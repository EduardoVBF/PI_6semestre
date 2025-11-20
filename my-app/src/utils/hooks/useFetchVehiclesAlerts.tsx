// hooks/useVehicleAlerts.ts
import { useQuery } from "@tanstack/react-query";
import { TAlert } from "@/types/TAlerts";
import api from "@/utils/api";

export function useVehicleAlerts(vehicleId: string | undefined) {
  return useQuery<TAlert[]>({
    queryKey: ["alerts", vehicleId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/alerts/`, {
        params: { vehicleId },
      });
      return data;
    },
    enabled: !!vehicleId,     // só ativa quando o ID existe
    staleTime: 20_000,
    refetchInterval: 300_000,
  });
}
