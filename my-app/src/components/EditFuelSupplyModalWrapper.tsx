"use client";

import { useEditFuelSupplyModal } from "@/utils/hooks/useEditFuelSupplyModal";
import EditFuelSupplyModal from "@/components/modals/editFuelSupply";

export default function EditFuelSupplyModalWrapper() {
  const { isOpen, onClose, fuelSupplyId } = useEditFuelSupplyModal();

  if (!fuelSupplyId) return null;

  return (
    <EditFuelSupplyModal
      isOpen={isOpen}
      onClose={onClose}
      fuelSupplyId={fuelSupplyId}
    />
  );
}
