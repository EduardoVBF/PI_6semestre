"use client";

import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Loader from "../loader";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { usePathname } from "next/navigation";
import { TGetVehicle } from "@/types/TVehicle";
import { TMaintenance } from "@/types/TMaintenance";

type TMaintenanceForm = {
  placa: string;
  kmAtual: string;
  oleo: boolean;
  filtroOleo: boolean;
  filtroCombustivel: boolean;
  filtroAr: boolean;
  engraxamento: boolean;
  status: "pendente" | "em_andamento" | "concluida" | "cancelada" | string;
};

export default function EditPreventiveMaintenanceModal({
  isOpen,
  onClose,
  maintenanceData,
}: {
  isOpen: boolean;
  onClose: () => void;
  maintenanceData: TMaintenance | null;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [vehicles, setVehicles] = useState<TGetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placaDisabled, setPlacaDisabled] = useState(false);

  const [formData, setFormData] = useState<TMaintenanceForm>({
    placa: "",
    kmAtual: "",
    oleo: false,
    filtroOleo: false,
    filtroCombustivel: false,
    filtroAr: false,
    engraxamento: false,
    status: "pendente",
  });

  // ============================
  // LOAD VEHICLES
  // ============================
  useEffect(() => {
    if (!isOpen) return;

    const fetchVehicles = async () => {
      try {
        const response = await api.get("/api/v1/vehicles", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          params: { limit: 1000 },
        });

        const list = response.data.vehicles ?? response.data;
        setVehicles(list);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        toast.error("Erro ao carregar veículos.");
      }
    };

    fetchVehicles();
  }, [isOpen, session?.accessToken]);

  // ============================
  // LOAD DATA IN MODAL
  // ============================
  useEffect(() => {
    if (!isOpen || !maintenanceData) return;

    setFormData({
      placa: maintenanceData.placa,
      kmAtual: String(maintenanceData.km_atual ?? ""),
      oleo: !!maintenanceData.oleo,
      filtroOleo: !!maintenanceData.filtro_oleo,
      filtroCombustivel: !!maintenanceData.filtro_combustivel,
      filtroAr: !!maintenanceData.filtro_ar,
      engraxamento: !!maintenanceData.engraxamento,
      status: maintenanceData.status ?? "pendente",
    });
  }, [isOpen, maintenanceData]);

  // trava placa se estiver em /vehicle/:placa
  useEffect(() => {
    if (!isOpen) return;

    if (pathname.includes("/vehicle/")) {
      const p = pathname.split("/vehicle/")[1];
      setFormData((prev) => ({ ...prev, placa: p }));
      setPlacaDisabled(true);
    } else {
      setPlacaDisabled(false);
    }
  }, [isOpen, pathname]);

  // ============================
  // HANDLE CHANGES
  // ============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    const value = (e.target as HTMLInputElement).value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // CLOSE MODAL
  // ============================
  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  // ============================
  // SUBMIT (PUT/PATCH)
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.accessToken) return toast.error("Sessão expirada.");

    setIsLoading(true);

    try {
      const payload = {
        placa: formData.placa,
        km_atual: Number(formData.kmAtual),

        oleo: !!formData.oleo,
        filtro_oleo: !!formData.filtroOleo,
        filtro_combustivel: !!formData.filtroCombustivel,
        filtro_ar: !!formData.filtroAr,
        engraxamento: !!formData.engraxamento,

        status: formData.status,
      };

      await api.patch(`/api/v1/maintenances/${maintenanceData?.id || ""}`, payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      toast.success("Manutenção atualizada!");
      handleClose();
    } catch (error) {
      console.error("Erro ao atualizar manutenção:", error);
      toast.error("Erro ao atualizar.");
      setIsLoading(false);
    }
  };

  // ============================
  // RENDER
  // ============================
  if (!isOpen) return null;

  const selectedVehicle = vehicles.find((v) => v.placa === formData.placa);

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl relative max-h-[98vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={handleClose}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Editar Manutenção Preventiva
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Veículo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Veículo
              </label>
              <select
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                disabled={placaDisabled}
                required
                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Selecione o veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.placa}>
                    {v.placa} - {v.marca} {v.modelo}
                  </option>
                ))}
              </select>
            </div>

            {/* KM */}
            <div>
              <div className="flex items-center gap-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  KM Atual
                </label>

                {selectedVehicle && (
                  <p className="text-xs text-gray-400 mt-1">
                    Último KM:{" "}
                    <span className="text-gray-200">
                      {selectedVehicle.km_atual}
                    </span>
                  </p>
                )}
              </div>

              <Input
                type="number"
                name="kmAtual"
                value={formData.kmAtual}
                onChange={handleChange}
                className="w-full h-12 text-lg px-4 bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Manutenções Realizadas
              </label>

              <div className="space-y-2">
                {[
                  ["oleo", "Troca de óleo"],
                  ["filtroOleo", "Troca do filtro de óleo lubrificante"],
                  ["filtroCombustivel", "Troca do filtro de combustível"],
                  ["filtroAr", "Troca do filtro de ar"],
                  ["engraxamento", "Engraxamento"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={!!formData[name as keyof TMaintenanceForm]}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-purple bg-gray-700 border-gray-600 rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary-purple hover:bg-fuchsia-800 rounded-lg text-white font-semibold transition disabled:opacity-50"
            >
              Salvar Alterações
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
