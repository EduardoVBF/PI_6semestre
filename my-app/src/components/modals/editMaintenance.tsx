"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IMaintenance {
  id: number;
  veiculo: string;
  placa: string;
  tipo: string;
  kmTroca: number;
  kmAtual: number;
  kmUltimaTroca: number;
  proximaTroca: number;
  status: string;
  dataUltimaTroca: string;
  responsavel: string;
  custo: number;
}

export default function EditPreventiveMaintenanceModal({
  isOpen,
  onClose,
  maintenanceData,
}: {
  isOpen: boolean;
  onClose: () => void;
  maintenanceData: IMaintenance | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    placa: "",
    kmAtual: "",
    manutencoes: {
      oleo: false,
      filtroOleo: false,
      filtroCombustivel: false,
      filtroAr: false,
      engraxamento: false,
    },
  };

  const [formData, setFormData] = useState(initialFormData);

  // Mock de veículos para dropdown
  const mockVehicles = [
    { placa: "ABC-1234", modelo: "Onix", marca: "Chevrolet" },
    { placa: "DEF-5678", modelo: "HR-V", marca: "Honda" },
    { placa: "GHI-9012", modelo: "S10", marca: "Chevrolet" },
    { placa: "JKL-3456", modelo: "Actros", marca: "Mercedes-Benz" },
  ];

  useEffect(() => {
    if (isOpen && maintenanceData) {
      // Garante que o objeto manutencoes sempre existe e tem as chaves corretas
      // setFormData({
      //   ...initialFormData,
      //   ...maintenanceData,
      //   manutencoes: {
      //     ...initialFormData.manutencoes,
      //     ...(maintenanceData.manutencoes || {}),
      //   },
      // });
      setFormData({
        placa: maintenanceData.placa,
        kmAtual: maintenanceData.kmAtual.toString(),
        manutencoes: {
          oleo: false,
          filtroOleo: false,
          filtroCombustivel: false,
          filtroAr: false,
          engraxamento: false,
        },
      });
    }
  }, [isOpen, maintenanceData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        manutencoes: { ...prev.manutencoes, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrar com backend (PUT / PATCH)
    console.log("Dados atualizados:", formData);

    setTimeout(() => {
      setIsLoading(false);
      handleCloseModal();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-md flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={handleCloseModal}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Editar Manutenção Preventiva
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 px-10">
            Salvando alterações...
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

            {/* KM Atual */}
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

            {/* Manutenções realizadas */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Manutenções Realizadas
              </label>
              <div className="space-y-2">
                {[
                  { name: "oleo", label: "Troca de óleo" },
                  { name: "filtroOleo", label: "Troca de filtro de óleo lubrificante" },
                  { name: "filtroCombustivel", label: "Troca de filtro de combustível" },
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
                      checked={formData.manutencoes[item.name as keyof typeof formData.manutencoes]}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-purple bg-gray-700 border-gray-600 rounded focus:ring-primary-purple"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Botão de salvar */}
            <div className="flex justify-end pt-4">
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
