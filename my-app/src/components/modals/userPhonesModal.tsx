"use client";
import React, { useEffect, useState } from "react";
import { X, Phone, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";
import { TUser } from "@/types/TUser";

type TPostTelephone = {
  id: string;
  user_id: string;
  number: string;
};

export type TGetTelephone = {
  id_user: string;
  number: string;
  status: string;
  id: string;
  created_at: string;
  updated_at: string | null;
};

export default function UserPhonesModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}) {
  const { data: session } = useSession();

  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhones, setLoadingPhones] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<TGetTelephone[]>([]);
  const [newPhone, setNewPhone] = useState<string>("");

  // === Busca o usuário completo pelo ID ===
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !session?.accessToken) return;
      setLoading(true);
      try {
        const res = await api.get<TUser>(`/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        setUser(res.data);
      } catch {
        toast.error("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchUser();
  }, [userId, session, isOpen]);

  // === Busca os telefones do usuário ===
  useEffect(() => {
    const fetchPhones = async () => {
      if (!userId || !session?.accessToken) return;
      setLoadingPhones(true);
      try {
        const res = await api.get<{ telephones?: TGetTelephone[]; telephone_numbers?: TGetTelephone[] }>(
          `/api/v1/telephones/`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            params: { user_id: userId },
          }
        );
        // console.log("response phones:", res);

        // Ajusta se a resposta for um array simples
        const phones = Array.isArray(res.data.telephone_numbers)
          ? res.data.telephone_numbers
          : res.data.telephones || [];

        setPhoneNumbers(phones);
      } catch {
        toast.error("Erro ao carregar telefones do usuário.");
      } finally {
        setLoadingPhones(false);
      }
    };

    if (isOpen) fetchPhones();
  }, [userId, session, isOpen]);

  if (!isOpen) return null;

  const handleAddPhone = () => {
    if (newPhone.trim() !== "") {
      const newPhoneObj: TPostTelephone = {
        id: crypto.randomUUID(),
        user_id: userId || "",
        number: newPhone.trim(),
      };
    //   setPhoneNumbers([...phoneNumbers, newPhoneObj]);
      setNewPhone("");
    }
  };

  const handleRemovePhone = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="w-full max-w-md flex flex-col bg-gray-800 p-8 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Título */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Phone className="text-primary-purple" size={26} />
          <h1 className="text-2xl font-bold text-primary-purple">
            Telefones do Usuário
          </h1>
        </div>

        {/* Loader de usuário */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        ) : (
          <>
            {/* Info do usuário */}
            {user && (
              <div className="space-y-2 text-gray-200 mb-6 border-b border-gray-700 pb-4">
                <p className="capitalize">
                  <span className="font-semibold text-gray-300">Nome:</span>{" "}
                  {user.name} {user.lastName}
                </p>
              </div>
            )}

            {/* Campo para adicionar telefone */}
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Adicionar novo telefone"
                className="flex-1 h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
              />
              <button
                onClick={handleAddPhone}
                className="flex items-center justify-center gap-2 h-12 px-4 bg-primary-purple hover:bg-fuchsia-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <PlusCircle size={20} />
                Adicionar
              </button>
            </div>

            {/* Lista de telefones */}
            {loadingPhones ? (
              <div className="flex justify-center py-6">
                <Loader />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {phoneNumbers.length === 0 ? (
                  <p className="text-gray-400 text-center italic">
                    Nenhum telefone encontrado.
                  </p>
                ) : (
                  phoneNumbers.map((phone, index) => (
                    <div
                      key={phone.id || index}
                      className="flex justify-between items-center bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                    >
                      <span className="text-base">{phone.number}</span>
                      <button
                        onClick={() => handleRemovePhone(index)}
                        className="text-red-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Rodapé */}
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="w-full h-12 text-lg bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
