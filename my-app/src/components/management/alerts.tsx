"use client";
import {
  FaExclamationTriangle,
  FaPencilAlt,
  FaCheck,
  FaFilter,
} from "react-icons/fa";
import { useAlerts } from "@/utils/hooks/useFetchAlerts";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { TUserData } from "@/types/TUser";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/utils/api";
import Link from "next/link";
import Filters from "../filters"; // ajuste o caminho conforme necessário
import dayjs from "dayjs";

export default function AlertsManagement() {
  const [count, setCount] = React.useState<number | null>(null);
  const [monthCount, setMonthCount] = React.useState<number | null>(null);
  const [todayCount, setTodayCount] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [vehicleData, setVehicleData] = React.useState<TGetVehicle | null>(
    null
  );
  const [userData, setUserData] = React.useState<TUserData | null>(null);

  // filtros colapsáveis
  const [showFilters, setShowFilters] = useState(false);
  const [placaFilter, setPlacaFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");

  const { data: alerts, isLoading, refetch } = useAlerts();
  const { data: session } = useSession();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MEDIUM":
        return {
          style: "bg-yellow-700 text-white",
          label: "Médio",
        };
      case "HIGH":
        return {
          style: "bg-green-700 text-white",
          label: "Alto",
        };
      case "LOW":
        return {
          style: "bg-red-700 text-white",
          label: "Baixo",
        };
      default:
        return {
          style: "bg-gray-700 text-white",
          label: "Desconhecido",
        };
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (loading) return;
    setLoading(true);

    try {
      await api.patch(`/api/v1/alerts/${alertId}/resolve`, {
        resolved: true,
      });
      toast.success("Alerta resolvido com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao resolver o alerta:", error);
      toast.error("Erro ao resolver o alerta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED: calcular counts reais a partir de alerts usando dayjs ---
  useEffect(() => {
    if (!alerts) {
      setCount(null);
      setMonthCount(null);
      setTodayCount(null);
      return;
    }

    const now = dayjs();

    const openAlerts = alerts.filter((a) => !a.resolved).length;

    const monthAlerts = alerts.filter((a) =>
      dayjs(a.created_at).isSame(now, "month")
    ).length;

    const todayAlerts = alerts.filter((a) =>
      dayjs(a.created_at).isSame(now, "day")
    ).length;

    setCount(openAlerts);
    setMonthCount(monthAlerts);
    setTodayCount(todayAlerts);
  }, [alerts]);
  // ---------------------------------------------------------------------

  // opções únicas de placa (a partir dos alerts)
  const placaOptions = useMemo(() => {
    if (!alerts) return [];
    return Array.from(
      new Set(
        alerts
          .map((a) => (a.placa ? a.placa.toUpperCase() : ""))
          .filter(Boolean)
      )
    );
  }, [alerts]);

  // opções únicas de gravidade (a partir dos alerts)
  const severityOptions = useMemo(() => {
    if (!alerts) return [];
    return Array.from(new Set(alerts.map((a) => a.severity).filter(Boolean)));
  }, [alerts]);

  // alerts filtrados por placa / status / gravidade (cliente)
  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (placaFilter && a.placa?.toUpperCase() !== placaFilter.toUpperCase())
        return false;
      if (statusFilter) {
        if (statusFilter === "resolved" && !a.resolved) return false;
        if (statusFilter === "pending" && a.resolved) return false;
      }
      if (severityFilter && a.severity !== severityFilter) return false;
      return true;
    });
  }, [alerts, placaFilter, statusFilter, severityFilter]);

  return (
    <div className="space-y-6 mt-6">
      <Toaster position="top-center" />
      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas em aberto</p>
            <h2 className="text-4xl font-bold">
              {count !== null ? count : "—"}
            </h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas no mês</p>
            <h2 className="text-4xl font-bold">
              {monthCount !== null ? monthCount : "—"}
            </h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas Hoje</p>
            <h2 className="text-4xl font-bold">
              {todayCount !== null ? todayCount : "—"}
            </h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-800 rounded-xl shadow-lg p-2 md:p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <FaExclamationTriangle size={30} className="text-yellow-400" />
              <h3 className="text-2xl font-semibold text-primary-purple">
                Alertas Recentes
              </h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
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

          {showFilters && (
            <div className="">
              <Filters
                groups={[
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Resolvido", value: "resolved" },
                    ],
                    selected: statusFilter,
                    onChange: setStatusFilter,
                  },
                  {
                    key: "gravidade",
                    label: "Gravidade",
                    options: severityOptions.map((s) => ({
                      label: s,
                      value: s,
                    })),
                    selected: severityFilter,
                    onChange: setSeverityFilter,
                  },
                  {
                    key: "placa",
                    label: "Placa",
                    options: placaOptions.map((p) => ({ label: p, value: p })),
                    selected: placaFilter,
                    onChange: setPlacaFilter,
                  },
                ]}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Mensagem
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Gravidade
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              {filteredAlerts && filteredAlerts.length > 0 ? (
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <span className="font-semibold">
                          {dayjs(alert.created_at).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </td>

                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <Link
                          href={`/vehicle/${alert.placa}`}
                          className="hover:underline hover:text-white"
                        >
                          {alert.placa}
                        </Link>
                      </td>

                      <td className="px-3 md:px-6 py-4 text-sm text-gray-300 flex items-center gap-2 min-w-[200px]">
                        {alert.message}
                      </td>

                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getStatusColor(alert.severity).style
                          }`}
                        >
                          {getStatusColor(alert.severity).label}
                        </span>
                      </td>

                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {alert.resolved ? "Resolvido" : "Pendente"}
                      </td>

                      <td className="px-3 md:px-6 py-4 text-sm space-x-2">
                        {!alert.resolved && (
                          <button
                            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <FaCheck
                              className="text-gray-300 hover:text-green-500 transition-colors duration-200"
                              size={16}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      {isLoading ? "Carregando alertas..." : "Nenhum alerta encontrado."}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
