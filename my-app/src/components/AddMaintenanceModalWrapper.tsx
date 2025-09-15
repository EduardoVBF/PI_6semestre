"use client";

import { useAddMaintenanceModal } from "@/utils/hooks/useAddMaintenanceModal";
import AddMaintenanceModal from "@/components/modals/addMaintenance";

export default function AddMaintenanceModalWrapper() {
  const { isOpen, onClose } = useAddMaintenanceModal();
  return <AddMaintenanceModal isOpen={isOpen} onClose={onClose} />;
}
