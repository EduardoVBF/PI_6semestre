'use client';
import { useUserPhonesModal } from "@/utils/hooks/useUserPhonesModal";
import UserPhonesModal from "./modals/userPhonesModal";

export default function UserPhonesModalWrapper() {
  const { isOpen, onClose, userId } = useUserPhonesModal();
    return (
    <UserPhonesModal
      isOpen={isOpen}
      onClose={onClose}
      userId={userId}
    />
  );
}
