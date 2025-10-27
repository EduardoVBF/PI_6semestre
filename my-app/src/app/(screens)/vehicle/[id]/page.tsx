"use client";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUser,
  FaChevronDown,
  FaPencilAlt,
  FaChevronUp,
  FaWrench,
  FaPlus,
  FaPen,
} from "react-icons/fa";
import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { IoSpeedometerOutline, IoWaterOutline } from "react-icons/io5";
import { FaCarSide } from "react-icons/fa6";
import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";

// Dados simulados para o veículo
const mockVehicleDetails = {
  placa: "ABC-1234",
  modelo: "Onix",
  marca: "Chevrolet",
  ano: 2022,
  tipo: "Carro",
  motorista: "João Silva",
  odometro: "45.120 km",
  proximaManutencao: "50.000 km",
};

// Dados simulados para os abastecimentos
const mockAbastecimentos = [
  {
    id: 1,
    km_abastecimento: 45120,
    litros: 50.3,
    preco_litro: 5.99,
    data_hora: "20/08/2025 10:30",
    posto: "Posto Mirim (Interno)",
    tipo_combustivel: "Gasolina Comum",
    motorista: "João Silva",
    placa: "ABC-1234",
    total_abastecimento: 301.2,
    media: 5.0,
  },
  {
    id: 2,
    km_abastecimento: 44800,
    litros: 45.0,
    preco_litro: 6.25,
    data_hora: "15/08/2025 15:45",
    posto: "Shell (Externo)",
    tipo_combustivel: "Gasolina Aditivada",
    motorista: "João Silva",
    placa: "ABC-1234",
    total_abastecimento: 281.25,
    media: 6.0,
  },
  {
    id: 3,
    km_abastecimento: 43950,
    litros: 55.5,
    preco_litro: 5.89,
    data_hora: "10/08/2025 08:15",
    posto: "Posto Mirim (Interno)",
    tipo_combustivel: "Gasolina Comum",
    motorista: "João Silva",
    placa: "ABC-1234",
    total_abastecimento: 326.8,
    media: 5.5,
  },
  {
    id: 4,
    km_abastecimento: 43100,
    litros: 48.0,
    preco_litro: 6.1,
    data_hora: "05/08/2025 11:00",
    posto: "Posto Mirim (Interno)",
    tipo_combustivel: "Gasolina Comum",
    motorista: "João Silva",
    placa: "ABC-1234",
    total_abastecimento: 292.8,
    media: 5.8,
  },
  {
    id: 5,
    km_abastecimento: 42250,
    litros: 52.0,
    preco_litro: 6.05,
    data_hora: "01/08/2025 09:45",
    posto: "Ipiranga (Externo)",
    tipo_combustivel: "Gasolina Comum",
    motorista: "João Silva",
    placa: "ABC-1234",
    total_abastecimento: 314.6,
    media: 5.6,
  },
];

// Dados simulados para os alertas
const mockAlerts = [
  {
    id: 1,
    message: "Preço do litro acima do normal no último abastecimento.",
    type: "warning",
  },
  {
    id: 2,
    message: "Manutenção preventiva recomendada em 15 dias.",
    type: "info",
  },
  {
    id: 3,
    message: "Última média de consumo está abaixo do esperado.",
    type: "info",
  },
];

// Função para calcular a média de consumo dos últimos X abastecimentos
const calculateAverageConsumption = (data: any[], count: number) => {
  if (data.length < 2) return 0;

  const lastAbastecimentos = data.slice(0, count + 1);
  let totalKm = 0;
  let totalLitros = 0;

  for (let i = 0; i < lastAbastecimentos.length - 1; i++) {
    const kmTravelled =
      lastAbastecimentos[i].km_abastecimento -
      lastAbastecimentos[i + 1].km_abastecimento;
    totalKm += kmTravelled;
    totalLitros += lastAbastecimentos[i + 1].litros;
  }

  return totalLitros > 0 ? totalKm / totalLitros : 0;
};

// Função para calcular o consumo em relação ao abastecimento anterior
const calculateLastConsumption = (
  abastecimentoAtual: any,
  abastecimentoAnterior: any
) => {
  if (!abastecimentoAnterior || !abastecimentoAtual) return 0;
  const kmTravelled =
    abastecimentoAtual.km_abastecimento -
    abastecimentoAnterior.km_abastecimento;
  return abastecimentoAnterior.litros > 0
    ? kmTravelled / abastecimentoAnterior.litros
    : 0;
};

