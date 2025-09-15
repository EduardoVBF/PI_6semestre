"use client";

import { useEditUserModal } from "@/utils/hooks/useEditUserModal";
import EditUserModal from "@/components/modals/editUser";

export default function EditUserModalWrapper() {
  const { isOpen, onClose, userData } = useEditUserModal();
  if (!userData) return null;
  return (
    <EditUserModal
      isOpen={isOpen}
      onClose={onClose}
      userData={userData}
    />
  );
}
