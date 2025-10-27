'use client';
import { create } from 'zustand';

interface Vehicle {
    placa: string;
    modelo: string;
    marca: string;
    ano: number;
    tipo: string;
    motorista: string;
}

interface EditVehicleModalStore {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onOpen: (vehicle: Vehicle | null) => void;
    onClose: () => void;
}

export const useEditVehicleModal = create<EditVehicleModalStore>((set) => ({
    isOpen: false,
    vehicle: null,
    onOpen: (vehicle: Vehicle | null) => set({ isOpen: true, vehicle }),
    onClose: () => set({ isOpen: false, vehicle: null }),
}));
