"use client";
import { useEditUserModal } from "@/utils/hooks/useEditUserModal";
import { FaUsers, FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React from "react";

export default function UsersManagement() {
  const editUserModal = useEditUserModal() as { onOpen: (data: any) => void };
  const mockUsers = [
    {
      id: 1,
      nome: "João",
      sobrenome: "Silva",
      telefone: "(11) 98765-4321",
      funcao: "Motorista",
      admin: false,
      status: "ativo",
    },
    {
      id: 2,
      nome: "Maria",
      sobrenome: "Oliveira",
      telefone: "(21) 91234-5678",
      funcao: "Gerente",
      admin: true,
      status: "pendente",
    },
    {
      id: 3,
      nome: "Pedro",
      sobrenome: "Souza",
      telefone: "(31) 95555-4444",
      funcao: "Motorista",
      admin: false,
      status: "inativo",
    },
    {
      id: 4,
      nome: "Ana",
      sobrenome: "Costa",
      telefone: "(41) 99999-8888",
      funcao: "Motorista",
      admin: false,
      status: "ativo",
    },
  ];
  const totalUsers = mockUsers.length;

  const router = useRouter();

  return (
    <div className="space-y-6 mt-6">
      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Total de Usuários</p>
            <h2 className="text-4xl font-bold">{(Math.random() * 20).toFixed(0)}</h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Usuários Ativos</p>
            <h2 className="text-4xl font-bold">{(Math.random() * 10).toFixed(0)}</h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Novos Usuários no mês</p>
            <h2 className="text-4xl font-bold">{(Math.random() * 5).toFixed(0)}</h2>
          </div>
        </div>
      </section>
      {/* Tabela de Usuários */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-primary-purple">
          Usuários
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Telefone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Função</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  {/* ...existing code... */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex gap-1 items-center">
                      <p>{user.nome} {user.sobrenome}</p>
                      {user.admin && <p>⭐</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.telefone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.funcao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs ${
                        user.status === "ativo"
                          ? "bg-green-700 text-white"
                          : user.status === "inativo"
                          ? "bg-red-700 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      onClick={() => editUserModal.onOpen(user)}
                    >
                      <FaPencilAlt className="text-gray-300 hover:text-primary-purple transition-colors duration-200" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
