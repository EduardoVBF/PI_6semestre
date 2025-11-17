'use client';
import { create } from 'zustand';
import { TMaintenance } from '@/types/TMaintenance';

interface EditMaintenanceModalStore {
    isOpen: boolean;
    maintenanceData: TMaintenance | null;
    onOpen: (data: TMaintenance) => void;
    onClose: () => void;
}

export const useEditMaintenanceModal = create<EditMaintenanceModalStore>((set) => ({
    isOpen: false,
    maintenanceData: null,
    onOpen: (data) => set({ isOpen: true, maintenanceData: data }),
    onClose: () => set({ isOpen: false, maintenanceData: null }),
}));
