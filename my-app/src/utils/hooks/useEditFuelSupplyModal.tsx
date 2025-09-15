'use client';
import { create } from 'zustand';

interface EditFuelSupplyModalStore {
    isOpen: boolean;
    fuelSupplyId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useEditFuelSupplyModal = create<EditFuelSupplyModalStore>((set) => ({
    isOpen: false,
    fuelSupplyId: null,
    onOpen: (id) => set({ isOpen: true, fuelSupplyId: id }),
    onClose: () => set({ isOpen: false, fuelSupplyId: null }),
}));
