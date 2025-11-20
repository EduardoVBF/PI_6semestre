// hooks/useAlerts.ts
import { useQuery } from "@tanstack/react-query";
import { TAlert } from "@/types/TAlerts";
import api from "@/utils/api";

export function useAlerts() {
  return useQuery<TAlert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/alerts/");
      return data;
    },
    staleTime: 20_000,        // evita refetch desnecessário
    // atualiza periodicamente depois de (opcional)
    refetchInterval: 300_000,
    refetchOnWindowFocus: true,
  });
}
