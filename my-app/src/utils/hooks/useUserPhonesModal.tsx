'use client';
import { create } from 'zustand';

type UserPhonesModalStore = {
  isOpen: boolean;
  userId: string | null;
  onOpen: (userId: string) => void;
  onClose: () => void;
};

export const useUserPhonesModal = create<UserPhonesModalStore>((set) => ({
  isOpen: false,
  userId: null,
  onOpen: (userId) => set({ isOpen: true, userId }),
  onClose: () => set({ isOpen: false, userId: null }),
}));
