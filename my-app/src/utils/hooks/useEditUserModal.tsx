'use client';
import { create } from 'zustand';

interface IUserData {
    id: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    funcao: string;
    admin: boolean;
    status: string;
}
interface EditUserModalStore {
    isOpen: boolean;
    userData: IUserData | null;
    onOpen: (data: IUserData | null) => void;
    onClose: () => void;
}

export const useEditUserModal = create<EditUserModalStore>((set) => ({
    isOpen: false,
    userData: null,
    onOpen: (data) => set({ isOpen: true, userData: data }),
    onClose: () => set({ isOpen: false, userData: null }),
}));
