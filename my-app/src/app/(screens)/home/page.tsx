"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaTruck,
  FaWrench,
  FaDollarSign,
  FaExclamationTriangle,
  FaPlus,
  FaCar,
  FaFilter,
} from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PendingAlerts from "@/components/sections/pendingAlerts";
import { useSession } from "next-auth/react";
import { useAlerts } from "@/utils/hooks/useFetchAlerts";
import { useRouter } from "next/navigation";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import api from "@/utils/api";
import { TDashboard } from "@/types/TDashboard";


// type MaintenanceItem = {
//   id: number;
//   veiculo: string;
//   kmTroca: number;
//   kmAtual: number;
//   kmUltimaTroca: number;
// };

/* ---------------------- Component ---------------------- */
export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
  };
  const addFuelSupplyModal = useAddFuelSupplyModal() as { onOpen: () => void };

  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  // filtros UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlacas, setSelectedPlacas] = useState<string[]>([]);
  const [dataInicial, setDataInicial] = useState<string | null>(null);
  const [dataFinal, setDataFinal] = useState<string | null>(null);

  // dashboard state
  const [dashboard, setDashboard] = useState<TDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allVehiclePlacas = dashboard
    ? dashboard.vehicleConsumptionData.map((v) => v.name)
    : [];

  const handlePillClick = (placa: string) => {
    setSelectedPlacas((prev) =>
      prev.includes(placa) ? prev.filter((p) => p !== placa) : [...prev, placa]
    );
  };

  // monta query string: placas pode aparecer várias vezes (placas=AAA&placas=BBB)
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedPlacas && selectedPlacas.length > 0) {
      selectedPlacas.forEach((p) => params.append("placas", p));
    }
    if (dataInicial) params.set("data_inicial", dataInicial);
    if (dataFinal) params.set("data_final", dataFinal);
    return params.toString();
  }, [selectedPlacas, dataInicial, dataFinal]);

  // fetch dashboard
  const fetchDashboard = useCallback(
    async (signal?: AbortSignal) => {
      // checa sessão antes de setar loading
      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // monta params somente se houver filtro
        type DashboardParams = {
          placas?: string[];
          data_inicial?: string;
          data_final?: string;
        };
        const params: DashboardParams = {};
        if (selectedPlacas && selectedPlacas.length > 0)
          params.placas = selectedPlacas;
        if (dataInicial) params.data_inicial = dataInicial;
        if (dataFinal) params.data_final = dataFinal;

        // axios instance 'api' -- passa signal se suportado
        const response = await api.get("/api/v1/dashboard/metrics", {
          headers: {
            Authorization: `Bearer ${(((session as unknown) as { accessToken?: string })?.accessToken) ?? ""}`,
          },
          params: Object.keys(params).length ? params : undefined,
          // signal funciona em axios recent (se sua versão não suportar, remover ou usar cancelToken)
          signal,
        });

        const data: TDashboard = response.data;

        const normalized: TDashboard = {
          totalVeiculos: data.totalVeiculos ?? 0,
          abastecimentosRecentes: data.abastecimentosRecentes ?? 0,
          custoTotalCombustivel: data.custoTotalCombustivel ?? 0,
          mediaConsumoFrota: data.mediaConsumoFrota ?? 0,
          gastoData: Array.isArray(data.gastoData) ? data.gastoData : [],
          vehicleConsumptionData: Array.isArray(data.vehicleConsumptionData)
            ? data.vehicleConsumptionData
            : [],
          veiculoMaisEconomico: data.veiculoMaisEconomico ?? null,
          veiculoMaisConsome: data.veiculoMaisConsome ?? null,
        };

        setDashboard(normalized);
      } catch (err: unknown) {
        // detecta AbortError sem usar 'any'
        if (
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name?: unknown }).name === "AbortError"
        ) {
          // fetch cancelado — ignora
          return;
        }

        console.error("Erro fetch dashboard:", err);

        const getErrorMessage = (e: unknown): string => {
          if (!e) return "Erro desconhecido ao carregar dashboard";
          if (typeof e === "string") return e;
          if (e instanceof Error) return e.message;
          if (typeof e === "object" && e !== null) {
            const eObj = e as Record<string, unknown>;
            const response = eObj.response as Record<string, unknown> | undefined;
            const data = response?.data as Record<string, unknown> | undefined;
            const message = data?.message as string | undefined;
            if (typeof message === "string") return message;
          }
          return "Erro desconhecido ao carregar dashboard";
        };

        const msg = getErrorMessage(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    // dependências: incluir o que a função usa diretamente
    [session, selectedPlacas, dataInicial, dataFinal, router]
  );

  // fetch inicial + refetch quando filtros mudarem
  useEffect(() => {
    const controller = new AbortController();
    fetchDashboard(controller.signal);
    return () => controller.abort();
  }, [fetchDashboard]);

  const applyFilters = () => {
    fetchDashboard();
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow px-4 md:px-8 py-4 space-y-4">
        <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-purple order-2 lg:order-1 mt-4 lg:mt-0">
            Dashboard da Frota
          </h1>
          <Link
            href="/management"
            className="flex items-center gap-2 bg-[#d08700] hover:bg-[#bc6202] text-white px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors order-1 lg:order-2 cursor-pointer w-fit self-end"
          >
            <FaGear size={20} />
            Gerenciamento
          </Link>
        </div>

        {/* Alerts */}
        {alerts && alerts.length > 0 && (
          <PendingAlerts filteredData={{ alertas: alerts }} />
        )}

        {/* Ações */}
        <div className="flex justify-start gap-2">
          <button
            onClick={() => addFuelSupplyModal.onOpen()}
            className="bg-primary-purple hover:bg-fuchsia-800 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit text-sm"
          >
            <FaPlus /> Adicionar Abastecimento
          </button>
          <button
            onClick={() => addMaintenanceModal.onOpen()}
            className="bg-primary-purple hover:bg-fuchsia-800 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit text-sm"
          >
            <FaPlus /> Adicionar Manutenção
          </button>
        </div>

        {/* Filtros */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2">Filtros e Ações</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FaFilter />
            </button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col col-span-1 lg:col-span-2">
                <label className="text-sm font-semibold mb-1 text-gray-400">
                  Placas
                </label>
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                  {allVehiclePlacas.length === 0 ? (
                    <div className="text-sm text-gray-400">Sem placas</div>
                  ) : (
                    allVehiclePlacas.map((placa) => (
                      <span
                        key={placa}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                          selectedPlacas.includes(placa)
                            ? "bg-primary-purple text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => handlePillClick(placa)}
                      >
                        {placa}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1 text-gray-400">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial ?? ""}
                  onChange={(e) =>
                    setDataInicial(e.target.value ? e.target.value : null)
                  }
                  className="bg-gray-700 rounded-md p-2 text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1 text-gray-400">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal ?? ""}
                  onChange={(e) =>
                    setDataFinal(e.target.value ? e.target.value : null)
                  }
                  className="bg-gray-700 rounded-md p-2 text-white"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="bg-primary-purple px-4 py-2 rounded-lg font-semibold"
                >
                  Aplicar Filtros
                </button>
                <button
                  onClick={() => {
                    setSelectedPlacas([]);
                    setDataInicial(null);
                    setDataFinal(null);
                    fetchDashboard();
                  }}
                  className="bg-gray-600 px-4 py-2 rounded-lg font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Link
            href="/management#vehicles"
            className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaTruck size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Veículos</p>
              <h2 className="text-4xl font-bold">
                {loading ? "..." : dashboard?.totalVeiculos ?? 0}
              </h2>
            </div>
          </Link>

          <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <FaDollarSign size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Custo Total (Período)</p>
              <h2 className="text-4xl font-bold">
                R${" "}
                {dashboard
                  ? dashboard.custoTotalCombustivel.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0,00"}
              </h2>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <IoWaterOutline size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Média da Frota (Período)</p>
              <h2 className="text-4xl font-bold">
                {dashboard
                  ? Number(dashboard.mediaConsumoFrota).toFixed(2)
                  : "0.00"}{" "}
                Km/L
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {dashboard?.veiculoMaisEconomico && (
              <div className="bg-emerald-600 rounded-xl shadow-lg py-2 px-3 flex flex-col justify-between items-center">
                <div className="w-full top-2 right-3 flex space-x-1">
                  <FaCar size={16} className="text-white opacity-80" />
                  <p className="text-xs text-white/80 font-semibold">
                    Mais Econômico
                  </p>
                </div>

                <div className="flex w-full justify-between">
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {dashboard.veiculoMaisEconomico.name}
                  </p>
                  <p className="text-sm text-white font-bold">
                    {dashboard.veiculoMaisEconomico.consumo !== null
                      ? Number(dashboard.veiculoMaisEconomico.consumo).toFixed(
                          2
                        )
                      : "--"}{" "}
                    Km/L
                  </p>
                </div>
              </div>
            )}

            {dashboard?.veiculoMaisConsome && (
              <div className="bg-yellow-600 rounded-xl shadow-lg py-2 px-3 flex flex-col justify-between items-center">
                <div className="w-full top-2 right-3 flex space-x-1">
                  <FaCar size={16} className="text-white opacity-80" />
                  <p className="text-xs text-white/80 font-semibold">
                    Mais Consome
                  </p>
                </div>

                <div className="flex w-full justify-between">
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {dashboard.veiculoMaisConsome.name}
                  </p>
                  <p className="text-sm text-white font-bold">
                    {dashboard.veiculoMaisConsome.consumo !== null
                      ? Number(dashboard.veiculoMaisConsome.consumo).toFixed(2)
                      : "--"}{" "}
                    Km/L
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="col-span-1 bg-gray-700 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-xl font-semibold mb-4">
              Gasto de Combustível por Período
            </h3>
            {loading && <p className="text-sm text-gray-300">Carregando...</p>}
            {/* {error && <p className="text-sm text-red-400">{error}</p>} */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dashboard?.gastoData ?? []}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip cursor={{ fill: "#4a5568" }} />
                <Bar dataKey="gasto" fill="#a055ff" name="Custo Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-1 bg-gray-700 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-xl font-semibold mb-4">
              Consumo Médio por Veículo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dashboard?.vehicleConsumptionData ?? []}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip cursor={{ fill: "#4a5568" }} />
                <Bar dataKey="consumo" fill="#6EE7B7" name="Km/L" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Próximas Manutenções (placeholder) */}
        {/* <section className="bg-gray-700 rounded-xl shadow-lg p-4 lg:p-6 space-y-4">
          <div className="flex w-full justify-between">
            <h3 className="text-xl font-semibold mb-4">Próximas Manutenções</h3>
            <Link
              href="/management#maintenance"
              className="text-gray-400 hover:underline hover:text-white"
            >
              Ver todas
            </Link>
          </div>

          {manutencoes.length === 0 ? (
            <p className="text-sm text-gray-300">
              Nenhuma manutenção carregada.
            </p>
          ) : (
            <ul className="space-y-3">
              {manutencoes.map((manutencao) => {
                const progress =
                  ((manutencao.kmAtual - manutencao.kmUltimaTroca) /
                    (manutencao.kmTroca - manutencao.kmUltimaTroca)) *
                  100;
                const progressColor =
                  progress > 90
                    ? "bg-red-500"
                    : progress > 70
                    ? "bg-yellow-500"
                    : "bg-green-500";

                return (
                  <li
                    key={manutencao.id}
                    className="flex flex-col space-y-2 bg-gray-600 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FaWrench size={20} className="text-white/70" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{manutencao.veiculo}</p>
                          {progress > 100 && (
                            <FaExclamationTriangle
                              size={18}
                              className="text-yellow-400"
                            />
                          )}
                        </div>
                        <div className="flex justify-between text-sm text-white/60">
                          <span>
                            Última troca:{" "}
                            {manutencao.kmUltimaTroca.toLocaleString()}
                          </span>
                          <span>
                            KM atual: {manutencao.kmAtual.toLocaleString()}
                          </span>
                          <span>
                            Próxima troca: {manutencao.kmTroca.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {progress < 100 ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white/60">
                          Progresso: {progress.toFixed(2)}%
                        </p>
                        <p className="text-sm text-white/60">
                          Próxima troca em{" "}
                          {manutencao.kmTroca - manutencao.kmAtual} KM
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400 font-bold">
                        Manutenção Atrasada!
                      </p>
                    )}
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${progressColor} transition-all duration-300`}
                        style={{
                          width: `${Math.min(Math.max(progress, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
