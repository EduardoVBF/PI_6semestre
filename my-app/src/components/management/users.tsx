"use client";
import React, { useEffect, useState } from "react";
import { FaUsers, FaPencilAlt, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "../loader";
import api from "@/utils/api";
import dayjs from "dayjs";

import Pagination from "../pagination";
import SearchBar from "../searchBar";
import Filters from "../filters";

import { useEditUserModal } from "@/utils/hooks/useEditUserModal";
import { useAddUserModal } from "@/utils/hooks/useAddUserModal";

import type { TUserData, TUsersResponse } from "@/types/TUser";

export default function UsersManagement() {
  const [users, setUsers] = useState<TUserData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAtivos: 0,
    novosUsuarios: 0,
  });
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const statusOptions = ["ativo", "inativo", "pendente"];
  const typeOptions = [
    {
      label: "Administrador",
      value: "adm",
    },
    {
      label: "Mecânico",
      value: "mecanico",
    },
    {
      label: "Motorista",
      value: "motorista",
    },
    {
      label: "Escritório",
      value: "escritorio",
    },
  ];

  const editUserModal = useEditUserModal() as {
    onOpen: (userData: TUserData | null) => void;
    isOpen: boolean;
  };

  const addUserModal = useAddUserModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;
      setLoading(true);
      try {
        const skip = (page - 1) * perPage;
        type UsersQueryParams = {
          skip: number;
          limit: number;
          search?: string;
          status?: string;
          user_type?: string;
        };
        const params: UsersQueryParams = { skip, limit: perPage };
        if (search) params.search = search;
        if (status) params.status = status;
        if (type) params.user_type = type;

        const res = await api.get<TUsersResponse>("/api/v1/users/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params,
        });

        setUsers(res.data.users);
        setTotal(res.data.total);
      } catch {
        toast.error("Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [
    session,
    perPage,
    page,
    search,
    status,
    type,
    addUserModal.isOpen,
    editUserModal.isOpen,
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await api.get<TUsersResponse>("/api/v1/users/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: {
            limit: 1000,
          },
        });

        const allUsers = res.data.users;
        const totalUsers = allUsers.length;
        const totalAtivos = allUsers.filter((u) => u.status === "ativo").length;
        const novosUsuarios = allUsers.filter((user) => {
          if (!user.created_at) return false;
          const createdDate = dayjs(user.created_at);
          return createdDate.isAfter(dayjs().subtract(30, "day"));
        }).length;

        setStats({ totalUsers, totalAtivos, novosUsuarios });
      } catch {
        toast.error("Erro ao carregar estatísticas de usuários.");
      }
    };

    fetchStats();
  }, [session, addUserModal.isOpen, editUserModal.isOpen]);

  const handleUserType = (type: string) => {
    const map: Record<string, string> = {
      adm: "Administrador",
      mecanico: "Mecânico",
      motorista: "Motorista",
      escritorio: "Escritório",
    };
    return map[type] || "Usuário";
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6 mt-6">
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row justify-end gap-4 items-center">
        <button
          onClick={addUserModal.onOpen}
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors"
        >
          <FaPlus /> Cadastrar Usuário
        </button>
      </div>

      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Total de Usuários</p>
            <h2 className="text-4xl font-bold">{stats.totalUsers || 0}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Usuários Ativos</p>
            <h2 className="text-4xl font-bold">{stats.totalAtivos || 0}</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Novos Usuários no mês</p>
            <h2 className="text-4xl font-bold">{stats.novosUsuarios || 0}</h2>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-lg p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h3 className="text-2xl font-semibold text-primary-purple">
              Usuários
            </h3>

            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
              <Filters
                statusOptions={statusOptions}
                typeOptions={typeOptions}
                selectedStatus={status}
                selectedType={type}
                onStatusChange={setStatus}
                onTypeChange={setType}
              />
            </div>
          </div>
          <div className="w-full">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome ou email..."
              width="w-full md:w-64 lg:w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Nome
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Email
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Função
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Criado
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700 text-sm">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="p-3 text-gray-300 capitalize">
                        {user.name} {user.lastName}
                      </td>
                      <td className="p-3 text-gray-300">{user.email}</td>
                      <td className="p-3 text-gray-300 capitalize">
                        {handleUserType(user.type)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.status === "ativo"
                              ? "bg-green-700 text-white"
                              : user.status === "inativo"
                              ? "bg-red-700 text-white"
                              : "bg-yellow-600 text-white"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 text-sm">
                        {user.created_at
                          ? dayjs(user.created_at).format("DD/MM/YYYY")
                          : "—"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => editUserModal.onOpen(user)}
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
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      Nenhum usuário encontrado.
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
        </div>
      )}
    </div>
  );
}
