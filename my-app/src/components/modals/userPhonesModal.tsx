"use client";
import { MdOutlinePhoneDisabled, MdOutlinePhoneEnabled } from "react-icons/md";
import { X, Phone, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "../loader";
import api from "@/utils/api";
import { TUser } from "@/types/TUser";

export type TGetTelephone = {
  id_user: string;
  number: string;
  status: string;
  id: string;
  created_at: string;
  updated_at: string | null;
};

type TPostTelephone = {
  id_user: string;
  number: string;
  status: string;
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
  const [addingPhone, setAddingPhone] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<TGetTelephone[]>([]);
  const [newPhone, setNewPhone] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("ativo");
  const [showAddPhoneForm, setShowAddPhoneForm] = useState<boolean>(false);

  // === Busca o usuário completo pelo ID ===
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !session?.accessToken) return;
      setLoading(true);
      try {
        const res = await api.get<TUser>(`/api/v1/users/${userId}/`, {
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
  const fetchPhones = async () => {
    if (!userId || !session?.accessToken) return;
    setLoadingPhones(true);
    try {
      const res = await api.get<{
        telephones?: TGetTelephone[];
        telephone_numbers?: TGetTelephone[];
      }>(`/api/v1/telephones/`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        params: { user_id: userId },
      });

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

  // alteração de status
  const handleStatusChange = async (
    id: string,
    newStatus: string,
    number: string
  ) => {
    if (!userId || !session?.accessToken) return;
    setLoading(true);
    try {
      await api.patch(
        `/api/v1/telephones/${id}`,
        { number: number, status: newStatus },
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      toast.success("Status do telefone atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar status do telefone.");
    } finally {
      await fetchPhones();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchPhones();
  }, [isOpen, userId, session]);

  if (!isOpen) return null;

  // === Adicionar telefone ===
  const handleAddPhone = async () => {
    if (!newPhone.trim()) {
      toast.error("Informe um número de telefone.");
      return;
    }

    if (!userId) {
      toast.error("Usuário inválido.");
      return;
    }

    setAddingPhone(true);
    try {
      const payload: TPostTelephone = {
        id_user: userId,
        number: newPhone.trim(),
        status: newStatus,
      };

      await api.post("/api/v1/telephones/", payload, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      toast.success("Telefone adicionado com sucesso!");
      setNewPhone("");
      setNewStatus("ativo");
      await fetchPhones();
    } catch {
      toast.error("Erro ao adicionar telefone.");
    } finally {
      setAddingPhone(false);
    }
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
            {user && (
              <div className="text-gray-200 mb-4 border-b border-gray-700 pb-1 text-center">
                <p className="capitalize">
                  {user.name} {user.lastName}
                </p>
              </div>
            )}

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
                      <div className="flex items-center gap-3">
                        <Phone className="text-primary-purple" size={16} />
                        <span className="text-base font-medium">
                          {phone.number}
                        </span>
                        <span
                          className={`text-sm ${
                            phone.status === "ativo"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {phone.status}
                        </span>
                      </div>
                      {phone.status === "ativo" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(
                              phone.id,
                              phone.status === "ativo" ? "inativo" : "ativo",
                              phone.number
                            );
                          }}
                          title="Desativar"
                          className="p-1 rounded-lg hover:bg-gray-700"
                          aria-label="Desativar telefone"
                        >
                          <MdOutlinePhoneDisabled
                            className="text-gray-300 hover:text-red-500"
                            size={16}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(
                              phone.id,
                              phone.status === "ativo" ? "inativo" : "ativo",
                              phone.number
                            );
                          }}
                          title="Ativar"
                          className="p-1 rounded-lg hover:bg-gray-700"
                          aria-label="Ativar telefone"
                        >
                          <MdOutlinePhoneEnabled
                            className="text-gray-300 hover:text-green-500"
                            size={16}
                          />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Campo para adicionar telefone */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center justify-between pb-1 border-b border-gray-700">
                <p className="text-sm text-gray-200">
                  Adicionar Novo Telefone
                </p>
                {showAddPhoneForm ? (
                  <button
                    onClick={() => setShowAddPhoneForm(false)}
                    className="flex items-center gap-2 text-white hover:text-primary-purple font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <ChevronUp size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddPhoneForm(true)}
                    className="flex items-center gap-2 text-white hover:text-primary-purple font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <ChevronDown size={20} />
                  </button>
                )}
              </div>
              {showAddPhoneForm && (
                <>
                  <Input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Novo telefone"
                    className="h-12 text-lg px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all duration-200"
                  />

                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>

                  <button
                    onClick={handleAddPhone}
                    disabled={addingPhone}
                    className="flex items-center justify-center gap-2 h-12 px-4 bg-primary-purple hover:bg-fuchsia-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60"
                  >
                    {addingPhone ? "" : <PlusCircle size={20} />}
                    {addingPhone ? "Adicionando..." : "Adicionar"}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
