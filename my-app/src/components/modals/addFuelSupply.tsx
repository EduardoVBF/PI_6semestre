"use client";
import { toast, Bounce } from "react-toastify";
import { CircleLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";
import { X } from "lucide-react";
import Loader from "../loader";
import React from "react";

export default function AddFuelSupplyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [placaDisabled, setPlacaDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
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
  React.useEffect(() => {
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
    setPlacaDisabled(false);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!isOpen) return;

    if (pathname.includes("/vehicle/")) {
      setPlacaDisabled(true);
      setFormData((prev) => ({
        ...prev,
        licensePlate: pathname.split("/vehicle/")[1],
      }));
    } else {
      setPlacaDisabled(false);
    }
  }, [isOpen, pathname]);

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
          Registrar Abastecimento
        </h1>

        {isLoading ? (
          <div
            className="flex justify-center items-center py-20 px-10"
            onClick={() => {
              handleCloseModal();
              toast.success("Abastecimento registrado com sucesso!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              router.push("/home");
            }}
          >
            <Loader />
          </div>
        ) : (
          <form className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <CircleLoader color="#a055ff" size={50} />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Veículo
                  </label>
                  <select
                    name="vehicle"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        licensePlate: e.target.value,
                      }))
                    }
                    className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                    disabled={placaDisabled}
                  >
                    <option value="">Selecione o veículo</option>
                    {mockVehicles.map((vehicle) => (
                      <option key={vehicle.placa} value={vehicle.placa}>
                        {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
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
                      Tipo de Combustível
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fuelType: e.target.value,
                        }))
                      }
                      className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                      required
                    >
                      <option value="">Selecione o combustível</option>
                      <option value="gasolina">Gasolina</option>
                      <option value="etanol">Etanol</option>
                      <option value="diesel">Diesel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Posto
                  </label>
                  <select
                    name="gasStation"
                    value={formData.gasStation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gasStation: e.target.value,
                      }))
                    }
                    className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  >
                    <option value="">Selecione o posto</option>
                    <option value="posto1">Depósito Mirim</option>
                    <option value="posto2">Posto Externo</option>
                    <option value="posto3">Posto Alvorada</option>
                    <option value="posto4">Posto Central</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Valor por Litro
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Valor Total
                    </label>
                    <Input
                      type="number"
                      name="totalValue"
                      value={formData.totalValue}
                      readOnly
                      className="w-full h-12 text-lg px-4 bg-gray-600 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
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
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(
                    "Botão de registro de abastecimento clicado!",
                    formData
                  );
                  setIsLoading(true);
                }}
              >
                {isLoading ? "Registrando..." : "Registrar Abastecimento"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
