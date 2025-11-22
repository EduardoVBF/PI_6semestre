import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import { FaPlus, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaExclamationTriangle, FaPencilAlt } from "react-icons/fa";
import { TRefuel, TGetAllRefuels } from "@/types/TFuel";
import { IoSpeedometerOutline } from "react-icons/io5";
import React, { useState, useEffect, useMemo } from "react";
import { TGetVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { TUserData } from "@/types/TUser";
import { toast } from "react-hot-toast";
import Pagination from "../pagination";
import Loader from "../loader";
import api from "@/utils/api";
import dayjs from "dayjs";
import { useVehicleAlerts } from "@/utils/hooks/useFetchVehiclesAlerts";
import { TAlert } from "@/types/TAlerts";

export const VehicleRefuelTable: React.FC<{
  vehicleData: TGetVehicle;
  vehicleUserData: TUserData;
  onAverageChange?: (avg: number) => void;
}> = ({ vehicleData, vehicleUserData, onAverageChange }) => {
  const [fuelSupplyData, setFuelSupplyData] = useState<TRefuel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fueltotal, setFuelTotal] = useState<number>(0);
  const [fuelpage, setFuelPage] = useState<number>(1);
  const [fuellimit] = useState<number>(10);
  const [page, setPage] = useState(1);

  const { data: session } = useSession();
  const params = { id: vehicleData?.id };
  const { data: alerts } = useVehicleAlerts(vehicleData?.id?.toString());

  const addFuelSupplyModal = useAddFuelSupplyModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };
  const editFuelSupplyModal = useEditFuelSupplyModal() as {
    onOpen: (fuelSupplyData: TRefuel) => void;
    isOpen: boolean;
  };

  // Fetch dos abastecimentos do veículo
  useEffect(() => {
    const fetchFuelSupplies = async () => {
      if (!params?.id) return;
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const skip = (page - 1) * fuellimit;
        type UsersQueryParams = {
          skip: number;
          limit: number;
          placa: string;
        };
        const params: UsersQueryParams = {
          skip,
          limit: fuellimit,
          placa: vehicleData?.placa as string,
        };

        const response = await api.get<TGetAllRefuels>(`/api/v1/refuels/`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          params,
        });
        setFuelSupplyData(response.data.refuels);
        setFuelTotal(response.data.total);
        setFuelPage(response.data.page);
      } catch (error) {
        console.error("Error fetching fuel supplies data:", error);
        toast.error("Erro ao buscar dados de abastecimentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFuelSupplies();
  }, [
    params?.id,
    session?.accessToken,
    editFuelSupplyModal.isOpen,
    addFuelSupplyModal.isOpen,
    page,
    fuellimit,
    vehicleData?.placa,
  ]);

  // compute average from last 10 refuels and notify parent if provided
  useEffect(() => {
    if (!fuelSupplyData || fuelSupplyData.length === 0) {
      onAverageChange?.(0);
      return;
    }
    const recent = fuelSupplyData.slice(-10);
    const values = recent
      .map((r) => {
        const v = Number(r.media);
        return Number.isFinite(v) && v > 0 ? v : null;
      })
      .filter((v) => v !== null) as number[];

    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

    onAverageChange?.(avg);
  }, [fuelSupplyData, onAverageChange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center space-x-4 m-2">
        <h3 className="text-2xl font-semibold text-primary-purple">
          Histórico de Abastecimentos
        </h3>
        <div className="flex space-x-1 items-center">
          <IoSpeedometerOutline size={25} className="text-gray-400" />
          <h3 className="text-md font-medium text-gray-400">
            {vehicleData?.km_atual?.toLocaleString("pt-BR")} km
          </h3>
        </div>
      </div>
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
              <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider max-w-[100px]">
                Tanque cheio
              </th>
              <th className="px-3 md:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {fuelSupplyData.map((abastecimento) => {
              const hasAlert = alerts?.some(
                (alert: TAlert) => alert.id_abastecimento === abastecimento.id
              );

              return (
                <tr
                  key={abastecimento.id}
                  className={`${hasAlert ? "bg-yellow-800/50" : ""}`}
                >
                  <td className="px-3 md:px-6 py-4 text-xs text-gray-400 flex items-center gap-2">
                    {hasAlert && (
                      <FaExclamationTriangle
                        size={18}
                        className="text-yellow-400"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-white">
                        {dayjs(abastecimento.data).format("DD/MM/YYYY")}{" "}
                        {abastecimento.hora}
                      </div>
                      <div>{abastecimento.km.toLocaleString()} km</div>
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
                    <p className="capitalize">
                      {vehicleUserData?.name} {vehicleUserData?.lastName}
                    </p>
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
                    {abastecimento.tanque_cheio ? (
                      <FaCircleCheck className="text-green-500" size={18} />
                    ) : (
                      <FaCircleXmark className="text-red-500" size={18} />
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-4 text-xs">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      onClick={() =>
                        editFuelSupplyModal.onOpen(abastecimento as TRefuel)
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
        <Pagination
          page={page}
          totalPages={Math.ceil(fueltotal / fuellimit)}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
};
