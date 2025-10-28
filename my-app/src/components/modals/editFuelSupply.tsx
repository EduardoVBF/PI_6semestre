"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

interface IFuelSupply {
  id: number;
  km_abastecimento: number;
  litros: number;
  preco_litro: number;
  data_hora: string;
  posto: string;
  tipo_combustivel: string;
  motorista: string;
  placa: string;
  marca: string;
  modelo: string;
  total_abastecimento: number;
  media: number;
}

export default function EditFuelSupplyModal({
  isOpen,
  onClose,
  fuelSupply,
}: {
  isOpen: boolean;
  onClose: () => void;
  fuelSupply: IFuelSupply | null;
}) {
  const pathname = usePathname();
  const [placaDisabled, setPlacaDisabled] = useState(false);
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
    userId: "",
    licensePlate: "",
    isFullTank: false,
  });
  const router = useRouter();

  const mockVehicles = [
    { placa: "ABC-1234", modelo: "Onix", marca: "Chevrolet" },
    { placa: "DEF-5678", modelo: "HR-V", marca: "Honda" },
    { placa: "GHI-9012", modelo: "S10", marca: "Chevrolet" },
    { placa: "JKL-3456", modelo: "Actros", marca: "Mercedes-Benz" },
    { placa: "MNO-7890", modelo: "TGX 29.480", marca: "MAN" },
  ];

  // ✅ Carrega dados do abastecimento quando o modal abrir
  useEffect(() => {
    if (isOpen && fuelSupply) {
      try {
        // Quebra a data e hora (ex: "01/08/25 09:45")
        const [dataStr, horaStr] = fuelSupply.data_hora.split(" ");
        const [dia, mes, anoCurto] = dataStr.split("/");
        const ano = "20" + anoCurto; // converte "25" -> "2025"
        const dataFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(
          2,
          "0"
        )}`;

        setFormData({
          date: dataFormatada,
          time: horaStr || "",
          kilometers: fuelSupply.km_abastecimento?.toString() || "",
          liters: fuelSupply.litros?.toString() || "",
          fuelType: fuelSupply.tipo_combustivel || "",
          pricePerLiter: fuelSupply.preco_litro?.toString() || "",
          gasStation: fuelSupply.posto || "",
          totalValue: fuelSupply.total_abastecimento?.toFixed(2) || "",
          userId: fuelSupply.motorista || "",
          licensePlate: fuelSupply.placa || "",
          isFullTank: true, // ou false, se houver flag no backend
        });
      } catch (err) {
        console.error("Erro ao carregar dados do abastecimento:", err);
      }
    }
  }, [isOpen, fuelSupply]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Recalcula o total
  useEffect(() => {
    const liters = parseFloat(formData.liters);
    const pricePerLiter = parseFloat(formData.pricePerLiter);
    if (!isNaN(liters) && !isNaN(pricePerLiter)) {
      const total = (liters * pricePerLiter).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        totalValue: total,
      }));
    }
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
      // Simulação de atualização
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Abastecimento atualizado com sucesso!");
      handleCloseModal();
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar abastecimento!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
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
            {/* Veículo */}
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
                disabled={placaDisabled}
                className="text-sm w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-purple"
                required
              >
                <option value="">Selecione um veículo</option>
                {mockVehicles.map((v) => (
                  <option key={v.placa} value={v.placa}>
                    {v.marca} {v.modelo} - {v.placa}
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
                type="number"
                name="kilometers"
                value={formData.kilometers}
                onChange={handleChange}
                placeholder="Quilometragem atual"
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
                required
              />
            </div>

            {/* Litros e Preço */}
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
                  step="0.01"
                  placeholder="Quantidade de litros"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
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
                  step="0.01"
                  placeholder="Preço por litro"
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
            </div>

            {/* Posto */}
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
                className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
                required
              />
            </div>

            {/* Data e Hora */}
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
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
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
                  className="w-full h-12 text-lg px-4 bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
            </div>

            {/* Tanque cheio */}
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

            {/* Botão */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
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
