"use client";

import { useEditVehicleModal } from "@/utils/hooks/useEditVehicleModal";
import EditVehicleModal from "./modals/editVehicleModal";

export default function EditVehicleModalWrapper() {
  const { isOpen, onClose, vehicleId } = useEditVehicleModal();

  if (!vehicleId) return null;

  return (
    <EditVehicleModal isOpen={isOpen} onClose={onClose} vehicleId={vehicleId} />
  );
}
