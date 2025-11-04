"use client";
import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { useAddVehicleModal } from "@/utils/hooks/useAddVehicleModal";
import { FaTruck, FaPlus, FaPencilAlt } from "react-icons/fa";
import { TUsersResponse, TUserData } from "@/types/TUser";
import React, { useEffect, useState } from "react";
import { TPostVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { TUser } from "@/types/TUser";
import api from "@/utils/api";
import Loader from "../loader";

export default function VehiclesManagement() {
  const editVehicleModal = useEditVehicleModal() as {
    onOpen: (vehicle: TPostVehicle | null) => void;
  };
  const addVehicleModal = useAddVehicleModal() as { onOpen: () => void };
  const [vehiclesTotals, setVehiclesTotals] = useState<{
    total: number;
    active: number;
    inactive: number;
  }>({ total: 0, active: 0, inactive: 0 });
  const [vehicles, setVehicles] = useState<TPostVehicle[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const getUserInfosbyId = (id: string) => {
    if (users.length === 0) return "N/A";
    const user = users.find((u) => u.id === id);
    return user ? `${user.name} ${user.lastName}` : "N/A";
  };

  useEffect(() => {
    if (!session) return;

    const fetchVehicles = async () => {
      setLoading(true);

      try {
        const response = await api.get("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        setVehiclesTotals({
          total: response.data.total,
          active: response.data.vehicles.length,
          inactive: 0,
        });
        setVehicles(response.data.vehicles);
      } catch {
        toast.error("Erro ao carregar veículos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [session]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await api.get<TUsersResponse>("/api/v1/users/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: {
            limit: 1000,
          },
        });

        setUsers(
          res.data.users.map((u) => ({
            ...u,
            type: u.type as TUser["type"],
          })) as TUser[]
        );
      } catch {
        toast.error("Erro ao carregar usuários.");
      }
    };

    fetchUsers();
  }, [session]);

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
            <h2 className="text-4xl font-bold">{vehiclesTotals.total}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Ativos</p>
            <h2 className="text-4xl font-bold">{vehiclesTotals.active}</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Inativos</p>
            <h2 className="text-4xl font-bold">{vehiclesTotals.inactive}</h2>
          </div>
        </div>
      </section>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : (
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
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.placa}
                      className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                      onClick={() => router.push(`/vehicle/${vehicle.placa}`)}
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {vehicle.placa}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {vehicle.modelo}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {vehicle.marca}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {vehicle.ano}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {vehicle.tipo}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {getUserInfosbyId(vehicle.id_usuario)}
                      </td>
                      <td className="p-3 md:px-6 py-4 text-xs">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      Nenhum veículo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
