export type TGetAllRefuels = {
  refuels: TRefuel[];
  total: number;
  page: number;
  per_page: number;
};

export type TRefuel = {
  id: string;
  data: string;
  hora: string;
  km: number;
  litros: string;
  tipo_combustivel: string;
  valor_litro: string;
  posto: string;
  tanque_cheio: boolean;
  media: number;
  id_usuario: string;
  placa: string;
  valor_total?: string;
  created_at: string;
  updated_at: string;
};
