"use client";
import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import {
  FaGasPump,
  FaPlus,
  FaPencilAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
// import { useRouter } from "next/navigation";
import React from "react";

export default function FuelManagement() {
  // Dados simulados para os abastecimentos
  const mockAbastecimentos = [
    {
      id: 1,
      km_abastecimento: 45120,
      litros: 50.3,
      preco_litro: 5.99,
      data_hora: "20/08/25 10:30",
      posto: "Posto Mirim",
      tipo_combustivel: "Gasolina Comum",
      motorista: "João Silva",
      placa: "ABC-1234",
      marca: "Volvo",
      modelo: "FH 540",
      total_abastecimento: 301.2,
      media: 5.0,
    },
    {
      id: 2,
      km_abastecimento: 44800,
      litros: 45.0,
      preco_litro: 6.25,
      data_hora: "15/08/25 15:45",
      posto: "Shell",
      tipo_combustivel: "Gasolina Aditivada",
      motorista: "João Silva",
      placa: "DEF-5678",
      marca: "Scania",
      modelo: "R450",
      total_abastecimento: 281.25,
      media: 6.0,
    },
    {
      id: 3,
      km_abastecimento: 43950,
      litros: 55.5,
      preco_litro: 5.89,
      data_hora: "10/08/25 08:15",
      posto: "Posto Mirim",
      tipo_combustivel: "Gasolina Comum",
      motorista: "João Silva",
      placa: "GHI-9012",
      marca: "Mercedes-Benz",
      modelo: "Actros 2651",
      total_abastecimento: 326.8,
      media: 5.5,
    },
    {
      id: 4,
      km_abastecimento: 43100,
      litros: 48.0,
      preco_litro: 6.1,
      data_hora: "05/08/25 11:00",
      posto: "Posto Mirim",
      tipo_combustivel: "Gasolina Comum",
      motorista: "João Silva",
      placa: "JKL-3456",
      marca: "DAF",
      modelo: "XF 105",
      total_abastecimento: 292.8,
      media: 5.8,
    },
    {
      id: 5,
      km_abastecimento: 42250,
      litros: 52.0,
      preco_litro: 6.05,
      data_hora: "01/08/25 09:45",
      posto: "Ipiranga",
      tipo_combustivel: "Gasolina Comum",
      motorista: "João Silva",
      placa: "MNO-7890",
      marca: "MAN",
      modelo: "TGX 29.480",
      total_abastecimento: 314.6,
      media: 5.6,
    },
  ];
  const sortedAbastecimentos = [...mockAbastecimentos].sort(
    (a, b) => b.id - a.id
  );
  // const totalFuelSupplies = mockAbastecimentos.length;

  const editFuelSupplyModal = useEditFuelSupplyModal() as {
    onOpen: (id: string) => void;
  };
  const addFuelSupplyModal = useAddFuelSupplyModal() as { onOpen: () => void };
  // const router = useRouter();

  return (
    <div className="space-y-6 mt-6">
      <div className="flex gap-4 justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors duration-200 cursor-pointer"
          onClick={addFuelSupplyModal.onOpen}
        >
          <FaPlus />
          Cadastrar Abastecimento
        </button>
      </div>
      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Custo Mensal</p>
            <h2 className="text-4xl font-bold">R$ {(Math.random() * 1000).toFixed(2)}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Litros no mês</p>
            <h2 className="text-4xl font-bold">{(Math.random() * 1000).toFixed(2)} L</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaGasPump size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Abastecimentos no mês</p>
            <h2 className="text-4xl font-bold">{(Math.random() * 100).toFixed(0)}</h2>
          </div>
        </div>
      </section>
      {/* Tabela de Abastecimentos */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-primary-purple">
          Histórico de Abastecimentos
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Data e KM
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Abastecimento
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Local e Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Motorista e Veículo
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Média
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedAbastecimentos.map((abastecimento) => {
                // const previousAbastecimento = sortedAbastecimentos[index + 1];
                return (
                  <tr
                    key={abastecimento.id}
                    className={`${
                      abastecimento.media < 5.6 ? "bg-yellow-800/50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-xs text-gray-400 flex items-center gap-2">
                      {abastecimento.media < 5.6 && (
                        <FaExclamationTriangle
                          size={18}
                          className="text-yellow-400"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-white">
                          {abastecimento.data_hora}
                        </div>
                        <div>
                          {abastecimento.km_abastecimento.toLocaleString("pt-BR")}{" "}
                          km
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-bold text-white">
                        R$ {abastecimento.total_abastecimento.toFixed(2)}
                      </div>
                      <div className="text-gray-400">
                        {abastecimento.litros.toFixed(2)} L × R${" "}
                        {abastecimento.preco_litro.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div className="font-semibold text-white">
                        {abastecimento.posto}
                      </div>
                      <div>{abastecimento.tipo_combustivel}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div className="font-semibold text-white">
                        {abastecimento.marca} {abastecimento.modelo}
                      </div>
                      <div>{abastecimento.motorista}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="px-3 py-1 rounded-full bg-primary-purple bg-opacity-20 text-white">
                        {abastecimento.media} km/L
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        onClick={() =>
                          editFuelSupplyModal.onOpen(
                            abastecimento.id.toString()
                          )
                        }
                      >
                        <FaPencilAlt
                          className="text-gray-300 hover:text-primary-purple trasition-colors duration-200"
                          size={16}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
