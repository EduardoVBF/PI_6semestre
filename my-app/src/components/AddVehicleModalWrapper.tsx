"use client";

import { useAddVehicleModal } from "@/utils/hooks/useAddVehicleModal";
import AddVehicleModal from "./modals/addVehicleModal";

export default function AddVehicleModalWrapper() {
  const { isOpen, onClose } = useAddVehicleModal() as { isOpen: boolean; onClose: () => void };

  return <AddVehicleModal isOpen={isOpen} onClose={onClose} />;
}
