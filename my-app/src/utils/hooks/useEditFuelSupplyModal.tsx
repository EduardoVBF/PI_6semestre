'use client';
import { TRefuel } from '@/types/TFuel';
import { create } from 'zustand';

interface EditFuelSupplyModalStore {
    isOpen: boolean;
    fuelSupply: TRefuel | null;
    onOpen: (fuelSupply: TRefuel) => void;
    onClose: () => void;
}

export const useEditFuelSupplyModal = create<EditFuelSupplyModalStore>((set) => ({
    isOpen: false,
    fuelSupply: null,
    onOpen: (fuelSupply) => set({ isOpen: true, fuelSupply }),
    onClose: () => set({ isOpen: false, fuelSupply: null }),
}));
