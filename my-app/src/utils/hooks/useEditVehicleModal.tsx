'use client';
import { create } from 'zustand';
import { TGetVehicle } from '@/types/TVehicle';

interface EditVehicleModalStore {
    isOpen: boolean;
    vehicle: TGetVehicle | null;
    onOpen: (vehicle: TGetVehicle | null) => void;
    onClose: () => void;
}

export const useEditVehicleModal = create<EditVehicleModalStore>((set) => ({
    isOpen: false,
    vehicle: null,
    onOpen: (vehicle: TGetVehicle | null) => set({ isOpen: true, vehicle }),
    onClose: () => set({ isOpen: false, vehicle: null }),
}));
