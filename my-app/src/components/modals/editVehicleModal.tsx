"use client";
import { toast, Bounce } from "react-toastify";
import { CircleLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";

// Dados mock em escopo de módulo (estáveis para hooks e testes)
const mockUsers = [
  { id: 1, nome: "João Silva", funcao: "Motorista" },
  { id: 2, nome: "Maria Oliveira", funcao: "Gerente" },
  { id: 3, nome: "Pedro Souza", funcao: "Motorista" },
  { id: 4, nome: "Ana Costa", funcao: "Motorista" },
];

const mockVehicles = [
  {
    placa: "ABC-1234",
    modelo: "Onix",
    marca: "Chevrolet",
    ano: 2022,
    tipo: "Carro",
    motorista: "João Silva",
  },
  {
    placa: "DEF-5678",
    modelo: "HR-V",
    marca: "Honda",
    ano: 2023,
    tipo: "SUV",
    motorista: "Maria Oliveira",
  },
  {
    placa: "GHI-9012",
    modelo: "S10",
    marca: "Chevrolet",
    ano: 2021,
    tipo: "Picape",
    motorista: "Pedro Souza",
  },
  {
    placa: "JKL-3456",
    modelo: "Actros",
    marca: "Mercedes-Benz",
    ano: 2020,
    tipo: "Caminhão",
    motorista: "Ana Costa",
  },
];

interface Vehicle {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  motorista: string;
}

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: 0,
    tipo: "",
    motorista: "",
  });

  // Carrega os dados do veículo quando o modal abre.
  useEffect(() => {
    if (isOpen && vehicle) {
      // carregar dados do veículo (mock)
      const found = mockVehicles.find((v) => v.placa === vehicle.placa);
      if (found) {
        setFormData({
          placa: found.placa,
          modelo: found.modelo,
          marca: found.marca,
          ano: found.ano,
          tipo: found.tipo,
          motorista: found.motorista,
        });
      }
    }
  }, [isOpen, vehicle]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setFormData({
      placa: "",
      modelo: "",
      marca: "",
      ano: 0,
      tipo: "",
      motorista: "",
    });
    onClose();
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.placa || !formData.modelo || !formData.motorista) {
      toast.error("Por favor, preencha todos os campos obrigatórios.", {
        position: "top-center",
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    // Simula chamada à API
    setTimeout(() => {
      toast.success("Veículo atualizado com sucesso!", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
      handleCloseModal();
    }, 1500);
  };

  if (!isOpen) return null;

  const motoristas = mockUsers.filter((u) => u.funcao === "Motorista");

  console.log("Editing vehicle:", vehicle);
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <CircleLoader color="#a055ff" size={50} />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Placa
                </label>
                <Input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
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
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
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
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
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
                    type="number"
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    placeholder="Ano"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
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
                    placeholder="Tipo (Carro, Caminhão...)"
                    className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Motorista
                </label>
                <select
                  name="motorista"
                  value={formData.motorista}
                  onChange={handleChange}
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                >
                  <option value="" disabled>
                    Selecione um motorista
                  </option>
                  {motoristas.map((motorista) => (
                    <option key={motorista.id} value={motorista.nome}>
                      {motorista.nome}
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
              {isLoading ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
