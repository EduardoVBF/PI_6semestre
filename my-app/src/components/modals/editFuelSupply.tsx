"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function EditFuelSupplyModal({
  isOpen,
  onClose,
  fuelSupplyId, // We'll use this to fetch the fuel supply data
}: {
  isOpen: boolean;
  onClose: () => void;
  fuelSupplyId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    kilometers: "",
    liters: "",
    fuelType: "",
    pricePerLiter: "",
    gasStation: "",
    totalValue: "",
    userId: "", // This will need to be populated from the logged user
    licensePlate: "", // This will need to be selected from available vehicles
    isFullTank: false,
  });
  const router = useRouter();

  // Mock vehicles data (replace with API call later)
  const mockVehicles = [
    {
      placa: "ABC-1234",
      modelo: "Onix",
      marca: "Chevrolet",
    },
    {
      placa: "DEF-5678",
      modelo: "HR-V",
      marca: "Honda",
    },
    {
      placa: "GHI-9012",
      modelo: "S10",
      marca: "Chevrolet",
    },
    {
      placa: "JKL-3456",
      modelo: "Actros",
      marca: "Mercedes-Benz",
    },
  ];

  // Load fuel supply data when modal opens
  useEffect(() => {
    if (isOpen && fuelSupplyId) {
      // Here you would fetch the fuel supply data from your API
      // For now, we'll use mock data
      const mockFuelSupplyData = {
        date: "2025-09-10",
        time: "14:30",
        kilometers: "150000",
        liters: "50",
        fuelType: "Diesel",
        pricePerLiter: "5.79",
        gasStation: "Posto Shell",
        totalValue: "289.50",
        userId: "1",
        licensePlate: "ABC-1234",
        isFullTank: true,
      };
      setFormData(mockFuelSupplyData);
    }
  }, [isOpen, fuelSupplyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Calculate total value when liters or price per liter changes
  const calculateTotalValue = () => {
    const liters = parseFloat(formData.liters);
    const pricePerLiter = parseFloat(formData.pricePerLiter);

    if (!isNaN(liters) && !isNaN(pricePerLiter)) {
      const total = (liters * pricePerLiter).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        totalValue: total,
      }));
    }
  };

  // Update total value whenever liters or price changes
  useEffect(() => {
    calculateTotalValue();
  }, [formData.liters, formData.pricePerLiter]);

  const handleCloseModal = () => {
    setFormData({
      date: "",
      time: "",
      kilometers: "",
      liters: "",
      fuelType: "",
      pricePerLiter: "",
      gasStation: "",
      totalValue: "",
      userId: "",
      licensePlate: "",
      isFullTank: false,
    });
    onClose();
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would make the API call to update the fuel supply
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Abastecimento atualizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleCloseModal();
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar abastecimento!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 bg-opacity-10 backdrop-blur-sm flex justify-center items-center p-4">
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
          Editar Abastecimento
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 px-10">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Veículo
              </label>
              <select
                name="licensePlate"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    licensePlate: e.target.value,
                  }))
                }
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              >
                <option value="">Selecione um veículo</option>
                {mockVehicles.map((vehicle) => (
                  <option key={vehicle.placa} value={vehicle.placa}>
                    {vehicle.marca} {vehicle.modelo} - {vehicle.placa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quilometragem
              </label>
              <Input
                type="number"
                name="kilometers"
                value={formData.kilometers}
                onChange={handleChange}
                placeholder="Quilometragem atual"
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Litros
                </label>
                <Input
                  type="number"
                  name="liters"
                  value={formData.liters}
                  onChange={handleChange}
                  placeholder="Quantidade de litros"
                  step="0.01"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Preço por Litro
                </label>
                <Input
                  type="number"
                  name="pricePerLiter"
                  value={formData.pricePerLiter}
                  onChange={handleChange}
                  placeholder="Preço por litro"
                  step="0.01"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Posto
              </label>
              <Input
                type="text"
                name="gasStation"
                value={formData.gasStation}
                onChange={handleChange}
                placeholder="Nome do posto"
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hora
                </label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                name="isFullTank"
                checked={formData.isFullTank}
                onChange={handleChange}
                className="w-4 h-4 text-primary-purple bg-gray-700 border-gray-600 rounded focus:ring-primary-purple"
              />
              <label className="text-sm font-medium text-gray-300">
                Tanque Cheio
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
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
