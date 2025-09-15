"use client";
import { toast, Bounce } from "react-toastify";
import { CircleLoader } from "react-spinners";
import { useState } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";

// Dados simulados para preencher o select de motoristas
const mockUsers = [
  { id: 1, nome: "João Silva", funcao: "Motorista" },
  { id: 2, nome: "Maria Oliveira", funcao: "Gerente" },
  { id: 3, nome: "Pedro Souza", funcao: "Motorista" },
  { id: 4, nome: "Ana Costa", funcao: "Motorista" },
];

export default function AddVehicleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    tipo: "",
    motorista: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setFormData({
      placa: "",
      modelo: "",
      marca: "",
      ano: "",
      tipo: "",
      motorista: "",
    });
    onClose();
    setIsLoading(false);
  };

  // Implemente sua função de envio aqui quando a API estiver pronta
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
    
    // Lógica de API simulada
    setTimeout(() => {
        toast.success("Veículo cadastrado com sucesso!", {
            position: "top-center",
            theme: "colored",
            transition: Bounce,
        });
        handleCloseModal();
    }, 2000);
  };

  if (!isOpen) return null;

  const motoristas = mockUsers.filter(user => user.funcao === 'Motorista');

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

        <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">Cadastrar Veículo</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <CircleLoader color="#a055ff" size={50} />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Placa</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Modelo</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Marca</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ano</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Motorista</label>
                <select
                  name="motorista"
                  value={formData.motorista}
                  onChange={handleChange}
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  required
                >
                  <option value="" disabled>Selecione um motorista</option>
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
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}