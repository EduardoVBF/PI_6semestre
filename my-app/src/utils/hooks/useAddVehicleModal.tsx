'use client';
import { create } from 'zustand';

export const useAddVehicleModal = create((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));