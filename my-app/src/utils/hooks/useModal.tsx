import { create } from "zustand";

const useModal = create((set) => ({
  status: false
}));

export default useModal;