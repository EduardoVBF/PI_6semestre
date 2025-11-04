"use client";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { TUser } from "@/types/TUser";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Loader from "../loader";
import api from "@/utils/api";

export default function AddUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<TUser>({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      cpf: "",
      type: "adm",
      status: "ativo",
      password: "",
    },
  });

  const handleCloseModal = () => {
    reset();
    setIsLoading(false);
    onClose();
  };

  const handleAddUser = async (data: TUser) => {
    setIsLoading(true);

    try {
      await api.post(`/api/v1/users/`, data);
      toast.success("Usuário cadastrado com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-lg flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={handleCloseModal}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Cadastrar Usuário
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 px-10">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Nome"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sobrenome</label>
                <Input
                  {...register("lastName")}
                  type="text"
                  placeholder="Sobrenome"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <Input
                {...register("email")}
                type="text"
                placeholder="Email"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CPF</label>
              <Input
                {...register("cpf")}
                type="text"
                placeholder="CPF"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Função</label>
              <select
                {...register("type")}
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              >
                <option value="adm">Gerente</option>
                <option value="mecanico">Mecânico</option>
                <option value="motorista">Motorista</option>
                <option value="escritorio">Escritório</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                {...register("status")}
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Senha"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? "Cadastrando..." : "Cadastrar Usuário"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
