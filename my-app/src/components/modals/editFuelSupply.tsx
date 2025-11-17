"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/components/loader";
import api from "@/utils/api";
import { useSession } from "next-auth/react";
import { TGetVehicle } from "@/types/TVehicle";

interface IFuelSupply {
  id: number;
  km: number;
  litros: number;
  valor_litro: number;
  data: string; // formato: YYYY-MM-DD
  hora: string; // formato: HH:MM
  posto: string;
  tipo_combustivel: string;
  placa: string;
  tanque_cheio: boolean;
  valor_total: number;
}

type TRefuelForm = {
  date: string;
  time: string;
  km: string;
  litros: string;
  tipo_combustivel: string;
  valor_litro: string;
  posto: string;
  tanque_cheio: boolean;
  placa: string;
};

export default function EditFuelSupplyModal({
  isOpen,
  onClose,
  fuelSupply,
}: {
  isOpen: boolean;
  onClose: () => void;
  fuelSupply: IFuelSupply | null;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [vehicles, setVehicles] = useState<TGetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placaDisabled, setPlacaDisabled] = useState(false);

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<TRefuelForm>({
      defaultValues: {
        date: "",
        time: "",
        km: "",
        litros: "",
        tipo_combustivel: "",
        valor_litro: "",
        posto: "",
        tanque_cheio: false,
        placa: "",
      },
    });

  const litros = watch("litros");
  const valor_litro = watch("valor_litro");

  // ================================
  // Carregar veículos
  // ================================
  useEffect(() => {
    if (!isOpen) return;

    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          params: { limit: 1000 },
        });

        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        toast.error("Erro ao carregar veículos.");
      }
    };

    fetchVehicles();
  }, [isOpen]);

  // Garantir seleção correta da placa
  useEffect(() => {
    if (!isOpen || !fuelSupply) return;
    if (vehicles.length === 0) return;

    setValue("placa", fuelSupply.placa);
  }, [vehicles, isOpen, fuelSupply, setValue]);
  // =========================================================
  // Preencher os dados iniciais quando abrir o modal
  // =========================================================
  useEffect(() => {
    if (!isOpen || !fuelSupply) return;

    try {
      setValue("date", fuelSupply.data);
      setValue("time", fuelSupply.hora);
      setValue("km", fuelSupply.km.toString());
      setValue("litros", fuelSupply.litros.toString());
      setValue("tipo_combustivel", fuelSupply.tipo_combustivel);
      setValue("valor_litro", fuelSupply.valor_litro.toString());
      setValue("posto", fuelSupply.posto);
      setValue("tanque_cheio", fuelSupply.tanque_cheio);
      setValue("placa", fuelSupply.placa);
    } catch (err) {
      console.error("Erro ao carregar dados de edição:", err);
    }
  }, [isOpen, fuelSupply, setValue]);

  // ================================
  // Travar placa quando estiver em /vehicle/XXX
  // ================================
  useEffect(() => {
    if (!isOpen) return;

    if (pathname.includes("/vehicle/")) {
      setPlacaDisabled(true);
      setValue("placa", pathname.split("/vehicle/")[1]);
    } else {
      setPlacaDisabled(false);
    }
  }, [isOpen, pathname, setValue]);

  // ================================
  // Cálculo do total
  // ================================
  const totalValue = (() => {
    const l = parseFloat(litros);
    const v = parseFloat(valor_litro);
    if (isNaN(l) || isNaN(v)) return "0.00";
    return (l * v).toFixed(2);
  })();

  // ================================
  // Fechar modal
  // ================================
  const handleCloseModal = () => {
    reset();
    setIsLoading(false);
    setPlacaDisabled(false);
    onClose();
  };

  // ================================
  // Enviar PATCH
  // ================================
  const handleUpdateRefuel = async (data: TRefuelForm) => {
    if (!session?.accessToken) {
      toast.error("Sessão expirada.");
      return;
    }

    if (!fuelSupply?.id) {
      toast.error("Erro: ID do abastecimento não encontrado.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        data: data.date,
        hora: data.time,
        km: Number(data.km),
        litros: Number(data.litros),
        tipo_combustivel: data.tipo_combustivel,
        valor_litro: Number(data.valor_litro),
        posto: data.posto,
        tanque_cheio: data.tanque_cheio,
        valor_total: Number(totalValue),
        placa: data.placa,
      };

      await api.patch(`/api/v1/refuels/${fuelSupply.id}`, payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Abastecimento atualizado!");
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar abastecimento.");
      setIsLoading(false);
    }
  };

  if (!isOpen || !fuelSupply) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-lg flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative max-h-[95dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={handleCloseModal}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Editar Abastecimento
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleUpdateRefuel)}
            className="space-y-4"
          >
            {/* Veículo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Veículo
              </label>

              <select
                {...register("placa")}
                disabled={placaDisabled}
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Selecione o veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.placa}>
                    {v.placa} — {v.marca} {v.modelo}
                  </option>
                ))}
              </select>
            </div>

            {/* Quilometragem */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quilometragem
              </label>
              <Input
                {...register("km")}
                type="number"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Litros + Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Litros
                </label>
                <Input
                  {...register("litros")}
                  type="number"
                  step="0.01"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de Combustível
                </label>
                <select
                  {...register("tipo_combustivel")}
                  required
                  className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Selecione</option>
                  <option value="gasolina">Gasolina</option>
                  <option value="etanol">Etanol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
            </div>

            {/* Posto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Posto
              </label>
              <select
                {...register("posto")}
                required
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Selecione</option>
                <option value="interno">Depósito Interno</option>
                <option value="externo">Posto Externo</option>
                <option value="alvorada">Posto Alvorada</option>
                <option value="central">Posto Central</option>
              </select>
            </div>

            {/* Data + Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data
                </label>
                <Input
                  {...register("date")}
                  type="date"
                  required
                  className="w-full h-12 px-4 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hora
                </label>
                <Input
                  {...register("time")}
                  type="time"
                  required
                  className="w-full h-12 px-4 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Valor por litro + total */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Valor por Litro
                </label>
                <Input
                  {...register("valor_litro")}
                  type="number"
                  step="0.01"
                  required
                  className="w-full h-12 px-4 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total
                </label>
                <Input
                  value={totalValue}
                  readOnly
                  className="w-full h-12 px-4 bg-gray-600 border-gray-500 text-white"
                />
              </div>
            </div>

            {/* Tanque cheio */}
            <div className="flex items-center space-x-2">
              <input
                {...register("tanque_cheio")}
                type="checkbox"
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Tanque Cheio</label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
