'use client';
import { create } from 'zustand';

interface EditVehicleModalStore {
    isOpen: boolean;
    vehicleId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useEditVehicleModal = create<EditVehicleModalStore>((set) => ({
    isOpen: false,
    vehicleId: null,
    onOpen: (id: string) => set({ isOpen: true, vehicleId: id }),
    onClose: () => set({ isOpen: false, vehicleId: null }),
}));
