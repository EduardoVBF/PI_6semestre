'use client';
import { create } from 'zustand';

interface AddMaintenanceModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useAddMaintenanceModal = create<AddMaintenanceModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
