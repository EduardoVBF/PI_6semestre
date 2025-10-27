"use client";

import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import EditVehicleModal from "./modals/editVehicleModal";

export default function EditVehicleModalWrapper() {
  const { isOpen, onClose, vehicle } = useEditVehicleModal();

  if (!vehicle) return null;

  return (
    <EditVehicleModal isOpen={isOpen} onClose={onClose} vehicle={vehicle} />
  );
}
