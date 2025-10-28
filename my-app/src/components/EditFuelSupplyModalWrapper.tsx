"use client";

import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import EditFuelSupplyModal from "@/components/modals/editFuelSupply";

export default function EditFuelSupplyModalWrapper() {
  const { isOpen, onClose, fuelSupply } = useEditFuelSupplyModal();

  if (!fuelSupply) return null;

  return (
    <EditFuelSupplyModal
      isOpen={isOpen}
      onClose={onClose}
      fuelSupply={fuelSupply}
    />
  );
}
