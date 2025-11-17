"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaGasPump, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import { TUserData, TUsersResponse } from "@/types/TUser";
import { TGetAllRefuels, TRefuel } from "@/types/TFuel";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";
import dayjs from "dayjs";

import Pagination from "../pagination";
import SearchBar from "../searchBar";
import Filters from "../filters";

/**
 * FuelManagement.tsx
 *
 * Melhorias e decisões tomadas:
 * - Buscas paralelas: refuels (pag), users (limit 1000) e vehicles (limit 1000)
 * - Uso de useMemo para criar mapas (userMap, vehicleMap) para lookup O(1)
 * - Handlers memoizados com useCallback
 * - Integração com seus componentes SearchBar e Filters (assumi interfaces comuns — veja comentários)
 * - Exibição de dados do veículo e do usuário em cada linha
 */

/* ---------- TIPOS LOCAIS (se necessário ajustar, use os tipos reais do seu projeto) ---------- */
/* 
  - TGetVehicle foi enviado por você (é a representação retornada pelo backend para veículos)
  - TUserData e TUsersResponse também foram enviados
*/

export default function FuelManagement() {
  const { data: session } = useSession();

  // dados principais
  const [refuels, setRefuels] = useState<TRefuel[]>([]);
  const [loading, setLoading] = useState(false);

  // paginação para abastecimentos
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [perPage] = useState<number>(10);

  // filtros / busca (integração SearchBar + Filters)
  const [search, setSearch] = useState<string>(""); // usaremos para pesquisa geral (Placa / termo)
  // filtros extras controlados por Filters component
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [filterFrota, setFilterFrota] = useState<string>("");
  const [filterManutencaoVencida, setFilterManutencaoVencida] =
    useState<string>("");

  // armazenamento de users e vehicles (listas completas para lookup)
  const [users, setUsers] = useState<TUserData[]>([]);
  const [vehicles, setVehicles] = useState<TGetVehicle[]>([]);

  // modais fornecidos pelo seu código
  const editFuelSupplyModal = useEditFuelSupplyModal() as {
    onOpen: (fuelSupply: TRefuel) => void;
    isOpen: boolean;
  };
  const addFuelSupplyModal = useAddFuelSupplyModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };

  /* --------------------------
     FETCH PRINCIPAL: refuels
     -------------------------- */
  useEffect(() => {
    const fetchRefuels = async () => {
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const skip = (page - 1) * perPage;

        type ParamsType = {
          skip: number;
          limit: number;
          placa?: string;
          id_usuario?: string;
          data_inicio?: string;
          data_fim?: string;
          search?: string;
        };

        const params: ParamsType = {
          skip,
          limit: perPage,
        };

        // Usamos 'search' para buscar por placa ou outro termo no backend (se suportado)
        if (search) params.search = search;
        // if (filterTipo) params["tipo"] = filterTipo;
        // if (filterFrota) params["frota"] = filterFrota;
        // if (filterManutencaoVencida) params["manutencao_vencida"] = filterManutencaoVencida;

        const res = await api.get<TGetAllRefuels>("/api/v1/refuels/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params,
        });

        setRefuels(res.data.refuels);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar abastecimentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchRefuels();
    // re-fetch quando modais de criar/editar fecharem/abrirem para atualizar lista
  }, [
    session,
    page,
    perPage,
    search,
    filterTipo,
    filterFrota,
    filterManutencaoVencida,
    addFuelSupplyModal.isOpen,
    editFuelSupplyModal.isOpen,
  ]);

  /* --------------------------
     FETCH AUX: users (limit 1000)
     -------------------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await api.get<TUsersResponse>("/api/v1/users", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar usuários.");
      }
    };

    fetchUsers();
  }, [session]);

  /* --------------------------
     FETCH AUX: vehicles (limit 1000)
     -------------------------- */
  useEffect(() => {
    const fetchVehiclesList = async () => {
      if (!session?.accessToken) return;

      try {
        type VehiclesResp =
          | { vehicles: TGetVehicle[]; total?: number }
          | TGetVehicle[];

        const res = await api.get<VehiclesResp>("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        // Dependendo do seu backend, a resposta pode vir em res.data.vehicles ou como um array direto.
        // Ajuste se preciso.
        const vehiclesList: TGetVehicle[] = Array.isArray(res.data)
          ? res.data
          : res.data.vehicles ?? [];

        setVehicles(vehiclesList);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar veículos.");
      }
    };

    fetchVehiclesList();
  }, [session]);

  /* --------------------------
     MAPS PARA LOOKUP RÁPIDO
     -------------------------- */
  const userMap = useMemo(() => {
    const map = new Map<string | number, TUserData>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const vehicleMap = useMemo(() => {
    const map = new Map<string, TGetVehicle>();
    vehicles.forEach((v) => {
      if (v.placa) map.set(v.placa.toUpperCase(), v);
    });
    return map;
  }, [vehicles]);

  /* --------------------------
     FUNÇÕES UTILITÁRIAS
     -------------------------- */
  const getUserInfosById = useCallback(
    (id: string | number | undefined) => {
      if (id === undefined || id === null || id === "") return "—";
      if (userMap.size === 0) return "Carregando...";
      const user = userMap.get(id);
      return user ? `${user.name} ${user.lastName}` : "Não encontrado";
    },
    [userMap]
  );

  const getVehicleInfosByPlate = useCallback(
    (placa: string | undefined) => {
      if (!placa) return "—";
      if (vehicleMap.size === 0) return "Carregando...";
      const p = placa.toUpperCase();
      const vehicle = vehicleMap.get(p);
      if (!vehicle) return "Não encontrado";
      // combine marca + modelo + ano se disponível
      const parts = [];
      if ((vehicle as TGetVehicle).marca)
        parts.push((vehicle as TGetVehicle).marca);
      if ((vehicle as TGetVehicle).modelo)
        parts.push((vehicle as TGetVehicle).modelo);
      if ((vehicle as TGetVehicle).ano)
        parts.push(String((vehicle as TGetVehicle).ano));
      return parts.length > 0 ? parts.join(" ") : "Não encontrado";
    },
    [vehicleMap]
  );

  /* --------------------------
     HANDLERS: filtros vindos do componente Filters
     (Assumi que Filters chama onChange com um objeto semelhante a:
       { tipo?: string, frota?: string, manutencao_vencida?: string }
     Ajuste conforme a assinatura real do seu Filters)
     -------------------------- */
  const handleFiltersChange = useCallback(
    (payload: {
      tipo?: string;
      frota?: string;
      manutencao_vencida?: string;
    }) => {
      setFilterTipo(payload.tipo ?? "");
      setFilterFrota(payload.frota ?? "");
      setFilterManutencaoVencida(payload.manutencao_vencida ?? "");
      // reset page to 1 ao aplicar filtros
      setPage(1);
    },
    []
  );

  /* --------------------------
     HANDLER Search bar
     (Assumi SearchBar aceita value/onChange. Se a sua API for diferente, eu adapto)
     -------------------------- */
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  /* --------------------------
     RENDER
     -------------------------- */
  return (
    <div className="space-y-6 mt-6">
      {/* BOTÃO ADD */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors"
          onClick={addFuelSupplyModal.onOpen}
        >
          <FaPlus />
          Cadastrar Abastecimento
        </button>
      </div>

      {/* CARDS RESUMO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Custo Mensal</p>
            {/* Se quiser, substitua as métricas de exemplo por cálculos reais */}
            <h2 className="text-4xl font-bold">
              R$ {(Math.random() * 1000).toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Litros no mês</p>
            <h2 className="text-4xl font-bold">
              {(Math.random() * 1000).toFixed(2)} L
            </h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Abastecimentos no mês</p>
            <h2 className="text-4xl font-bold">
              {(Math.random() * 100).toFixed(0)}
            </h2>
          </div>
        </div>
      </section>

      {/* FILTROS + SEARCH */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-2xl font-semibold text-primary-purple">
            Histórico de Abastecimentos
          </h3>

          <div className="flex gap-4 w-full lg:w-auto flex-col md:flex-row">
            {/* SearchBar: assumi props value/onChange/placeholder */}
            <div className="w-full md:w-60">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar placa / termo..."
              />
            </div>
          </div>
        </div>

        {/* TABELA */}
        <section className="bg-gray-800 rounded-xl shadow-lg py-3 md:py-6 mt-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Data & KM
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Abastecimento
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Local & Tipo
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Veículo / Motorista
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {refuels.map((r) => (
                    <tr key={String(r.id)} className="text-sm">
                      <td className="p-3 text-gray-300">
                        <div className="font-semibold">
                          {dayjs(`${r.data} ${r.hora}`).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </div>
                        <div>{r.km.toLocaleString("pt-BR")} km</div>
                      </td>

                      <td className="p-3 text-gray-300">
                        <div className="font-bold">
                          R${" "}
                          {r.valor_total
                            ? Number(r.valor_total).toFixed(2)
                            : "—"}
                        </div>
                        <div className="text-gray-400">
                          {parseFloat(r.litros).toFixed(2)} L × R${" "}
                          {parseFloat(r.valor_litro).toFixed(2)}
                        </div>
                      </td>

                      <td className="p-3 text-gray-300 capitalize">
                        <div className="font-semibold">{r.posto}</div>
                        <div className="text-gray-400">
                          {r.tipo_combustivel}
                        </div>
                      </td>

                      <td className="p-3 text-gray-300">
                        <div className="flex items-center gap-1">
                          <div className="font-semibold">{r.placa}</div>
                          <div className="text-gray-400">
                            {getVehicleInfosByPlate(r.placa)}
                          </div>
                        </div>

                        <div className="mt-1 text-sm">
                          {getUserInfosById(r.id_usuario)}
                        </div>
                      </td>

                      <td className="p-3 text-gray-300">
                        <button
                          onClick={() => editFuelSupplyModal.onOpen(r)}
                          className="p-2 rounded-lg hover:bg-gray-700"
                        >
                          <FaPencilAlt size={16} className="text-gray-300" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {refuels.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-gray-400 py-10"
                      >
                        Nenhum abastecimento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINAÇÃO */}
          <div className="p-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
