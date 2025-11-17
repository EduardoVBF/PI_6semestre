export type TMaintenance = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  placa: string;
  km_atual: string;
  oleo: boolean;
  filtro_oleo: boolean;
  filtro_combustivel: boolean;
  filtro_ar: boolean;
  engraxamento: boolean;
  status?: string;
};

export type TGetAllMaintenances = TMaintenance[] & {
  maintenances: TMaintenance[];
  total: number;
};
