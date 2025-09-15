"use client";

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
  FaGasPump,
  FaDollarSign,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaCar,
} from "react-icons/fa";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import React, { useState, useEffect } from "react";
import { IoWaterOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaGear } from "react-icons/fa6";
import Footer from "@/components/footer";
import Header from "@/components/header";

// --- Interfaces de Tipagem ---
interface Vehicle {
  placa: string;
  modelo: string;
  consumoMedio: number;
}

interface Abastecimento {
  veiculoPlaca: string;
  data: string;
  litros: number;
  km: number;
  valor: number;
  consumo: number;
}

interface Maintenance {
  id: number;
  veiculo: string;
  kmTroca: number;
  kmAtual: number;
  kmUltimaTroca: number;
}

interface DashboardMetrics {
  totalVeiculos: number;
  abastecimentosRecentes: number;
  custoTotalCombustivel: number;
  mediaConsumoFrota: number;
}

interface ChartData {
  name: string;
  gasto?: number;
  consumo?: number;
}

interface Alert {
  id: number;
  message: string;
  type: "warning" | "info";
}

interface FilteredData {
  dashboardMetrics: DashboardMetrics;
  gastoData: ChartData[];
  vehicleConsumptionData: ChartData[];
  alertas: Alert[];
  veiculoMaisEconomico: ChartData | null;
  veiculoMaisConsome: ChartData | null;
}

// --- Dados Simulados (Mock) ---
const mockData = {
  vehicles: [
    { placa: "EAP1421", modelo: "Onix", consumoMedio: 12.5 },
    { placa: "BSR9401", modelo: "Gol", consumoMedio: 10.8 },
    { placa: "BQI0502", modelo: "S10", consumoMedio: 8.5 },
    { placa: "ABC1234", modelo: "HR-V", consumoMedio: 11.2 },
    { placa: "XYZ5678", modelo: "Kicks", consumoMedio: 13.1 },
    { placa: "MNO9012", modelo: "Corolla", consumoMedio: 10.5 },
    { placa: "PQR3456", modelo: "Van Renault", consumoMedio: 9.8 },
    { placa: "STU7890", modelo: "Caminhão IVECO", consumoMedio: 6.2 },
  ],
  manutencoes: [
    {
      id: 1,
      veiculo: "Caminhão IVECO - Troca de Pneus",
      kmTroca: 150000,
      kmAtual: 149000,
      kmUltimaTroca: 100000,
    },
    {
      id: 2,
      veiculo: "Carro FIAT - Alinhamento",
      kmTroca: 80000,
      kmAtual: 75000,
      kmUltimaTroca: 40000,
    },
    {
      id: 3,
      veiculo: "Van Renault - Troca de Óleo",
      kmTroca: 60000,
      kmAtual: 32000,
      kmUltimaTroca: 30000,
    },
    {
      id: 4,
      veiculo: "Carro Honda - Revisão",
      kmTroca: 74000,
      kmAtual: 76000,
      kmUltimaTroca: 60000,
    },
  ],
};

const getMockedFilteredData = (): FilteredData => {
  const mockAlerts: Alert[] = [
    { id: 1, message: "BQI0502 - Consumo maior que o normal", type: "warning" },
    { id: 2, message: "BSR9401 - Abastecimento suspeito", type: "warning" },
  ];

  const mockDashboardMetrics: DashboardMetrics = {
    totalVeiculos: mockData.vehicles.length,
    abastecimentosRecentes: 45,
    custoTotalCombustivel: 21500,
    mediaConsumoFrota: 11.2,
  };

  const mockGastoData: ChartData[] = [
    { name: "Jan", gasto: 4000 },
    { name: "Fev", gasto: 3000 },
    { name: "Mar", gasto: 2000 },
    { name: "Abr", gasto: 2780 },
    { name: "Mai", gasto: 1890 },
    { name: "Jun", gasto: 2390 },
    { name: "Jul", gasto: 2500 },
    { name: "Ago", gasto: 3200 },
  ];

  const mockVehicleConsumptionData: ChartData[] = [
    { name: "Onix", consumo: 12.5 },
    { name: "Gol", consumo: 10.8 },
    { name: "S10", consumo: 8.5 },
    { name: "HR-V", consumo: 11.2 },
    { name: "Kicks", consumo: 13.1 },
    { name: "Corolla", consumo: 10.5 },
  ];

  const mockVeiculoMaisEconomico: ChartData = { name: "Kicks", consumo: 13.1 };
  const mockVeiculoMaisConsome: ChartData = {
    name: "Caminhão IVECO",
    consumo: 6.2,
  };

  return {
    dashboardMetrics: mockDashboardMetrics,
    gastoData: mockGastoData,
    vehicleConsumptionData: mockVehicleConsumptionData,
    alertas: mockAlerts,
    veiculoMaisEconomico: mockVeiculoMaisEconomico,
    veiculoMaisConsome: mockVeiculoMaisConsome,
  };
};

