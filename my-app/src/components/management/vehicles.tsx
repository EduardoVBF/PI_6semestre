"use client";
import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { useAddVehicleModal } from "@/utils/hooks/useAddVehicleModal";
import { FaTruck, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React from "react";

export default function VehiclesManagement() {
  interface Vehicle {
    placa: string;
    modelo: string;
    marca: string;
    ano: number;
    tipo: string;
    motorista: string;
  }

  const mockVehicles: Vehicle[] = [
    {
      placa: "ABC-1234",
      modelo: "Onix",
      marca: "Chevrolet",
      ano: 2022,
      tipo: "Carro",
      motorista: "João Silva",
    },
    {
      placa: "DEF-5678",
      modelo: "HR-V",
      marca: "Honda",
      ano: 2023,
      tipo: "SUV",
      motorista: "Maria Oliveira",
    },
    {
      placa: "GHI-9012",
      modelo: "S10",
      marca: "Chevrolet",
      ano: 2021,
      tipo: "Picape",
      motorista: "Pedro Souza",
    },
    {
      placa: "JKL-3456",
      modelo: "Actros",
      marca: "Mercedes-Benz",
      ano: 2020,
      tipo: "Caminhão",
      motorista: "Ana Costa",
    },
  ];
  // const totalVehicles = mockVehicles.length;

  const editVehicleModal = useEditVehicleModal() as {
    onOpen: (vehicle: Vehicle | null) => void;
  };
  const addVehicleModal = useAddVehicleModal() as { onOpen: () => void };
  const router = useRouter();

  return (
    <div className="space-y-6 mt-6">
      <div className="flex gap-4 justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white text-sm py-2 px-4 rounded-lg font-bold hover:bg-fuchsia-800 transition-colors duration-200 cursor-pointer"
          onClick={addVehicleModal.onOpen}
        >
          <FaPlus />
          Cadastrar Veículo
        </button>
      </div>
      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Total de Veículos</p>
            <h2 className="text-4xl font-bold">
              {(Math.random() * 100).toFixed(0)}
            </h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Ativos</p>
            <h2 className="text-4xl font-bold">
              {(Math.random() * 10).toFixed(0)}
            </h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Inativos</p>
            <h2 className="text-4xl font-bold">
              {(Math.random() * 5).toFixed(0)}
            </h2>
          </div>
        </div>
      </section>
      {/* Tabela de Veículos */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6">
        <h3 className="text-2xl font-semibold mb-4 text-primary-purple m-2">
          Veículos
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th
                  scope="col"
                  className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Placa
                </th>
                <th
                  scope="col"
                  className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Modelo
                </th>
                <th
                  scope="col"
                  className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Marca
                </th>
                <th
                  scope="col"
                  className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ano
                </th>
                <th
                  scope="col"
                  className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Motorista
                </th>
                <th
                  scope="col"
                  className="p-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {mockVehicles.map((vehicle) => (
                <tr
                  key={vehicle.placa}
                  className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                  onClick={() => router.push(`/vehicle/${vehicle.placa}`)}
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {vehicle.placa}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {vehicle.modelo}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {vehicle.marca}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {vehicle.ano}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {vehicle.tipo}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {vehicle.motorista}
                  </td>
                  <td className="p-3 md:px-6 py-4 text-xs">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // evita disparar o clique da linha
                        editVehicleModal.onOpen(vehicle);
                      }}
                    >
                      <FaPencilAlt
                        className="text-gray-300 hover:text-primary-purple transition-colors duration-200"
                        size={16}
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
