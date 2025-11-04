export type TUser = {
    id: string | number;
    name: string;
    lastName: string;
    email: string;
    cpf: string;
    type: "adm" | "mecanico" | "motorista" | "escritorio";
    status: "ativo" | "inativo" | "pendente";
    password?: string;
};

export type TUserData = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  type: string;
  status: string;
  created_at?: string;
  updated_at?: string | null;
}

export type TUsersResponse = {
    users: TUserData[];
    total: number;
    page: number;
    per_page: number;
}