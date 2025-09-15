"use client";

import { useAddFuelSupplyModal } from "@/utils/hooks/useAddFuelSupplyModal";
import AddFuelSupplyModal from "@/components/modals/addFuelSupply";

export default function AddFuelSupplyModalWrapper() {
  const { isOpen, onClose } = useAddFuelSupplyModal() as { isOpen: boolean; onClose: () => void };

  return <AddFuelSupplyModal isOpen={isOpen} onClose={onClose} />;
}
