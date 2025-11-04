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