export default function Home() {
  const [showAlerts, setShowAlerts] = useState(false);
  const addFuelSupplyModal = useAddFuelSupplyModal() as { onOpen: () => void };
  const router = useRouter();

  const [selectedPlacas, setSelectedPlacas] = useState<string[]>([]);
  const filteredData = getMockedFilteredData();

  const handlePillClick = (placa: string) => {
    setSelectedPlacas((prev) =>
      prev.includes(placa) ? prev.filter((p) => p !== placa) : [...prev, placa]
    );
  };

  const allVehiclePlacas: string[] = mockData.vehicles.map((v) => v.placa);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow px-4 md:px-8 py-4 space-y-4">
        {/* --- Cabeçalho e Botão de Gerenciamento --- */}
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-purple">
            Dashboard da Frota
          </h1>
          <div className="p-2 rounded-lg hover:bg-gray-500 text-gray-400 hover:text-gray-800 transition-colors duration-200">
            <FaGear
              size={24}
              className="inline-block cursor-pointer"
              onClick={() => router.push("/management")}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={addFuelSupplyModal.onOpen}
            className="bg-primary-purple hover:bg-fuchsia-800 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit"
          >
            <FaPlus /> Adicionar Abastecimento
          </button>
        </div>

        {/* --- Seção de Alertas Colapsável --- */}
        {filteredData.alertas.length > 0 && (
          <section className="w-full">
            <div
              className={`bg-yellow-800 text-yellow-100 p-4 rounded-xl shadow-lg border border-yellow-500 text-sm font-semibold flex flex-col cursor-pointer transition-all duration-300`}
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle
                    size={24}
                    className="text-yellow-400"
                  />
                  <p className="text-xl text-yellow-300 font-bold">
                    Alertas ({filteredData.alertas.length})
                  </p>
                </div>
                {showAlerts ? (
                  <FaChevronUp size={16} className="text-yellow-400" />
                ) : (
                  <FaChevronDown size={16} className="text-yellow-400" />
                )}
              </div>
              {showAlerts && (
                <ul className="list-disc list-inside space-y-2 mt-4">
                  {filteredData.alertas.map((alert, index) => (
                    <li key={index} className="text-white text-sm">
                      {alert.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* --- Seção de Filtros e Ações --- */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Filtros e Ações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col col-span-1 lg:col-span-2">
              <label className="text-sm font-semibold mb-1 text-gray-400">
                Placas
              </label>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {allVehiclePlacas.map((placa) => (
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
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-400">
                Data Inicial
              </label>
              <input
                type="date"
                className="bg-gray-700 rounded-md p-2 text-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-400">
                Data Final
              </label>
              <input
                type="date"
                className="bg-gray-700 rounded-md p-2 text-white"
              />
            </div>
          </div>
        </section>

        {/* --- Cards de Visão Geral --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <FaTruck size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Total de Veículos</p>
              <h2 className="text-4xl font-bold">
                {filteredData.dashboardMetrics.totalVeiculos}
              </h2>
            </div>
          </div>
          <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <FaDollarSign size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Custo Total (Período)</p>
              <h2 className="text-4xl font-bold">
                R${" "}
                {filteredData.dashboardMetrics.custoTotalCombustivel.toLocaleString(
                  "pt-BR"
                )}
              </h2>
            </div>
          </div>
          <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
            <IoWaterOutline size={40} className="text-white opacity-75" />
            <div>
              <p className="text-sm text-white/80">Média da Frota (Período)</p>
              <h2 className="text-4xl font-bold">
                {filteredData.dashboardMetrics.mediaConsumoFrota.toFixed(2)}{" "}
                Km/L
              </h2>
            </div>
          </div>
          <div className="bg-emerald-600 rounded-xl shadow-lg p-6 flex flex-col items-start justify-start space-y-2">
            {filteredData.veiculoMaisEconomico && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <FaCar size={24} className="text-white opacity-75" />
                  <p className="text-sm text-white/80 font-semibold">
                    Mais Econômico
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <h2 className="text-xl font-bold">
                    {filteredData.veiculoMaisEconomico.name}
                  </h2>
                  <p className="text-lg text-white/80">
                    {filteredData.veiculoMaisEconomico.consumo?.toFixed(2)} Km/L
                  </p>
                </div>
              </div>
            )}
            {filteredData.veiculoMaisConsome && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <FaCar size={24} className="text-white opacity-75" />
                  <p className="text-sm text-white/80 font-semibold">
                    Mais Consome
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <h2 className="text-xl font-bold">
                    {filteredData.veiculoMaisConsome.name}
                  </h2>
                  <p className="text-lg text-white/80">
                    {filteredData.veiculoMaisConsome.consumo?.toFixed(2)} Km/L
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- Seção de Gráficos --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="col-span-1 bg-gray-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Gasto de Combustível por Período
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredData.gastoData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip cursor={{ fill: "#4a5568" }} />
                <Bar dataKey="gasto" fill="#a055ff" name="Custo Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="col-span-1 bg-gray-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Consumo Médio por Veículo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredData.vehicleConsumptionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip cursor={{ fill: "#4a5568" }} />
                <Bar dataKey="consumo" fill="#6EE7B7" name="Km/L" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* --- Próximas Manutenções --- */}
        <section className="bg-gray-700 rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Próximas Manutenções</h3>
          <ul className="space-y-3">
            {mockData.manutencoes.map((manutencao) => {
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
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
