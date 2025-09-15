"use client";

import { useEditMaintenanceModal } from "@/utils/hooks/useEditMaintenanceModal";
import EditMaintenanceModal from "@/components/modals/editMaintenance";

export default function EditMaintenanceModalWrapper() {
  const { isOpen, onClose, maintenanceData } = useEditMaintenanceModal();
  if (!maintenanceData) return null;
  return (
    <EditMaintenanceModal
      isOpen={isOpen}
      onClose={onClose}
      maintenanceData={maintenanceData}
    />
  );
}
