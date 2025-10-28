"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export default function AddPreventiveMaintenanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [placaDisabled, setPlacaDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    placa: "",
    kmAtual: "",
    manutencoes: {
      oleo: false,
      filtroOleo: false,
      filtroCombustivel: false,
      filtroAr: false,
      engraxamento: false,
    },
  });

  const mockVehicles = [
    { placa: "ABC-1234", modelo: "Onix", marca: "Chevrolet" },
    { placa: "DEF-5678", modelo: "HR-V", marca: "Honda" },
    { placa: "GHI-9012", modelo: "S10", marca: "Chevrolet" },
    { placa: "JKL-3456", modelo: "Actros", marca: "Mercedes-Benz" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.currentTarget;
    const { name, value, type } = target as HTMLInputElement | HTMLSelectElement;
    const checked = type === "checkbox" ? (target as HTMLInputElement).checked : undefined;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        manutencoes: { ...prev.manutencoes, [name]: checked as boolean },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: integrar com backend
    console.log("Dados enviados:", formData);

    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      placa: "",
      kmAtual: "",
      manutencoes: {
        oleo: false,
        filtroOleo: false,
        filtroCombustivel: false,
        filtroAr: false,
        engraxamento: false,
      },
    });
    setIsLoading(false);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;

    if (pathname.includes("/vehicle/")) {
      setPlacaDisabled(true);
      setFormData((prev) => ({
        ...prev,
        placa: pathname.split("/vehicle/")[1],
      }));
    } else {
      setPlacaDisabled(false);
    }
  }, [isOpen, pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-md flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={handleClose}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Registrar Manutenção Preventiva
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selecionar veículo */}
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
              className="w-full h-12 text-sm px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all duration-200"
            >
              <option value="">Selecione o veículo</option>
              {mockVehicles.map((v) => (
                <option key={v.placa} value={v.placa}>
                  {v.marca} {v.modelo} - {v.placa}
                </option>
              ))}
            </select>
          </div>

          {/* KM atual */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              KM Atual
            </label>
            <Input
              type="number"
              name="kmAtual"
              value={formData.kmAtual}
              onChange={handleChange}
              placeholder="Informe o KM atual"
              required
              className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all duration-200"
            />
          </div>

          {/* Manutenções preventivas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Manutenções Realizadas
            </label>
            <div className="space-y-2">
              {[
                { name: "oleo", label: "Troca de óleo" },
                {
                  name: "filtroOleo",
                  label: "Troca de filtro de óleo lubrificante",
                },
                {
                  name: "filtroCombustivel",
                  label: "Troca de filtro de combustível",
                },
                { name: "filtroAr", label: "Troca de filtro de ar" },
                { name: "engraxamento", label: "Engraxamento" },
              ].map((item) => (
                <label
                  key={item.name}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={
                      formData.manutencoes[
                        item.name as keyof typeof formData.manutencoes
                      ]
                    }
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-purple bg-gray-700 border-gray-600 rounded focus:ring-primary-purple"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Botão de envio */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
