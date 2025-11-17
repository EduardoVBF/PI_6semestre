"use client";
import {
  FaExclamationTriangle,
  FaUser,
  FaPencilAlt,
  FaWrench,
  FaPlus,
} from "react-icons/fa";
import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { IoSpeedometerOutline, IoWaterOutline } from "react-icons/io5";
import PendingAlerts from "@/components/sections/pendingAlerts";
import Breadcrumb from "@/components/sections/breabcrumb";
import { FaGear, FaTruck } from "react-icons/fa6";
import React, { useState, useEffect, use } from "react";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { TUserData } from "@/types/TUser";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loader from "@/components/loader";
import api from "@/utils/api";
import { set } from "react-hook-form";
import { TMaintenance, TGetAllMaintenances } from "@/types/TMaintenance";
import { TRefuel, TGetAllRefuels } from "@/types/TFuel";
import Pagination from "@/components/pagination";

interface IFuelSupply {
  id: number;
  km_abastecimento: number;
  litros: number;
  preco_litro: number;
  data_hora: string;
  posto: string;
  tipo_combustivel: string;
  motorista: string;
  placa: string;
  marca: string;
  modelo: string;
  total_abastecimento: number;
  media: number;
}

interface Alert {
  id: number;
  user: string;
  placa: string;
  veiculo: string;
  message: string;
  status?: "pendente";
}

interface Vehicle {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  motorista: string;
  odometro: string;
  proximaManutencao: string;
}

// Dados simulados para o veículo
const mockVehicleDetails: Vehicle = {
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
const mockAbastecimentos: IFuelSupply[] = [
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
    marca: "Chevrolet",
    modelo: "Onix",
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
    marca: "Chevrolet",
    modelo: "Onix",
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
    marca: "Chevrolet",
    modelo: "Onix",
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
    marca: "Chevrolet",
    modelo: "Onix",
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
    marca: "Chevrolet",
    modelo: "Onix",
    total_abastecimento: 314.6,
    media: 5.6,
  },
];

// Dados simulados para os alertas
const mockAlerts: Alert[] = [
  {
    id: 1,
    message: "Consumo maior que o normal",
    placa: "BQI0502",
    veiculo: "Caminhão IVECO",
    user: "José Silveira",
  },
  {
    id: 2,
    message: "Abastecimento suspeito",
    placa: "BSR9401",
    veiculo: "Carro FIAT",
    user: "João Silva",
  },
];

