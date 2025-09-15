"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AddMaintenanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    kmTroca: "",
    kmAtual: "",
    kmUltimaTroca: "",
    proximaTroca: "",
    status: "Regular",
    dataUltimaTroca: "",
    responsavel: "",
    custo: "",
    placa: "",
    veiculo: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setFormData({
      tipo: "",
      kmTroca: "",
      kmAtual: "",
      kmUltimaTroca: "",
      proximaTroca: "",
      status: "Regular",
      dataUltimaTroca: "",
      responsavel: "",
      custo: "",
      placa: "",
      veiculo: "",
    });
    onClose();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-lg flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={handleCloseModal}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Adicionar Manutenção
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 px-10">
            {/* Loader component here if available */}
            Carregando...
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Veículo
              </label>
              <select
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              >
                <option value="">Selecione o veículo</option>
                {mockVehicles.map((vehicle) => (
                  <option key={vehicle.placa} value={vehicle.placa}>
                    {vehicle.marca} {vehicle.modelo} - {vehicle.placa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo
              </label>
              <Input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                placeholder="Tipo de manutenção"
                required
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  KM Manutenção
                </label>
                <Input
                  type="number"
                  name="kmTroca"
                  value={formData.kmTroca}
                  onChange={handleChange}
                  placeholder="KM da próxima troca"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Próxima Troca (km)
                </label>
                <Input
                  type="number"
                  name="proximaTroca"
                  value={formData.proximaTroca}
                  onChange={handleChange}
                  placeholder="Diferença para próxima troca"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  >
                    <option value="Regular">Regular</option>
                    <option value="Próximo">Próximo</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Custo
                  </label>
                  <Input
                    type="number"
                    name="custo"
                    value={formData.custo}
                    onChange={handleChange}
                    placeholder="Custo da manutenção"
                    required
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data Última Troca
                </label>
                <Input
                  type="date"
                  name="dataUltimaTroca"
                  value={formData.dataUltimaTroca}
                  onChange={handleChange}
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Responsável
                </label>
                <Input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  placeholder="Responsável pela manutenção"
                  required
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  // TODO: handle submit logic
                }}
              >
                {isLoading ? "Adicionando..." : "Adicionar Manutenção"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
