"use client";

import { useEffect, useState, useMemo } from "react";
import { FaWrench, FaPlus, FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";

import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { TMaintenance, TGetAllMaintenances } from "@/types/TMaintenance";
import { FaFilter } from "react-icons/fa";
import Pagination from "../pagination";
import Filters from "../filters";

export default function MaintenanceManagement() {
  const { data: session } = useSession();

  // lista de placas completa (req separada, sem filtro de placa)
  const [allPlacas, setAllPlacas] = useState<string[]>([]);
  const [maintenances, setMaintenances] = useState<TMaintenance[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placaFilter, setPlacaFilter] = useState<string>("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  /* --------------------------
        🔥 ESTADO DOS FILTROS
  ---------------------------*/
  const [status, setStatus] = useState("");

  const statusOptions = useMemo(
    () => ["pendente", "em_andamento", "concluida", "cancelada"],
    []
  );

  const editMaintenanceModal = useEditMaintenanceModal() as {
    onOpen: (m: TMaintenance) => void;
    isOpen: boolean;
  };

  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };

  // retorna a lista de placas obtida pela requisição "sem filtro de placa"
  const getAllPlacas = () => allPlacas;

  // REQ ADICIONAL: buscar todas as manutenções (sem params.placa) para popular o filtro de placas
  useEffect(() => {
    const fetchAllPlacas = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await api.get<TGetAllMaintenances>("/api/v1/maintenances", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 }, // busca ampla, sem placa
        });

        const list = res.data.maintenances || [];
        const placas = list
          .map((v) => v.placa?.toUpperCase() || "")
          .filter((p) => p);
        setAllPlacas(Array.from(new Set(placas)));
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar placas para filtro.");
      }
    };

    fetchAllPlacas();
  }, [session, addMaintenanceModal.isOpen, editMaintenanceModal.isOpen]);

  /* --------------------------
        FETCH PRINCIPAL
  ---------------------------*/
  useEffect(() => {
    const fetchMaintenances = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      try {
        const skip = (page - 1) * perPage;

        type MaintQueryParams = {
          skip: number;
          limit: number;
          status?: string;
          placa?: string;
        };

        const params: MaintQueryParams = {
          skip,
          limit: perPage,
          placa: placaFilter || undefined,
        };

        if (status) params.status = status;

        const res = await api.get<TGetAllMaintenances>("/api/v1/maintenances", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params,
        });

        setMaintenances(res.data.maintenances);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar manutenções.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, [
    session,
    page,
    status, // 🔥 Necessário para refazer chamada ao trocar o filtro
    editMaintenanceModal.isOpen,
    addMaintenanceModal.isOpen,
    placaFilter,
  ]);

  /* --------------------------
        Estatísticas
  ---------------------------*/
  const totalMaintenance = maintenances.length;

  const totalCompleted = maintenances.filter((m) =>
    [
      m.oleo,
      m.filtro_oleo,
      m.filtro_combustivel,
      m.filtro_ar,
      m.engraxamento,
    ].some((v) => v)
  ).length;

  const fullMaintenance = maintenances.filter((m) =>
    [
      m.oleo,
      m.filtro_oleo,
      m.filtro_combustivel,
      m.filtro_ar,
      m.engraxamento,
    ].every((v) => v)
  ).length;

  /* --------------------------
        Helpers
  ---------------------------*/
  const labelMap: Record<string, string> = {
    oleo: "Troca de óleo",
    filtro_oleo: "Filtro de óleo",
    filtro_combustivel: "Filtro de combustível",
    filtro_ar: "Filtro de ar",
    engraxamento: "Engraxamento",
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "cancelada":
        return "bg-red-500";
      case "pendente":
        return "bg-yellow-500";
      case "concluida":
        return "bg-green-500";
      case "em_andamento":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6 mt-6">
      {/* Botão de adicionar */}
      <div className="flex gap-4 justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors duration-200 cursor-pointer"
          onClick={addMaintenanceModal.onOpen}
        >
          <FaPlus />
          Cadastrar Manutenção
        </button>
      </div>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaWrench size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Total de Registros</p>
            <h2 className="text-4xl font-bold">{totalMaintenance}</h2>
          </div>
        </div>

        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaWrench size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Manutenções Realizadas</p>
            <h2 className="text-4xl font-bold">{totalCompleted}</h2>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaWrench size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Revisões Completas</p>
            <h2 className="text-4xl font-bold">{fullMaintenance}</h2>
          </div>
        </div>
      </section>

      {/* Tabela */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <h3 className="text-2xl font-semibold text-primary-purple">
            Manutenções Preventivas
          </h3>

          <div className="flex gap-4 w-full lg:w-auto flex-col md:flex-row items-start md:items-center">
            <div
              className="flex items-center gap-2 bg-gray-800 rounded-xl w-fit p-1 cursor-pointer text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className="text-sm">
                <FaFilter />
              </button>
              <p className="text-sm">
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </p>
            </div>
          </div>
        </div>

        {/* area colapsável de filtros */}
        {showFilters && (
          <Filters
            groups={[
              {
                key: "status",
                label: "Status",
                options: statusOptions.map((s) => ({ label: s, value: s })),
                selected: status,
                onChange: setStatus,
              },
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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Placa
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Data
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    KM
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Manutenções Realizadas
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-600">
                {maintenances.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3 text-sm text-white font-semibold">
                      <Link
                        href={`/vehicle/${m.placa}`}
                        className="hover:underline"
                      >
                        {m.placa}
                      </Link>
                    </td>

                    <td className="p-3 text-sm text-gray-300">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>

                    <td className="p-3 text-sm text-gray-300">
                      {m.km_atual.toLocaleString()} km
                    </td>

                    <td className="p-3 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries({
                          oleo: m.oleo,
                          filtro_oleo: m.filtro_oleo,
                          filtro_combustivel: m.filtro_combustivel,
                          filtro_ar: m.filtro_ar,
                          engraxamento: m.engraxamento,
                        })
                          .filter(([_, v]) => v)
                          .map(([k]) => (
                            <span
                              key={k}
                              className="px-2 py-1 bg-primary-purple/40 text-white rounded-lg text-xs"
                            >
                              {labelMap[k]}
                            </span>
                          ))}

                        {!(
                          m.oleo ||
                          m.filtro_oleo ||
                          m.filtro_combustivel ||
                          m.filtro_ar ||
                          m.engraxamento
                        ) && (
                          <span className="text-gray-500 italic text-xs">
                            Nenhuma realizada
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          m.status
                        )}`}
                      >
                        {m.status === "em_andamento"
                          ? "Em andamento"
                          : m.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        className="p-2 hover:bg-gray-700 rounded-lg"
                        onClick={() => editMaintenanceModal.onOpen(m)}
                      >
                        <FaPencilAlt size={16} className="text-gray-300" />
                      </button>
                    </td>
                  </tr>
                ))}

                {maintenances.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-10">
                      Nenhuma manutenção encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