// Função para calcular a média de consumo dos últimos X abastecimentos
const calculateAverageConsumption = (data: IFuelSupply[], count: number) => {
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

export default function VehicleDetails() {
  const editMaintenanceModal = useEditMaintenanceModal() as {
    onOpen: (maintenanceData: TMaintenance) => void;
  };
  const editFuelSupplyModal = useEditFuelSupplyModal() as unknown as {
    onOpen: (fuelSupplyData: TRefuel) => void;
  };
  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
  };
  const editVehicleModal = useEditVehicleModal() as unknown as {
    onOpen: (vehicleId: TGetVehicle) => void;
  };

  const addFuelSupplyModal = useAddFuelSupplyModal() as { onOpen: () => void };
  const [maintenanceData, setMaintenanceData] = useState<TMaintenance[]>([]);
  const [fuelSupplyData, setFuelSupplyData] = useState<TRefuel[]>([]);
  const [fueltotal, setFuelTotal] = useState<number>(0);
  const [fuelpage, setFuelPage] = useState<number>(1);
  const [fuellimit, setFuelLimit] = useState<number>(3);
  const [vehicleData, setVehicleData] = useState<TGetVehicle | null>(null);
  const [userData, setUserData] = useState<TUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const params = useParams();

  const [showAlerts, setShowAlerts] = useState(false);
  const abastecimentos = mockAbastecimentos;
  const vehicle = mockVehicleDetails;
  const alerts = mockAlerts;

  const labelMap: Record<string, string> = {
    oleo: "Troca de óleo",
    filtro_oleo: "Filtro de óleo",
    filtro_combustivel: "Filtro de combustível",
    filtro_ar: "Filtro de ar",
    engraxamento: "Engraxamento",
  };

  // Função para cor do status
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

  // Calculando a média dos últimos 10 abastecimentos (ou menos se não houver 10)
  const averageConsumption = calculateAverageConsumption(abastecimentos, 10);
  // Ordenando os abastecimentos por ID para garantir a ordem correta na tabela
  const sortedAbastecimentos = [...abastecimentos].sort((a, b) => b.id - a.id);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!params?.id) return;
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const response = await api.get<TGetVehicle>(
          `/api/v1/vehicles/placa/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        setVehicleData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [params?.id, session?.accessToken]);

  // Buscar dados do usuário associado ao veículo
  useEffect(() => {
    const fetchVehicleUserData = async () => {
      if (!params?.id) return;
      if (!session?.accessToken) return;
      if (!vehicleData?.id_usuario) return;
      setLoading(true);

      try {
        const response = await api.get<TUserData>(
          `/api/v1/users/${vehicleData?.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleUserData();
  }, [params?.id, session?.accessToken, vehicleData?.id_usuario]);

  // Fetch maintenance data pelo id do veículo
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      if (!params?.id) return;
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const response = await api.get<TGetAllMaintenances>(
          `/api/v1/maintenances/placa/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        // console.log("Maintenance data:", response.data);
        setMaintenanceData(response.data);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [params?.id, session?.accessToken]);

  // Fetch dos abastecimentos do veículo
  useEffect(() => {
    const fetchFuelSupplies = async () => {
      if (!params?.id) return;
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const response = await api.get<TGetAllRefuels>(
          `/api/v1/refuels`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            params: {
              placa: params.id,
            },
          }
        );
        console.log("Fuel supplies data:", response.data);
        setFuelSupplyData(response.data.refuels);
        setFuelTotal(response.data.total);
        setFuelPage(response.data.page);
        setFuelLimit(response.data.per_page);
      } catch (error) {
        console.error("Error fetching fuel supplies data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuelSupplies();
  }, [params?.id, session?.accessToken]);

  if (loading) {
    return <Loader />;
  }

  // console.log("vehicleData:", vehicleData);
  console.log("fuelSupplyData:", fuelSupplyData);
  // console.log("userData:", userData);
  // console.log("session:", session);
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow py-6 px-4 md:px-8 space-y-4">
        <Breadcrumb
          items={[
            {
              label: "Gerenciamento",
              href: "/management",
              icon: <FaGear size={16} />,
            },
            {
              label: "Veículos",
              href: "/management#vehicles",
              icon: <FaTruck size={16} />,
            },
            { label: `${vehicleData?.modelo} - ${vehicleData?.placa}` },
          ]}
        />
        {/* <h1 className="text-3xl font-bold text-primary-purple">Veículo</h1> */}
        {/* Seção de Alertas Colapsável */}
        {alerts.length > 0 && (
          <PendingAlerts filteredData={{ alertas: mockAlerts }} />
        )}

        {/* Seção de Dados do Veículo */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 space-y-4">
          <div className="flex items-center justify-between space-x-4 mb-4">
            {/* <FaTruck size={48} className="text-primary-purple" /> */}
            <div>
              <h1 className="text-3xl font-bold text-primary-purple">
                {vehicleData?.modelo} - {vehicleData?.placa}
              </h1>
              <p className="text-xl text-gray-400">
                {vehicleData?.marca}, {vehicleData?.ano}
              </p>
            </div>
            <div>
              <button
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                onClick={() => editVehicleModal.onOpen(vehicleData as TGetVehicle)}
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
                <p className="font-semibold">
                  {userData?.name} {userData?.lastName}
                </p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
              <IoSpeedometerOutline size={30} className="text-white/70" />
              <div>
                <p className="text-sm text-white/60">Última quilometragem</p>
                <p className="font-semibold">{vehicleData?.km_atual} km</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
              <FaWrench size={30} className="text-white/70" />
              <div>
                <p className="text-sm text-white/60">Próxima manutenção</p>
                <p className="font-semibold">
                  {vehicleData?.km_prox_manutencao}
                </p>
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
        <section className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 relative">
          <h3 className="text-2xl font-semibold mb-4 text-primary-purple m-2 max-w-[80%]">
            Histórico de Abastecimentos
          </h3>
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
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data e KM
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Abastecimento
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Local e Tipo
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Motorista
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {fuelSupplyData.map((abastecimento) => (
                  <tr
                    key={abastecimento.id}
                    className={`${
                      1 !== 1 ? "bg-yellow-800/50" : ""
                    }`}
                  >
                    <td className="px-3 md:px-6 py-4 text-xs text-gray-400 flex items-center gap-2">
                      {1 !== 1 && (
                        <FaExclamationTriangle
                          size={18}
                          className="text-yellow-400"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-white">
                          {abastecimento.data} {abastecimento.hora}
                        </div>
                        <div>
                          {abastecimento.km.toLocaleString(
                            "pt-BR"
                          )}{" "}
                          km
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs">
                      <div className="font-bold text-white">
                        R$ {abastecimento.valor_total?.replace(".", ",")}
                      </div>
                      <div className="text-gray-400">
                        {abastecimento.litros.replace(".", ",")} L × R$
                        {abastecimento.valor_litro.replace(".", ",")}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs text-gray-400 capitalize">
                      <div className="font-semibold text-white">
                        {abastecimento.posto}
                      </div>
                      <div>{abastecimento.tipo_combustivel}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs text-gray-400">
                      <div className="font-semibold text-white">
                        {abastecimento.placa}
                      </div>
                      <p>{userData?.name} {userData?.lastName}</p>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs font-medium">
                      {abastecimento.media ? (

                      <span className="px-3 py-1 rounded-full bg-primary-purple bg-opacity-20 text-white truncate">
                        {abastecimento.media} km/L
                      </span>
                      ) : (
                        <span className="text-gray-500 italic">—</span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        onClick={() =>
                          editFuelSupplyModal.onOpen(
                            abastecimento as TRefuel
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
        <section className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col md:flex-row md:items-center space-x-4 m-2">
              <h3 className="text-2xl font-semibold text-primary-purple">
                Manutenções Preventivas
              </h3>
              <div className="flex space-x-1 items-center">
                <IoSpeedometerOutline size={25} className="text-gray-400" />
                <h3 className="text-md font-medium text-gray-400">
                  {vehicleData?.km_atual} km
                </h3>
              </div>
            </div>
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
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    KM Manutenção
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Manutenções Realizadas
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-600">
                {maintenanceData.map((maintenance) => (
                  <tr key={maintenance.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {maintenance.placa}
                    </td>
                    <td className="p-3 text-sm text-gray-300">
                      {maintenance.created_at
                        ? new Date(maintenance.created_at).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {maintenance.km_atual.toLocaleString()} km
                    </td>
                    <td className="p-3 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries({
                          oleo: maintenance.oleo,
                          filtro_oleo: maintenance.filtro_oleo,
                          filtro_combustivel: maintenance.filtro_combustivel,
                          filtro_ar: maintenance.filtro_ar,
                          engraxamento: maintenance.engraxamento,
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
                          maintenance.oleo ||
                          maintenance.filtro_oleo ||
                          maintenance.filtro_combustivel ||
                          maintenance.filtro_ar ||
                          maintenance.engraxamento
                        ) && (
                          <span className="text-gray-500 italic text-xs">
                            Nenhuma realizada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          maintenance.status
                        )}`}
                      >
                        {maintenance.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs">
                      <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                        <FaPencilAlt
                          className="text-gray-300 hover:text-primary-purple transition-colors duration-200"
                          size={16}
                          onClick={() =>
                            editMaintenanceModal.onOpen(maintenance)
                          }
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
