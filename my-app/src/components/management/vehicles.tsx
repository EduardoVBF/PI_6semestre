"use client";
import React, { useEffect, useState } from "react";
import { FaTruck, FaPencilAlt, FaPlus, FaFilter } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Loader from "../loader";
import api from "@/utils/api";
import Pagination from "../pagination";
import SearchBar from "../searchBar";
import Filters from "../filters";

import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import { useAddVehicleModal } from "@/utils/hooks/useAddVehicleModal";

import type { TPostVehicle, VehicleQueryParams } from "@/types/TVehicle";
import type { TUser, TUsersResponse } from "@/types/TUser";

export default function VehiclesManagement() {
  const router = useRouter();
  const { data: session } = useSession();

  const editVehicleModal = useEditVehicleModal() as {
    onOpen: (vehicle: TPostVehicle | null) => void;
    isOpen: boolean;
  };

  const addVehicleModal = useAddVehicleModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };

  const [vehicles, setVehicles] = useState<TPostVehicle[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(false);

  // estado para mostrar/ocultar filtros (colapsável)
  const [showFilters, setShowFilters] = useState(false);
  // Filtros e paginação
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [frota, setFrota] = useState("");
  const [manutencaoVencida, setManutencaoVencida] = useState<string>("");

  const tipoOptions = [
    { label: "Caminhão", value: "caminhao" },
    { label: "Carro", value: "carro" },
    { label: "Van", value: "van" },
  ];

  const getUserInfosById = (id: string) => {
    if (users.length === 0) return "N/A";
    const user = users.find((u) => u.id === id);
    return user ? `${user.name} ${user.lastName}` : "N/A";
  };

  // 🔹 Buscar veículos com paginação e filtros
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        const skip = (page - 1) * perPage;
        const params: VehicleQueryParams = { skip, limit: perPage };

        if (search) params.search = search;
        if (tipo) params.tipo = tipo;
        if (frota) params.frota = frota;
        if (manutencaoVencida) params.manutencao_vencida = manutencaoVencida;

        const res = await api.get("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params,
        });

        setVehicles(res.data.vehicles);
        setTotal(res.data.total);
      } catch {
        toast.error("Erro ao carregar veículos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [
    session,
    perPage,
    page,
    search,
    tipo,
    frota,
    manutencaoVencida,
    addVehicleModal.isOpen,
    editVehicleModal.isOpen,
  ]);

  // 🔹 Buscar estatísticas gerais
  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await api.get("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        const all = res.data.vehicles;
        const total = all.length;
        const active = all.length;
        const inactive = total - active;

        setStats({ total, active, inactive });
      } catch {
        toast.error("Erro ao carregar estatísticas de veículos.");
      }
    };

    fetchStats();
  }, [session, addVehicleModal.isOpen, editVehicleModal.isOpen]);

  // 🔹 Buscar motoristas
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await api.get<TUsersResponse>("/api/v1/users", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        setUsers(res.data.users as TUser[]);
      } catch {
        toast.error("Erro ao carregar motoristas.");
      }
    };

    fetchUsers();
  }, [session]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6 mt-6">
      <Toaster position="top-center" />

      {/* Botão de adicionar */}
      <div className="flex flex-col md:flex-row justify-end gap-4 items-center">
        <button
          onClick={addVehicleModal.onOpen}
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors"
        >
          <FaPlus /> Cadastrar Veículo
        </button>
      </div>

      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Total de Veículos</p>
            <h2 className="text-4xl font-bold">{stats.total}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Ativos</p>
            <h2 className="text-4xl font-bold">{stats.active}</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaTruck size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Veículos Inativos</p>
            <h2 className="text-4xl font-bold">{stats.inactive}</h2>
          </div>
        </div>
      </section>

      {/* Tabela */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h3 className="text-2xl font-semibold text-primary-purple">
            Veículos
          </h3>

          <div className="flex gap-4 w-full lg:w-auto flex-col md:flex-row items-start md:items-center">
            <div
              className="flex items-center gap-2 bg-gray-800 rounded-xl w-fit p-1 cursor-pointer text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className="text-sm">
                <FaFilter />
              </button>
              <p className="text-sm">
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </p>
            </div>
          </div>
        </div>

        {/* area colapsável de filtros */}

        {showFilters && (
          <Filters
            groups={[
              {
                key: "tipo",
                label: "Tipo",
                options: tipoOptions,
                selected: tipo,
                onChange: setTipo,
              },
            ]}
          />
        )}

        <div className="w-full">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por placa, modelo ou marca..."
            width="w-full md:w-64 lg:w-full"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Placa
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Modelo
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Marca
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Ano
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Tipo
                    </th>
                    {/* <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Frota
                  </th> */}
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Motorista
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700 text-sm">
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <tr
                        key={vehicle.placa}
                        className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                        onClick={() => router.push(`/vehicle/${vehicle.placa}`)}
                      >
                        <td className="p-3 text-gray-300">{vehicle.placa}</td>
                        <td className="p-3 text-gray-300 capitalize">
                          {vehicle.modelo}
                        </td>
                        <td className="p-3 text-gray-300 capitalize">
                          {vehicle.marca}
                        </td>
                        <td className="p-3 text-gray-300">{vehicle.ano}</td>
                        <td className="p-3 text-gray-300 capitalize">
                          {vehicle.tipo}
                        </td>
                        {/* <td className="p-3 text-gray-300 capitalize">
                        {vehicle.frota || "—"}
                      </td> */}
                        <td className="p-3 text-gray-300 capitalize">
                          {getUserInfosById(vehicle.id_usuario)}
                        </td>

                        <td className="p-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editVehicleModal.onOpen(vehicle);
                            }}
                            className="p-2 rounded-lg hover:bg-gray-700"
                          >
                            <FaPencilAlt
                              className="text-gray-300 hover:text-primary-purple"
                              size={16}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-6 text-gray-400 text-sm"
                      >
                        Nenhum veículo encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
