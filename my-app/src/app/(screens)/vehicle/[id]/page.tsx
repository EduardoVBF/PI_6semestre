"use client";
import { VehicleMaintenanceTable } from "@/components/tables/vehicleMaintenanceTable";
import { VehicleRefuelTable } from "@/components/tables/vehicleRefuelTable";
import { useVehicleAlerts } from "@/utils/hooks/useFetchVehiclesAlerts";
import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { IoSpeedometerOutline, IoWaterOutline } from "react-icons/io5";
import PendingAlerts from "@/components/sections/pendingAlerts";
import { FaUser, FaPencilAlt, FaWrench } from "react-icons/fa";
import Breadcrumb from "@/components/sections/breabcrumb";
import React, { useState, useEffect } from "react";
import { FaGear, FaTruck } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { TUserData } from "@/types/TUser";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loader from "@/components/loader";
import api from "@/utils/api";

export default function VehicleDetails() {
  const [vehicleData, setVehicleData] = useState<TGetVehicle | null>(null);
  const { data: alerts } = useVehicleAlerts(vehicleData?.id?.toString());
  const [userData, setUserData] = useState<TUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [avgConsumption, setAvgConsumption] = useState<number>(0);
  const { data: session } = useSession();
  const params = useParams();

  const editVehicleModal = useEditVehicleModal() as {
    onOpen: (vehicleId: TGetVehicle) => void;
    isOpen: boolean;
  };

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
        toast.error("Erro ao buscar dados do veículo.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [params?.id, session?.accessToken, editVehicleModal.isOpen]);

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
        toast.error("Erro ao buscar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleUserData();
  }, [params?.id, session?.accessToken, vehicleData?.id_usuario]);

  if (loading) {
    return <Loader />;
  }

  console.log("alertas do veículo:", alerts);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Toaster position="top-center" />
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

        {/* Seção de Alertas Colapsável */}
        {alerts && alerts?.length > 0 && (
          <PendingAlerts filteredData={{ alertas: alerts  }} />
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
                onClick={() =>
                  editVehicleModal.onOpen(vehicleData as TGetVehicle)
                }
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
                <p className="font-semibold">{vehicleData?.km_atual.toLocaleString("pt-BR")} km</p>
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
                  {avgConsumption > 0 ? `${avgConsumption.toFixed(2)} Km/L` : "—"}
                </p>
              </div>
            </div>
          </div>
        </section>
 
        {/* Tabela de Abastecimentos do veículo */}
        <VehicleRefuelTable
          vehicleData={vehicleData as TGetVehicle}
          vehicleUserData={userData as TUserData}
          onAverageChange={setAvgConsumption}
        />
 
         {/* Tabela de Manutenções */}
         <VehicleMaintenanceTable vehicleData={vehicleData as TGetVehicle} />
      </main>
      <Footer />
    </div>
  );
}
