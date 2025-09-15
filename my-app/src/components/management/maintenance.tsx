"use client";
import { FaWrench, FaPlus, FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React from "react";

export default function MaintenanceManagement() {
  const mockMaintenance = [
    {
      id: 1,
      veiculo: "Caminhão IVECO",
      placa: "STU-7890",
      tipo: "Troca de Pneus",
      kmTroca: 150000,
      kmAtual: 149000,
      kmUltimaTroca: 100000,
      proximaTroca: 1000,
      status: "Próximo",
      dataUltimaTroca: "15/07/2025",
      responsavel: "João Silva",
      custo: 4500.00
    },
    {
      id: 2,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Alinhamento",
      kmTroca: 80000,
      kmAtual: 75000,
      kmUltimaTroca: 40000,
      proximaTroca: 5000,
      status: "Regular",
      dataUltimaTroca: "01/08/2025",
      responsavel: "Maria Oliveira",
      custo: 150.00
    },
    {
      id: 3,
      veiculo: "Van Renault",
      placa: "PQR-3456",
      tipo: "Troca de Óleo",
      kmTroca: 60000,
      kmAtual: 32000,
      kmUltimaTroca: 30000,
      proximaTroca: 28000,
      status: "Regular",
      dataUltimaTroca: "20/07/2025",
      responsavel: "Pedro Souza",
      custo: 350.00
    },
    {
      id: 4,
      veiculo: "Carro Honda",
      placa: "XYZ-5678",
      tipo: "Revisão",
      kmTroca: 74000,
      kmAtual: 76000,
      kmUltimaTroca: 60000,
      proximaTroca: -2000,
      status: "Atrasado",
      dataUltimaTroca: "10/06/2025",
      responsavel: "Ana Costa",
      custo: 800.00
    },
  ];
  const totalMaintenance = mockMaintenance.length;
  const totalCost = mockMaintenance.reduce((acc, curr) => acc + curr.custo, 0);
  const urgentMaintenance = mockMaintenance.filter(m => m.proximaTroca <= 1000 || m.proximaTroca < 0).length;

  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Atrasado":
        return "bg-red-500";
      case "Próximo":
        return "bg-yellow-500";
      case "Regular":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex gap-4 justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white py-3 px-6 rounded-lg font-semibold hover:bg-fuchsia-800 transition-colors duration-200 cursor-pointer"
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
            <p className="text-sm text-white/80">Total de Manutenções</p>
            <h2 className="text-4xl font-bold">{totalMaintenance}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaWrench size={40} className="text-white opacity-75" />
          <div>
            <p className="text-sm text-white/80">Custo Total</p>
            <h2 className="text-4xl font-bold">R$ {totalCost.toFixed(2)}</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaWrench size={40} className="text-white opacity-75" />
          <div>
            <p className="text-sm text-white/80">Manutenções Urgentes</p>
            <h2 className="text-4xl font-bold">{urgentMaintenance}</h2>
          </div>
        </div>
      </section>
      {/* Tabela de Manutenções */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-primary-purple">
          Manutenções
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Veículo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  KM Atual/Troca
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Última Troca
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Custo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {mockMaintenance.map((maintenance) => (
                <tr key={maintenance.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="font-semibold text-white">
                      {maintenance.veiculo}
                    </div>
                    <div className="text-xs">
                      {maintenance.placa}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {maintenance.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="font-semibold text-white">
                      {maintenance.kmAtual.toLocaleString()} km
                    </div>
                    <div className="text-xs">
                      Próxima: {maintenance.kmTroca.toLocaleString()} km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="font-semibold text-white">
                      {maintenance.dataUltimaTroca}
                    </div>
                    <div className="text-xs">
                      {maintenance.kmUltimaTroca.toLocaleString()} km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(maintenance.status)} text-white text-xs`}>
                      {maintenance.status}
                      {maintenance.proximaTroca < 0
                        ? ` (${Math.abs(maintenance.proximaTroca)} km)`
                        : ` (${maintenance.proximaTroca} km)`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="font-semibold text-white">
                      R$ {maintenance.custo.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button
                      className="text-primary-purple hover:text-fuchsia-800 transition-colors"
                      title="Editar manutenção"
                    >
                      <FaPen size={16} />
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
