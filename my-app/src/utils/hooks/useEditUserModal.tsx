'use client';
import { create } from 'zustand';

interface EditUserModalStore {
    isOpen: boolean;
    userData: any | null;
    onOpen: (data: any) => void;
    onClose: () => void;
}

export const useEditUserModal = create<EditUserModalStore>((set) => ({
    isOpen: false,
    userData: null,
    onOpen: (data) => set({ isOpen: true, userData: data }),
    onClose: () => set({ isOpen: false, userData: null }),
}));
