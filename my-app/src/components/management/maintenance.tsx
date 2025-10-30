"use client";
import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { FaWrench, FaPlus, FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import React from "react";

interface IPreventiveMaintenance {
  id: number;
  placa: string;
  kmAtual: number;
  manutencoes: {
    oleo: boolean;
    filtroOleo: boolean;
    filtroCombustivel: boolean;
    filtroAr: boolean;
    engraxamento: boolean;
  };
  data: string;
  status: string;
}

export default function MaintenanceManagement() {
  const mockMaintenance: IPreventiveMaintenance[] = [
    {
      id: 1,
      placa: "ABC-1234",
      kmAtual: 45600,
      manutencoes: {
        oleo: true,
        filtroOleo: true,
        filtroCombustivel: false,
        filtroAr: false,
        engraxamento: true,
      },
      data: "15/10/2025",
      status: "Concluída",
    },
    {
      id: 2,
      placa: "DEF-5678",
      kmAtual: 87200,
      manutencoes: {
        oleo: false,
        filtroOleo: false,
        filtroCombustivel: true,
        filtroAr: true,
        engraxamento: false,
      },
      data: "02/09/2025",
      status: "Atrasado",
    },
    {
      id: 3,
      placa: "GHI-9012",
      kmAtual: 132000,
      manutencoes: {
        oleo: true,
        filtroOleo: true,
        filtroCombustivel: true,
        filtroAr: true,
        engraxamento: true,
      },
      data: "01/08/2025",
      status: "Próximo",
    },
    {
      id: 4,
      placa: "JKL-3456",
      kmAtual: 54000,
      manutencoes: {
        oleo: false,
        filtroOleo: true,
        filtroCombustivel: false,
        filtroAr: true,
        engraxamento: false,
      },
      data: "20/11/2025",
      status: "Regular",
    },
  ];

  const editMaintenanceModal = useEditMaintenanceModal() as {
    onOpen: (maintenanceData: IPreventiveMaintenance) => void;
  };
  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
  };

  // --- Estatísticas simples ---
  const totalMaintenance = mockMaintenance.length;
  const totalCompleted = mockMaintenance.filter((m) =>
    Object.values(m.manutencoes).some((v) => v)
  ).length;
  const fullMaintenance = mockMaintenance.filter((m) =>
    Object.values(m.manutencoes).every((v) => v)
  ).length;

  const labelMap: Record<string, string> = {
    oleo: "Troca de óleo",
    filtroOleo: "Filtro de óleo",
    filtroCombustivel: "Filtro de combustível",
    filtroAr: "Filtro de ar",
    engraxamento: "Engraxamento",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Atrasado":
        return "bg-red-500";
      case "Próximo":
        return "bg-yellow-500";
      case "Regular":
        return "bg-green-500";
      case "Concluída":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

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

      {/* Cards principais */}
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
            <p className="text-base text-white/80">
              Revisões Completas (todas as trocas)
            </p>
            <h2 className="text-4xl font-bold">{fullMaintenance}</h2>
          </div>
        </div>
      </section>

      {/* --- Tabela de manutenções --- */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6">
        <h3 className="text-2xl font-semibold mb-4 text-primary-purple m-2">
          Manutenções Preventivas
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Placa
                </th>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  KM Manutenção
                </th>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Manutenções Realizadas
                </th>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {mockMaintenance.map((maintenance) => (
                <tr key={maintenance.id}>
                  <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                    <Link
                      href={`/vehicle/${maintenance.placa}`}
                      className="hover:underline hover:text-white"
                    >
                      {maintenance.placa}
                    </Link>
                  </td>
                  <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {maintenance.data}
                  </td>
                  <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {maintenance.kmAtual.toLocaleString()} km
                  </td>
                  <td className="p-3 md:px-6 py-4 text-sm text-gray-300">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(maintenance.manutencoes)
                        .filter(([_, v]) => v)
                        .map(([k]) => (
                          <span
                            key={k}
                            className="px-2 py-1 bg-primary-purple/40 text-white rounded-lg text-xs text-center w-fit truncate"
                          >
                            {labelMap[k]}
                          </span>
                        ))}
                      {Object.values(maintenance.manutencoes).every(
                        (v) => !v
                      ) && (
                        <span className="text-gray-500 italic text-xs">
                          Nenhuma realizada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 md:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        maintenance.status
                      )}`}
                    >
                      {maintenance.status}
                    </span>
                  </td>
                  <td className="p-3 md:px-6 py-4 text-xs">
                    <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                      <FaPencilAlt
                        className="text-gray-300 hover:text-primary-purple transition-colors duration-200"
                        size={16}
                        onClick={() => editMaintenanceModal.onOpen(maintenance)}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
