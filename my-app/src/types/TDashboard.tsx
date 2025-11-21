export type TDashboard = {
  totalVeiculos: number;
  abastecimentosRecentes: number;
  custoTotalCombustivel: number;
  mediaConsumoFrota: number;
  gastoData: [
    {
      name: string;
      gasto: number;
      consumo: number | null;
    }
  ] | [];
  vehicleConsumptionData: [
    {
      name: string;
      gasto: number | null;
      consumo: number | null;
    }
  ] | [];
  veiculoMaisEconomico: {
    name: string;
    gasto: number | null;
    consumo: number | null;
  };
  veiculoMaisConsome: {
    name: string;
    gasto: number | null;
    consumo: number | null;
  };
};
