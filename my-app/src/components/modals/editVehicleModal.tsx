"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import Loader from "../loader";
import api from "@/utils/api";
import { TUser, TUsersResponse } from "@/types/TUser";
import { TGetVehicle, TPostVehicle } from "@/types/TVehicle";

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: TGetVehicle | null;
}) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit: handleFormSubmit, reset } = useForm<TPostVehicle>();

  const handleCloseModal = () => {
    reset();
    onClose();
    setIsLoading(false);
  };

  // Atualizar veículo
  const handleUpdateVehicle = async (data: TPostVehicle) => {
    if (!session?.accessToken || !vehicle) return;

    setIsLoading(true);
    try {
      await api.patch(`/api/v1/vehicles/${vehicle.id}`, data, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Veículo atualizado com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      toast.error("Erro ao atualizar veículo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar motoristas
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

  // Carregar dados do veículo no form ao abrir
  useEffect(() => {
    if (vehicle) {
      reset({
        placa: vehicle.placa,
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        ano: vehicle.ano,
        tipo: vehicle.tipo,
        km_atual: vehicle.km_atual,
        capacidade_tanque: vehicle.capacidade_tanque,
        frequencia_km_manutencao: vehicle.frequencia_km_manutencao,
        id_usuario: vehicle.id_usuario?.toString() || "",
      });
    }
  }, [vehicle, reset]);

  // Garantir que o motorista certo apareça selecionado após carregar os usuários
  useEffect(() => {
    if (vehicle && users.length > 0) {
      const motorista = users.find((u) => u.id === vehicle.id_usuario);
      reset((prev) => ({
        ...prev,
        id_usuario: motorista ? motorista.id.toString() : "",
      }));
    }
  }, [users, vehicle, reset]);

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
          Editar Veículo
        </h1>

        <form className="space-y-4" onSubmit={handleFormSubmit(handleUpdateVehicle)}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {/* Placa */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Placa
                </label>
                <Input
                  {...register("placa")}
                  type="text"
                  placeholder="Placa"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>

              {/* Modelo / Marca */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Modelo
                  </label>
                  <Input
                    {...register("modelo")}
                    type="text"
                    placeholder="Modelo"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
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
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Ano / Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ano
                  </label>
                  <Input
                    {...register("ano")}
                    type="number"
                    placeholder="Ano"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    {...register("tipo")}
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  >
                    <option value="carro">Carro</option>
                    <option value="caminhao">Caminhão</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>

              {/* KM e manutenção */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    KM atual
                  </label>
                  <Input
                    {...register("km_atual")}
                    type="number"
                    placeholder="KM atual"
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
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
                    className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white 
                               focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Capacidade */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Capacidade do tanque
                </label>
                <Input
                  {...register("capacidade_tanque")}
                  type="number"
                  placeholder="Capacidade do tanque"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>

              {/* Motorista */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Motorista
                </label>
                <select
                  {...register("id_usuario")}
                  className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white 
                             focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                >
                  {!users.length ? (
                    <option value={vehicle?.id_usuario} disabled>
                      Carregando motoristas...
                    </option>
                  ) : (
                    <>
                      <option value="">Selecione um motorista</option>
                      {users
                        .filter((u) => u.type === "motorista")
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} {m.lastName}
                          </option>
                        ))}
                    </>
                  )}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 
                         text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
