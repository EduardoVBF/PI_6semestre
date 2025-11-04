"use client";
import { useEditUserModal } from "@/utils/hooks/useEditUserModal";
import { useAddUserModal } from "@/utils/hooks/useAddUserModal";
import { FaUsers, FaPencilAlt, FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "../loader";
import api from "@/utils/api";
import moment from "moment";
interface IUserData {
  cpf: string;
  created_at?: string;
  email?: string;
  id: string | number;
  lastName: string;
  name: string;
  status: string;
  type: string;
  updated_at?: string | null;
}

export default function UsersManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUserData[]>([]);
  const { data: session } = useSession();

  const editUserModal = useEditUserModal() as {
    onOpen: (userData: IUserData | null) => void;
    isOpen: boolean;
  };

  const addUserModal = useAddUserModal() as {
    onOpen: () => void;
    isOpen: boolean;
  };

  const handleUserType = (type: string) => {
    switch (type) {
      case "adm":
        return "Administrador";
      case "mecanico":
        return "Mecânico";
      case "motorista":
        return "Motorista";
      case "escritorio":
        return "Escritório";
      default:
        return "Usuário";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersResponse = await api.get("/api/v1/users/", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setUsers(usersResponse?.data?.users || []);
      } catch (error) {
        toast.error("Erro ao buscar usuários.");
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) fetchUsers();
  }, [session, addUserModal.isOpen, editUserModal.isOpen]);

  return (
    <div className="space-y-6 mt-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex gap-4 justify-end">
        <button
          className="flex items-center gap-2 bg-primary-purple text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-fuchsia-800 transition-colors duration-200 cursor-pointer"
          onClick={addUserModal.onOpen}
        >
          <FaPlus />
          Cadastrar Usuário
        </button>
      </div>
      {loading ? (
        <div className="w-full justify-center flex max-w-[400px] mx-auto mt-20">
          <Loader />
        </div>
      ) : (
        <>
          {/* Cards principais */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
              <FaUsers size={40} className="text-white opacity-75" />
              <div>
                <p className="text-base text-white/80">Total de Usuários</p>
                <h2 className="text-4xl font-bold">
                  {(users && users.length) || 0}
                </h2>
              </div>
            </div>
            <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
              <FaUsers size={40} className="text-white opacity-75" />
              <div>
                <p className="text-base text-white/80">Usuários Ativos</p>
                <h2 className="text-4xl font-bold">
                  {(users &&
                    users.filter((user) => user.status === "ativo").length) ||
                    0}
                </h2>
              </div>
            </div>
            <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
              <FaUsers size={40} className="text-white opacity-75" />
              <div>
                <p className="text-base text-white/80">Novos Usuários no mês</p>
                <h2 className="text-4xl font-bold">
                  {(users &&
                    users.filter((user) =>
                      moment(user.created_at).isSame(moment(), "month")
                    ).length) ||
                    0}
                </h2>
              </div>
            </div>
          </section>
          {/* Tabela de Usuários */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6">
            <h3 className="text-2xl font-semibold mb-4 text-primary-purple m-2">
              Usuários
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-600">
                  <tr>
                    <th
                      scope="col"
                      className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Função
                    </th>
                    <th
                      scope="col"
                      className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex gap-1 items-center">
                          <p className="capitalize">
                            {user.name} {user.lastName}
                          </p>
                          {user.type === "adm" && <p>⭐</p>}
                        </div>
                      </td>
                      <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                        {handleUserType(user.type)}
                      </td>
                      <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold capitalize text-xs ${
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
                      <td className="p-3 md:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                          onClick={() => editUserModal.onOpen(user)}
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
        </>
      )}
    </div>
  );
}
