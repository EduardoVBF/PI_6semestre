export type TPostVehicle = {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: "carro" | "caminhao" | "moto" | "onibus";
  frota: string;
  km_atual: number;
  frequencia_km_manutencao: number;
  km_prox_manutencao: number;
  capacidade_tanque: number;
  km_ultimo_abastecimento: number;
  id_usuario: string;
};

export type VehicleQueryParams = {
  skip: number;
  limit: number;
  search?: string;
  tipo?: string;
  frota?: string;
  manutencao_vencida?: string;
};
