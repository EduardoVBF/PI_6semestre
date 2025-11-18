import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import { TMaintenance, TGetAllMaintenances } from "@/types/TMaintenance";
import { IoSpeedometerOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Pagination from "../pagination";
import Loader from "../loader";
import api from "@/utils/api";

export const VehicleMaintenanceTable: React.FC<{
  vehicleData: TGetVehicle;
}> = ({ vehicleData }) => {
  const [maintenanceData, setMaintenanceData] = useState<TMaintenance[]>([]);
  const [maintenanceTotal, setMaintenanceTotal] = useState<number>(0);
  const [maintenancelimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const params = { id: vehicleData?.placa };

  const addMaintenanceModal = useAddMaintenanceModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };
  const editMaintenanceModal = useEditMaintenanceModal() as {
    onOpen: (maintenanceData: TMaintenance) => void;
    isOpen: boolean;
  };

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

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "cancelada":
        return "Cancelada";
      case "pendente":
        return "Pendente";
      case "concluida":
        return "Concluída";
      case "em_andamento":
        return "Em andamento";
      default:
        return "Desconhecido";
    }
  };

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
        setMaintenanceData(response.data);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        toast.error("Erro ao buscar dados de manutenção.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [
    params?.id,
    session?.accessToken,
    editMaintenanceModal.isOpen,
    addMaintenanceModal.isOpen,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center space-x-4 m-2">
          <h3 className="text-2xl font-semibold text-primary-purple">
            Manutenções Preventivas
          </h3>
          <div className="flex space-x-1 items-center">
            <IoSpeedometerOutline size={25} className="text-gray-400" />
            <h3 className="text-md font-medium text-gray-400">
              {vehicleData?.km_atual?.toLocaleString("pt-BR")} km
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
                    ? new Date(maintenance.created_at).toLocaleDateString(
                        "pt-BR"
                      )
                    : "—"}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {vehicleData?.km_atual?.toLocaleString("pt-BR")} km
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
                    {getStatusLabel(maintenance.status)}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 text-xs">
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
        <Pagination
          page={page}
          totalPages={Math.ceil(maintenanceTotal / maintenancelimit)}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
};
