'use client';
import { create } from 'zustand';

interface IPreventiveMaintenance {
  id: number;
  placa: string;
  kmAtual: number;
  manutencoes: {
    oleo: boolean;
    filtroOleo: boolean;
    filtroCombustivel: boolean;
    filtroAr: boolean;
    engraxamento: boolean;
  };
  data: string;
  status: string;
}

interface EditMaintenanceModalStore {
    isOpen: boolean;
    maintenanceData: IPreventiveMaintenance | null;
    onOpen: (data: IPreventiveMaintenance) => void;
    onClose: () => void;
}

export const useEditMaintenanceModal = create<EditMaintenanceModalStore>((set) => ({
    isOpen: false,
    maintenanceData: null,
    onOpen: (data) => set({ isOpen: true, maintenanceData: data }),
    onClose: () => set({ isOpen: false, maintenanceData: null }),
}));
