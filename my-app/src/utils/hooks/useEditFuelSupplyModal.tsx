'use client';
import { create } from 'zustand';

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
interface EditFuelSupplyModalStore {
    isOpen: boolean;
    fuelSupply: IFuelSupply | null;
    onOpen: (fuelSupply: IFuelSupply) => void;
    onClose: () => void;
}

export const useEditFuelSupplyModal = create<EditFuelSupplyModalStore>((set) => ({
    isOpen: false,
    fuelSupply: null,
    onOpen: (fuelSupply) => set({ isOpen: true, fuelSupply }),
    onClose: () => set({ isOpen: false, fuelSupply: null }),
}));
