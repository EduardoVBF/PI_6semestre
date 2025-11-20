"use client";
import { TUser, TUsersResponse } from "@/types/TUser";
import React, { useEffect, useState } from "react";
import { TPostVehicle } from "@/types/TVehicle";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import Loader from "../loader";
import api from "@/utils/api";

export default function AddVehicleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
  } = useForm<TPostVehicle>();

  const handleCloseModal = () => {
    reset();
    onClose();
    setIsLoading(false);
  };

  // Implemente sua função de envio aqui quando a API estiver pronta
  const handlePostVehicle = async (data: TPostVehicle) => {
    if (!session?.accessToken) return;

    setIsLoading(true);

    try {
      const payload: TPostVehicle = { ...data };

      await api.post("/api/v1/vehicles/", payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Veículo cadastrado com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);
      toast.error("Erro ao cadastrar veículo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await api.get<TUsersResponse>("/api/v1/users/", {
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
          Cadastrar Veículo
        </h1>

        <form
          className="space-y-4"
          onSubmit={handleFormSubmit(handlePostVehicle)}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Placa
                </label>
                <Input
                  {...register("placa")}
                  type="text"
                  placeholder="Placa"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Modelo
                  </label>
                  <Input
                    {...register("modelo")}
                    type="text"
                    placeholder="Modelo"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Marca
                  </label>
                  <Input
                    {...register("marca")}
                    type="text"
                    placeholder="Marca"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ano
                  </label>
                  <Input
                    {...register("ano")}
                    type="number"
                    placeholder="Ano"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    {...register("tipo")}
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  >
                    <option value="" disabled className="text-xs">
                      Selecione um tipo de veículo
                    </option>
                    <option value="carro" className="text-sm">
                      Carro
                    </option>
                    <option value="caminhao" className="text-sm">
                      Caminhão
                    </option>
                    <option value="van" className="text-sm">
                      Van
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    KM atual
                  </label>
                  <Input
                    {...register("km_atual")}
                    type="number"
                    placeholder="KM atual"
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Frequência de manutenção (km)
                  </label>
                  <Input
                    {...register("frequencia_km_manutencao")}
                    type="number"
                    placeholder="Frequência de manutenção (km)"
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Capacidade do tanque
                </label>
                <Input
                  {...register("capacidade_tanque")}
                  type="number"
                  placeholder="Capacidade do tanque"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Motorista
                </label>
                <select
                  {...register("id_usuario")}
                  className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                >
                  <option value="" disabled className="text-xs">
                    Selecione um motorista
                  </option>
                  {users
                    .filter((user) => user.type === "motorista" && user.status === "ativo")
                    .map((motorista) => (
                      <option
                        key={motorista.id}
                        value={motorista.id}
                        className="capitalize text-sm"
                      >
                        {motorista.name} {motorista.lastName}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
