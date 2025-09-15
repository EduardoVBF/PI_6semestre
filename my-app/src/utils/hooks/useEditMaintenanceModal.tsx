'use client';
import { create } from 'zustand';

interface EditMaintenanceModalStore {
    isOpen: boolean;
    maintenanceData: any | null;
    onOpen: (data: any) => void;
    onClose: () => void;
}

export const useEditMaintenanceModal = create<EditMaintenanceModalStore>((set) => ({
    isOpen: false,
    maintenanceData: null,
    onOpen: (data) => set({ isOpen: true, maintenanceData: data }),
    onClose: () => set({ isOpen: false, maintenanceData: null }),
}));
