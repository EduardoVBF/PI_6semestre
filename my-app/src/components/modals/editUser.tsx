"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TUser } from "@/types/TUser";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";

export default function EditUserModal({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: TUser | null;
}) {
  const [userId, setUserId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { register, handleSubmit, reset, setValue } = useForm<TUser>({
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

  useEffect(() => {
    if (isOpen && userData) {
      setUserId(userData.id);

      setValue("name", userData.name);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("cpf", userData.cpf);
      setValue("type", userData.type);
      setValue("status", userData.status);
    }
  }, [isOpen, userData]);

  const handleCloseModal = () => {
    reset();
    onClose();
    setIsLoading(false);
  };

  const handleUserEdit = async (data: TUser) => {
    setIsLoading(true);

    try {
      if (!userId) {
        toast.error("ID do usuário não encontrado.");
        setIsLoading(false);
        return;
      }

      if (!session?.accessToken) {
        toast.error("Usuário não autenticado.");
        setIsLoading(false);
        return;
      }

      // Remove o campo password se estiver vazio
      const payload = { ...data };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }

      await api.patch(`/api/v1/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Usuário atualizado com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    } finally {
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
          Editar Usuário
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 px-10">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleUserEdit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Nome"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sobrenome
                </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                {...register("email")}
                type="text"
                placeholder="Email"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                CPF
              </label>
              <Input
                {...register("cpf")}
                type="text"
                placeholder="CPF"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Função
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
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
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <p className="text-gray-300 text-xs">Se não deseja alterar a senha, deixe este campo vazio</p>
              </div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Senha"
                // required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