export default function VehicleDetails() {
  const editMaintenanceModal = useEditMaintenanceModal() as {
    onOpen: (id: string) => void;
  };
  const editFuelSupplyModal = useEditFuelSupplyModal() as {
    onOpen: (id: string) => void;
  };
  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
  };
  const editVehicleModal = useEditVehicleModal() as {
    onOpen: (id: string) => void;
  };
  const addFuelSupplyModal = useAddFuelSupplyModal() as { onOpen: () => void };
  const [showAlerts, setShowAlerts] = React.useState(false);
  const abastecimentos = mockAbastecimentos;
  const vehicle = mockVehicleDetails;
  const alerts = mockAlerts;

  // Mock de manutenções
  const mockMaintenance = [
    {
      id: 1,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Troca de Pneus",
      kmTroca: 50000, // próxima troca prevista
      kmAtual: 45120, // km atual do veículo
      kmUltimaTroca: 40000, // última troca
      proximaTroca: 4880, // diferença para próxima troca
      status: "Regular",
      dataUltimaTroca: "01/04/2025",
      responsavel: "Maria Oliveira",
      custo: 450.0,
    },
    {
      id: 2,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Alinhamento",
      kmTroca: 46000,
      kmAtual: 45120,
      kmUltimaTroca: 42000,
      proximaTroca: 880,
      status: "Próximo",
      dataUltimaTroca: "15/03/2025",
      responsavel: "Maria Oliveira",
      custo: 150.0,
    },
    {
      id: 3,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Troca de Óleo",
      kmTroca: 45000,
      kmAtual: 45120,
      kmUltimaTroca: 40000,
      proximaTroca: -120,
      status: "Atrasado",
      dataUltimaTroca: "10/02/2025",
      responsavel: "Maria Oliveira",
      custo: 350.0,
    },
    {
      id: 4,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Revisão",
      kmTroca: 50000,
      kmAtual: 45120,
      kmUltimaTroca: 40000,
      proximaTroca: 4880,
      status: "Regular",
      dataUltimaTroca: "20/03/2025",
      responsavel: "Maria Oliveira",
      custo: 800.0,
    },
    {
      id: 5,
      veiculo: "Carro FIAT",
      placa: "ABC-1234",
      tipo: "Troca de Filtro",
      kmTroca: 45120,
      kmAtual: 45120,
      kmUltimaTroca: 45120,
      proximaTroca: 10000,
      status: "Concluída",
      dataUltimaTroca: "25/04/2025",
      responsavel: "Maria Oliveira",
      custo: 120.0,
    },
  ];
  const totalMaintenance = mockMaintenance.length;
  const totalCost = mockMaintenance.reduce((acc, curr) => acc + curr.custo, 0);
  const urgentMaintenance = mockMaintenance.filter(
    (m) => m.proximaTroca <= 1000 || m.proximaTroca < 0
  ).length;

  // Função para cor do status
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

  // Calculando a média dos últimos 10 abastecimentos (ou menos se não houver 10)
  const averageConsumption = calculateAverageConsumption(abastecimentos, 10);
  // Ordenando os abastecimentos por ID para garantir a ordem correta na tabela
  const sortedAbastecimentos = [...abastecimentos].sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow p-8 space-y-8">
        <h1 className="text-3xl font-bold text-primary-purple">Veículo</h1>
        {/* Seção de Alertas Colapsável */}
        {alerts.length > 0 && (
          <div className="w-full flex justify-end">
            <div
              className={`bg-yellow-800 text-yellow-100 px-4 py-2 rounded-xl shadow-lg border border-yellow-500 text-sm font-semibold flex flex-col items-center gap-2 cursor-pointer ${
                showAlerts ? "w-full" : "w-fit"
              } transition-all duration-300 ${
                showAlerts ? "h-auto" : "h-full overflow-hidden"
              }`}
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <div className="flex justify-between items-center w-full gap-2">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle
                    size={24}
                    className="text-yellow-400"
                  />
                  <p className="text-xl text-yellow-300 font-bold">Alertas</p>
                  <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                    {alerts.length}
                  </span>
                </div>
                {showAlerts ? (
                  <FaChevronUp size={16} className="text-yellow-400" />
                ) : (
                  <FaChevronDown size={16} className="text-yellow-400" />
                )}
              </div>
              <ul
                className={`list-disc list-inside space-y-2 w-full mt-2 ${
                  showAlerts ? "" : "hidden"
                }`}
              >
                {alerts.map((alert) => (
                  <li key={alert.id} className="text-white text-sm">
                    {alert.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Seção de Dados do Veículo */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between space-x-4 mb-4">
            {/* <FaTruck size={48} className="text-primary-purple" /> */}
            <div>
              <h1 className="text-3xl font-bold text-primary-purple">
                {vehicle.modelo} - {vehicle.placa}
              </h1>
              <p className="text-xl text-gray-400">
                {vehicle.marca}, {vehicle.ano}
              </p>
            </div>
            <div>
              <button
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                onClick={() => editVehicleModal.onOpen(vehicle.placa)}
              >
                <FaPencilAlt
                  className="text-gray-300 hover:text-primary-purple trasition-colors duration-200"
                  size={16}
                />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
              <FaUser size={20} className="text-white/70" />
              <div>
                <p className="text-sm text-white/60">Motorista</p>
                <p className="font-semibold">{vehicle.motorista}</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
              <IoSpeedometerOutline size={30} className="text-white/70" />
              <div>
                <p className="text-sm text-white/60">Última quilometragem</p>
                <p className="font-semibold">{vehicle.odometro}</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
              <FaWrench size={30} className="text-white/70" />
              <div>
                <p className="text-sm text-white/60">Próxima manutenção</p>
                <p className="font-semibold">{vehicle.proximaManutencao}</p>
              </div>
            </div>
            {/* Novo card de média de consumo */}
            <div className="bg-primary-purple p-4 rounded-lg flex items-center space-x-3 text-white">
              <IoWaterOutline size={30} className="text-white" />
              <div>
                <p className="text-sm text-white/80">Média (últimos 10)</p>
                <p className="font-semibold text-lg">
                  {averageConsumption.toFixed(2)} Km/L
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela de Abastecimentos */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 relative">
          <h3 className="text-2xl font-semibold mb-4 text-primary-purple">
            Histórico de Abastecimentos
          </h3>
          {/* Botão de adicionar abastecimento no canto superior direito */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 flex items-center justify-center"
            title="Cadastrar Abastecimento"
            onClick={addFuelSupplyModal.onOpen}
          >
            <FaPlus size={20} className="text-white" />
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data e KM
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Abastecimento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Local e Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Motorista
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedAbastecimentos.map((abastecimento, index) => (
                  <tr key={abastecimento.id}>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div className="font-semibold text-white">
                        {abastecimento.data_hora}
                      </div>
                      <div>
                        {abastecimento.km_abastecimento.toLocaleString("pt-BR")}{" "}
                        km
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-gray-400">
                        {abastecimento.litros.toFixed(2)} L × R$
                        {abastecimento.preco_litro.toFixed(2)}
                      </div>
                      <div className="font-bold text-white">
                        R$ {abastecimento.total_abastecimento.toFixed(2)}
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
                        {abastecimento.motorista}
                      </div>
                      <div>{abastecimento.placa}</div>
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
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabela de Manutenções */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex itens-center space-x-4">
              <h3 className="text-2xl font-semibold text-primary-purple">
                Manutenções
              </h3>
              <div className="flex space-x-1 items-center">
                <IoSpeedometerOutline size={25} className="text-gray-400" />
                <h3 className="text-md font-medium text-gray-400">
                  {vehicle.odometro}
                </h3>
              </div>
            </div>
            {/* Botão de adicionar manutenção no canto superior direito */}
            <button
              className="ml-4 p-2 rounded-full bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 flex items-center justify-center"
              title="Adicionar Manutenção"
              onClick={addMaintenanceModal.onOpen}
            >
              <FaPlus size={20} className="text-white" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Veículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    KM Troca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
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
                      <div className="text-xs">{maintenance.placa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {maintenance.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="text-sm">
                        {maintenance.kmTroca.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full ${getStatusColor(
                          maintenance.status
                        )} text-white text-xs`}
                      >
                        {maintenance.status}
                        {/* Só mostra km se não for concluída */}
                        {maintenance.status !== "Concluída"
                          ? maintenance.proximaTroca < 0
                            ? ` (${Math.abs(maintenance.proximaTroca)} km)`
                            : ` (${maintenance.proximaTroca} km)`
                          : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="font-semibold text-white">
                        R$ {maintenance.custo.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        onClick={() =>
                          editMaintenanceModal.onOpen(maintenance.id.toString())
                        }
                      >
                        <FaPencilAlt
                          className="text-gray-300 hover:text-primary-purple trasition-colors duration-200"
                          size={16}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
