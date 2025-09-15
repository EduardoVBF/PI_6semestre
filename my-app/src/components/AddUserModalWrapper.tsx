"use client";

import { useAddUserModal } from "@/utils/hooks/useAddUserModal";
import AddUserModal from "@/components/modals/addUserModal";

export default function AddUserModalWrapper() {
  const { isOpen, onClose } = useAddUserModal() as { isOpen: boolean; onClose: () => void };

  return <AddUserModal isOpen={isOpen} onClose={onClose} />;
}
