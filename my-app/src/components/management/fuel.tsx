"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaGasPump, FaPlus, FaPencilAlt, FaFilter } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import { TUserData, TUsersResponse } from "@/types/TUser";
import { TGetAllRefuels, TRefuel } from "@/types/TFuel";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";
import dayjs from "dayjs";

import Pagination from "../pagination";
import SearchBar from "../searchBar";
import Filters from "../filters";
import { useAlerts } from "@/utils/hooks/useFetchAlerts";
import { TAlert } from "@/types/TAlerts";

/**
 * FuelManagement.tsx
 *
 * Versão completa:
 * - fetch paginado (tabela) — igual ao seu comportamento atual
 * - fetch "completo" com paginação automática para popular os cards (allRefuels)
 * - cálculos dos cards baseados em allRefuels (não no pageRefuels)
 * - comparações de data inclusivas para início/fim do mês
 *
 * Ajustes possíveis: se tiver muitos registros (> dezenas de milhares),
 * prefira um endpoint de stats no backend. Este componente traz tudo em memória.
 */

// Quantos itens pedir por requisição quando buscamos "tudo".
const ALL_REFUELS_FETCH_LIMIT = 1000;

export default function FuelManagement() {
  const { data: session } = useSession();

  // dados principais paginados (tabela)
  const [refuels, setRefuels] = useState<TRefuel[]>([]);
  const [loading, setLoading] = useState(false);

  // todos os abastecimentos (usado para os cards/estatísticas)
  const [allRefuels, setAllRefuels] = useState<TRefuel[]>([]);
  const [loadingAllRefuels, setLoadingAllRefuels] = useState(false);

  // paginação para abastecimentos (tabela)
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [perPage] = useState<number>(10);

  // filtros / busca (integração SearchBar + Filters)
  const [search, setSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [placaFilter, setPlacaFilter] = useState<string>("");
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

  // alerts globais
  const { data: alerts } = useAlerts();

  /* --------------------------
     FETCH PRINCIPAL: refuels (paginado para tabela)
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

        if (search) params.search = search;
        if (placaFilter) params.placa = placaFilter;
        // se quiser enviar os outros filtros para a API, descomente e adapte:
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
  }, [
    session,
    page,
    perPage,
    search,
    filterTipo,
    filterFrota,
    filterManutencaoVencida,
    placaFilter,
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
        const res = await api.get<TUsersResponse>("/api/v1/users/", {
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

        const res = await api.get<VehiclesResp>("/api/v1/vehicles/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        const vehiclesList: TGetVehicle[] = Array.isArray(res.data)
          ? res.data
          : (res.data.vehicles ?? []);

        setVehicles(vehiclesList);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar veículos.");
      }
    };

    fetchVehiclesList();
  }, [session]);

  /* --------------------------
     FETCH "COMPLETO": traer todos os abastecimentos (paginação automática)
     usado para calcular os cards
     -------------------------- */
  useEffect(() => {
    const fetchAllRefuels = async () => {
      if (!session?.accessToken) return;
      setLoadingAllRefuels(true);

      try {
        let all: TRefuel[] = [];
        let skip = 0;
        const limit = ALL_REFUELS_FETCH_LIMIT;

        while (true) {
          const res = await api.get<TGetAllRefuels>("/api/v1/refuels/", {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            params: { skip, limit },
          });
  
          // res.data can be either an array of TRefuel or an object with a `refuels` array.
          const items: TRefuel[] =
            Array.isArray(res.data)
              ? (res.data as unknown as TRefuel[])
              : ((res.data as TGetAllRefuels).refuels ?? []);
          if (!items || items.length === 0) break;

          all = all.concat(items);

          // se retornou menos que o limit, acabou
          if (items.length < limit) break;

          // senão, incrementa skip e continua
          skip += limit;
        }

        setAllRefuels(all);
      } catch (err) {
        console.error("Erro ao carregar todos os abastecimentos:", err);
        // não forçar toast para não poluir UI; ative se preferir
      } finally {
        setLoadingAllRefuels(false);
      }
    };

    // Re-fetch quando modais que alteram dados fecharem/abrirem
    fetchAllRefuels();
  }, [session, addFuelSupplyModal.isOpen, editFuelSupplyModal.isOpen]);

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
      const parts: string[] = [];
      if ((vehicle as TGetVehicle).marca) parts.push((vehicle as TGetVehicle).marca);
      if ((vehicle as TGetVehicle).modelo) parts.push((vehicle as TGetVehicle).modelo);
      if ((vehicle as TGetVehicle).ano) parts.push(String((vehicle as TGetVehicle).ano));
      return parts.length > 0 ? parts.join(" ") : "Não encontrado";
    },
    [vehicleMap]
  );

  /* --------------------------
     HANDLERS: filtros vindos do componente Filters
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
      setPage(1);
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Retorna o primeiro dia e último dia do mês atual (strings YYYY-MM-DD)
  const getMonthRange = () => {
    const now = dayjs();
    return {
      start: now.startOf("month").format("YYYY-MM-DD"),
      end: now.endOf("month").format("YYYY-MM-DD"),
    };
  };

  const getAllPlacas = () => {
    return vehicles.map((v) => v.placa?.toUpperCase() || "").filter((p) => p);
  };

  const { start, end } = useMemo(() => getMonthRange(), []);

  // Filtrar abastecimentos do mês corrente — USANDO allRefuels (conjunto completo)
  const monthlyRefuels = useMemo(() => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);

    return allRefuels.filter((r) => {
      if (!r || !r.data) return false;
      const date = dayjs(r.data);
      const notBeforeStart = date.isAfter(startDay) || date.isSame(startDay, "day");
      const notAfterEnd = date.isBefore(endDay) || date.isSame(endDay, "day");
      return notBeforeStart && notAfterEnd;
    });
  }, [allRefuels, start, end]);

  // ---------- CUSTO MENSAL ----------
  const monthlyCost = useMemo(() => {
    return monthlyRefuels.reduce((acc, r) => {
      const v = Number(r.valor_total || 0);
      return acc + (isNaN(v) ? 0 : v);
    }, 0);
  }, [monthlyRefuels]);

  // ---------- LITROS NO MÊS ----------
  const monthlyLiters = useMemo(() => {
    return monthlyRefuels.reduce((acc, r) => {
      const l = parseFloat(r.litros || "0");
      return acc + (isNaN(l) ? 0 : l);
    }, 0);
  }, [monthlyRefuels]);

  // ---------- NÚMERO DE ABASTECIMENTOS NO MÊS ----------
  const monthlyCount = useMemo(() => {
    return monthlyRefuels.length;
  }, [monthlyRefuels]);

  /* --------------------------
     RENDER
     -------------------------- */
  return (
    <div className="space-y-6 mt-6">
      <Toaster position="top-center" />
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
            {/* Agora baseado em allRefuels */}
            <h2 className="text-4xl font-bold">
              R$ {monthlyCost.toFixed(2).replace(".", ",")}
            </h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Litros no mês</p>
            <h2 className="text-4xl font-bold">
              {monthlyLiters.toFixed(2).replace(".", ",")} L
            </h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Abastecimentos no mês</p>
            <h2 className="text-4xl font-bold">{monthlyCount}</h2>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-2xl font-semibold text-primary-purple">
            Histórico de Abastecimentos
          </h3>

          <div className="flex gap-4 w-full lg:w-auto flex-col md:flex-row items-start md:items-center">
            <div
              className="flex items-center gap-2 bg-gray-800 rounded-xl w-fit p-1 cursor-pointer text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className="text-sm">
                <FaFilter />
              </button>
              <p className="text-sm">{showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}</p>
            </div>
          </div>
        </div>

        {/* area colapsável de filtros */}
        {showFilters && (
          <Filters
            groups={[
              {
                key: "placa",
                label: "Placa",
                options: getAllPlacas().map((p) => ({ label: p, value: p })),
                selected: placaFilter,
                onChange: setPlacaFilter,
              },
            ]}
          />
        )}

        {/* TABELA */}
        <section className="bg-gray-800 rounded-xl shadow-lg py-3 md:py-6">
          {(loading || loadingAllRefuels) ? (
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
                      Média
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {refuels
                    .sort((a, b) => (a.data > b.data ? -1 : 1))
                    .map((r) => {
                      const hasAlert = alerts?.some(
                        (a: TAlert) => a.id_abastecimento === r.id
                      );

                      return (
                        <tr
                          key={String(r.id)}
                          className={`text-sm ${hasAlert ? "bg-yellow-800/50" : ""}`}
                        >
                          <td className="p-3 text-gray-300">
                            <div className="flex items-center gap-2">
                              {hasAlert && (
                                <FaExclamationTriangle
                                  size={18}
                                  className="text-yellow-400"
                                />
                              )}
                              <div className="font-semibold">
                                {dayjs(`${r.data} ${r.hora}`).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </div>
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
                            <p
                              className={`${
                                r.media
                                  ? "bg-primary-purple text-white rounded-full px-2 py-1 w-fit"
                                  : ""
                              } font-semibold text-sm`}
                            >
                              {r.media ? `${r.media} km/L` : "—"}
                            </p>
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
                      );
                    })}

                  {refuels.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
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
