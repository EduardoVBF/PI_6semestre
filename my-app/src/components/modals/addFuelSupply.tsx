"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { TError } from "@/types/TError";

import { TGetVehicle } from "@/types/TVehicle";

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

export default function AddFuelSupplyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [vehicles, setVehicles] = useState<TGetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placaDisabled, setPlacaDisabled] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, getValues } =
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
  // 🔥 Carregar veículos da API
  // ================================
  useEffect(() => {
    if (!isOpen) return;
    if (!session?.accessToken) return;

    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/v1/vehicles/", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
          params: { limit: 1000 },
        });

        setVehicles(response.data.vehicles || []);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        toast.error("Erro ao carregar veículos.");
      }
    };

    fetchVehicles();
  }, [isOpen, session?.accessToken]);

  // ========================================
  // 🔒 Travar placa se estiver em /vehicle/ABC-1234
  // ========================================
  useEffect(() => {
    if (!isOpen) return;

    if (pathname && pathname.includes("/vehicle/")) {
      // pega só a parte da placa, sem segmentos adicionais ou query
      const placaFromUrl = pathname.split("/vehicle/")[1].split(/[/?#]/)[0];

      if (placaFromUrl) {
        // atualiza o valor do form imediatamente (útil para watch)
        setValue("placa", placaFromUrl);

        // garante que o form tenha esse valor como default (evita "desaparecer"
        // antes das options chegarem)
        const current = getValues();
        reset({ ...current, placa: placaFromUrl });

        setPlacaDisabled(true);
      } else {
        setPlacaDisabled(false);
      }
    } else {
      setPlacaDisabled(false);
    }
    // intentionally include functions we use from hook
  }, [isOpen, pathname, setValue, reset, getValues]);

  // ========================================
  // 🧮 Calcular total automático
  // ========================================
  const totalValue = (() => {
    const l = parseFloat(litros);
    const v = parseFloat(valor_litro);

    if (isNaN(l) || isNaN(v)) return "0.00";
    return (l * v).toFixed(2);
  })();

  // ========================================
  // ❌ Fechar modal
  // ========================================
  const handleCloseModal = () => {
    reset();
    setIsLoading(false);
    setPlacaDisabled(false);
    onClose();
  };

  // ========================================
  // 🚀 Enviar POST
  // ========================================
  const handleCreateRefuel = async (data: TRefuelForm) => {
    if (!session?.accessToken) {
      toast.error("Sessão expirada.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("ID do usuário não encontrado na sessão.");
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
        media: 0,
        id_usuario: vehicles.filter((v) => v.placa === data.placa)[0]
          ?.id_usuario,
        placa: data.placa,
        valor_total: Number(totalValue),
      };

      await api.post("/api/v1/refuels/", payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Abastecimento registrado com sucesso!");
      handleCloseModal();
    } catch (error: unknown) {
      const err = error as TError;
      toast.error(`${err.response?.data?.message}` || "Erro ao registrar abastecimento.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedPlaca = watch("placa");

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
          Registrar Abastecimento
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleCreateRefuel)}
            className="space-y-4"
          >
            {/* Placa */}
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

                {/* Se trancada e a placa não estiver na lista de vehicles, mostra fallback */}
                {placaDisabled &&
                  selectedPlaca &&
                  !vehicles.some((v) => v.placa === selectedPlaca) && (
                    <option value={selectedPlaca}>
                      {selectedPlaca} - carregando veículo...
                    </option>
                  )}

                {vehicles.map((v) => (
                  <option key={v.id} value={v.placa}>
                    {v.placa} - {v.marca} {v.modelo}
                  </option>
                ))}
              </select>

              {/* Se estiver disabled, inputs desabilitados não são enviados no form HTML.
                  Para garantir envio, mantemos um hidden input com o mesmo valor. */}
              {placaDisabled && selectedPlaca && (
                <input type="hidden" value={selectedPlaca} {...register("placa")} />
              )}
            </div>

            {/* KM */}
            <div>
              <div className="flex items-center gap-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quilometragem
                </label>
                {vehicles.map(
                  (v) =>
                    v.placa === selectedPlaca && (
                      <span
                        key={v.id}
                        className="text-gray-400 text-xs font-medium"
                      >{`último km: ${v.km_atual}`}</span>
                    )
                )}
              </div>
              <Input
                {...register("km")}
                type="number"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border-gray-600 text-white"
                disabled={!selectedPlaca}
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

            {/* Date + Time */}
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
                Registrar Abastecimento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
