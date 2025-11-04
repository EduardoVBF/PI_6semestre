'use client';
import { create } from 'zustand';
import { TUser } from '@/types/TUser';

interface EditUserModalStore {
    isOpen: boolean;
    userData: TUser | null;
    onOpen: (data: TUser | null) => void;
    onClose: () => void;
}

export const useEditUserModal = create<EditUserModalStore>((set) => ({
    isOpen: false,
    userData: null,
    onOpen: (data) => set({ isOpen: true, userData: data }),
    onClose: () => set({ isOpen: false, userData: null }),
}));
