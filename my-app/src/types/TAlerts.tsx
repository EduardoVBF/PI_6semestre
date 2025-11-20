export type TAlert = {
  id_veiculo: "string";
  id_abastecimento: "string";
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: "string";
  id: "string";
  placa: "string";
  resolved: boolean;
  created_at: "string";
};
