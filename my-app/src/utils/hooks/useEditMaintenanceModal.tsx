'use client';
import { create } from 'zustand';

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

interface EditMaintenanceModalStore {
    isOpen: boolean;
    maintenanceData: IMaintenance | null;
    onOpen: (data: IMaintenance) => void;
    onClose: () => void;
}

export const useEditMaintenanceModal = create<EditMaintenanceModalStore>((set) => ({
    isOpen: false,
    maintenanceData: null,
    onOpen: (data) => set({ isOpen: true, maintenanceData: data }),
    onClose: () => set({ isOpen: false, maintenanceData: null }),
}));
